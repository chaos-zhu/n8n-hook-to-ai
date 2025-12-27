import { hooksDb, keysDb, logsDb, dbOperations, trimLogs } from '../../../utils/db.js'
import { extractApiKey, generateSessionId } from '../../../utils/apiKey.js'

export default defineEventHandler(async (event) => {
  const startTime = Date.now()
  let logData = {
    ip: getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || 'unknown',
    timestamp: new Date(),
    model: '',
    hookId: '',
    request: '',
    response: '',
    duration: 0,
    status: 'failed',
    apiKeyId: '',
    error: ''
  }

  try {
    // 验证API Key
    const authHeader = getHeader(event, 'authorization')
    const apiKey = extractApiKey(authHeader)

    if (!apiKey) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Missing API key'
      })
    }

    // 检查API Key是否有效
    const keyRecord = await dbOperations.findOne(keysDb, { key: apiKey })
    if (!keyRecord) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Invalid API key'
      })
    }

    logData.apiKeyId = keyRecord._id

    // 更新API Key最后使用时间
    await dbOperations.update(keysDb, { _id: keyRecord._id }, {
      $set: { lastUsedAt: new Date() }
    })

    // 解析请求体
    const body = await readBody(event)
    const { model, messages, stream = false, session_id } = body

    if (!model) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Missing model parameter'
      })
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Missing or invalid messages parameter'
      })
    }

    logData.model = model

    // 获取最后一条用户消息作为请求内容
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()
    logData.request = lastUserMessage ? lastUserMessage.content : ''

    // 查找对应的Hook
    const hook = await dbOperations.findOne(hooksDb, { modelName: model, enabled: true })
    if (!hook) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: `Model '${model}' not found or disabled`
      })
    }

    logData.hookId = hook._id

    // 使用客户端传入的 session_id，如果没有则生成新的
    // 这样可以支持连续对话，客户端需要在后续请求中传入相同的 session_id
    const sessionId = session_id || generateSessionId()

    // 构建 chatInput：如果是连续对话，只发送最后一条用户消息
    // 如果是新对话且有多条消息，需要构建完整的对话历史
    let chatInput = ''
    if (session_id) {
      // 连续对话模式：只发送最后一条用户消息
      chatInput = lastUserMessage ? lastUserMessage.content : ''
    } else {
      // 新对话模式：如果有多条消息，构建对话历史
      if (messages.length > 1) {
        // 构建对话历史格式，让 n8n 能理解上下文
        const historyMessages = messages.slice(0, -1)
        const currentMessage = lastUserMessage ? lastUserMessage.content : ''

        // 如果有历史消息，将其格式化为上下文
        if (historyMessages.length > 0) {
          const history = historyMessages.map(m => {
            const role = m.role === 'user' ? '用户' : (m.role === 'assistant' ? '助手' : m.role)
            return `${role}: ${m.content}`
          }).join('\n')
          chatInput = `[对话历史]\n${history}\n\n[当前问题]\n${currentMessage}`
        } else {
          chatInput = currentMessage
        }
      } else {
        chatInput = lastUserMessage ? lastUserMessage.content : ''
      }
    }

    // 如果 chatInput 为空，直接返回空响应，不请求 n8n
    if (!chatInput || !chatInput.trim()) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Empty message content'
      })
    }

    // 构建n8n请求
    const n8nPayload = {
      action: 'sendMessage',
      sessionId: sessionId,
      chatInput: chatInput
    }

    // 调用n8n webhook
    const n8nResponse = await fetch(hook.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain'
      },
      body: JSON.stringify(n8nPayload)
    })

    if (!n8nResponse.ok) {
      throw new Error(`n8n webhook returned ${n8nResponse.status}`)
    }

    // 处理流式响应
    if (stream) {
      // 设置SSE响应头
      setHeader(event, 'Content-Type', 'text/event-stream')
      setHeader(event, 'Cache-Control', 'no-cache')
      setHeader(event, 'Connection', 'keep-alive')
      // 关键：使用 chunked 编码，避免 Content-Length 不匹配导致的 TransferEncodingError
      setHeader(event, 'Transfer-Encoding', 'chunked')
      // 禁用代理缓冲（如 Nginx）
      setHeader(event, 'X-Accel-Buffering', 'no')

      const responseId = `chatcmpl-${generateSessionId()}`
      const created = Math.floor(Date.now() / 1000)
      let fullContent = ''

      // 创建可写流
      const encoder = new TextEncoder()
      const readable = new ReadableStream({
        async start(controller) {
          try {
            const reader = n8nResponse.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''

            while (true) {
              const { done, value } = await reader.read()

              if (done) {
                // 发送结束标记，包含 session_id 供客户端后续使用
                const endChunk = {
                  id: responseId,
                  object: 'chat.completion.chunk',
                  created: created,
                  model: model,
                  session_id: sessionId,
                  choices: [{
                    index: 0,
                    delta: {},
                    finish_reason: 'stop'
                  }]
                }
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(endChunk)}\n\n`))
                controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                controller.close()
                break
              }

              buffer += decoder.decode(value, { stream: true })

              // 解析n8n的SSE响应（多个JSON对象连接在一起）
              const jsonObjects = parseN8nResponse(buffer)
              buffer = jsonObjects.remaining

              for (const obj of jsonObjects.parsed) {
                if (obj.type === 'item' && obj.content) {
                  fullContent += obj.content

                  // 转换为OpenAI格式的chunk
                  const chunk = {
                    id: responseId,
                    object: 'chat.completion.chunk',
                    created: created,
                    model: model,
                    choices: [{
                      index: 0,
                      delta: {
                        content: obj.content
                      },
                      finish_reason: null
                    }]
                  }

                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
                }
              }
            }

            // 记录日志
            logData.response = fullContent
            logData.duration = Date.now() - startTime
            logData.status = 'success'
            await saveLog(logData)

          } catch (error) {
            logData.error = error.message
            logData.duration = Date.now() - startTime
            await saveLog(logData)
            controller.error(error)
          }
        }
      })

      return sendStream(event, readable)
    } else {
      // 非流式响应 - 收集所有内容后返回
      const responseText = await n8nResponse.text()
      const jsonObjects = parseN8nResponse(responseText)

      let fullContent = ''
      for (const obj of jsonObjects.parsed) {
        if (obj.type === 'item' && obj.content) {
          fullContent += obj.content
        }
      }

      const responseId = `chatcmpl-${generateSessionId()}`
      const created = Math.floor(Date.now() / 1000)

      // 记录日志
      logData.response = fullContent
      logData.duration = Date.now() - startTime
      logData.status = 'success'
      await saveLog(logData)

      return {
        id: responseId,
        object: 'chat.completion',
        created: created,
        model: model,
        session_id: sessionId,
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: fullContent
          },
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0
        }
      }
    }
  } catch (error) {
    // 记录错误日志
    logData.error = error.message || 'Unknown error'
    logData.duration = Date.now() - startTime
    await saveLog(logData)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: error.message || 'Failed to process chat completion'
    })
  }
})

// 解析n8n的响应（多个JSON对象连接在一起）
function parseN8nResponse(text) {
  const parsed = []
  let remaining = text
  let startIndex = 0

  while (startIndex < remaining.length) {
    // 查找JSON对象的开始
    const objStart = remaining.indexOf('{', startIndex)
    if (objStart === -1) break

    // 尝试解析JSON对象
    let depth = 0
    let objEnd = objStart

    for (let i = objStart; i < remaining.length; i++) {
      if (remaining[i] === '{') depth++
      else if (remaining[i] === '}') depth--

      if (depth === 0) {
        objEnd = i + 1
        break
      }
    }

    if (depth !== 0) {
      // JSON对象不完整，保留剩余部分
      remaining = remaining.substring(objStart)
      break
    }

    try {
      const jsonStr = remaining.substring(objStart, objEnd)
      const obj = JSON.parse(jsonStr)
      parsed.push(obj)
      startIndex = objEnd
    } catch (e) {
      // 解析失败，跳过这个字符
      startIndex = objStart + 1
    }
  }

  if (startIndex >= remaining.length) {
    remaining = ''
  } else if (startIndex > 0) {
    remaining = remaining.substring(startIndex)
  }

  return { parsed, remaining }
}

// 保存日志
async function saveLog(logData) {
  try {
    await dbOperations.insert(logsDb, logData)
    // 清理超过500条的日志
    await trimLogs()
  } catch (error) {
    console.error('Failed to save log:', error)
  }
}