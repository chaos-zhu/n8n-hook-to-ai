import { logsDb, dbOperations, trimLogs } from '../../../utils/db.js'
import { generateSessionId } from '../../../utils/apiKey.js'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { input = 'hi', webhookUrl } = body

  if (!webhookUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: '缺少 webhookUrl 参数'
    })
  }

  // 设置SSE响应头
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')

  const encoder = new TextEncoder()
  const startTime = Date.now()

  // 日志数据
  const logData = {
    ip: getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || 'unknown',
    timestamp: new Date(),
    model: '[测试]',
    hookId: id || '',
    request: input,
    response: '',
    duration: 0,
    status: 'failed',
    apiKeyId: '',
    error: ''
  }

  // 发送SSE事件的辅助函数
  const sendEvent = (controller, eventType, data) => {
    const eventData = JSON.stringify({ type: eventType, ...data })
    controller.enqueue(encoder.encode(`data: ${eventData}\n\n`))
  }

  // 保存日志
  const saveLog = async (logData) => {
    try {
      await dbOperations.insert(logsDb, logData)
      await trimLogs()
    } catch (error) {
      console.error('Failed to save log:', error)
    }
  }

  const readable = new ReadableStream({
    async start(controller) {
      let fullContent = ''

      try {
        // 发送开始事件
        sendEvent(controller, 'start', { input, timestamp: Date.now() })

        // 生成会话ID
        const sessionId = generateSessionId()

        // 构建n8n请求
        const n8nPayload = {
          action: 'sendMessage',
          sessionId: sessionId,
          chatInput: input
        }

        // 调用n8n webhook
        const n8nResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
          },
          body: JSON.stringify(n8nPayload)
        })

        if (!n8nResponse.ok) {
          const duration = Date.now() - startTime
          const errorMsg = `Webhook返回错误: ${n8nResponse.status} ${n8nResponse.statusText}`

          sendEvent(controller, 'error', {
            error: errorMsg,
            status: n8nResponse.status,
            duration
          })
          sendEvent(controller, 'done', { duration })

          // 记录失败日志
          logData.duration = duration
          logData.error = errorMsg
          await saveLog(logData)

          controller.close()
          return
        }

        // 流式读取响应
        const reader = n8nResponse.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            // 处理剩余buffer
            if (buffer) {
              const jsonObjects = parseN8nResponse(buffer)
              for (const obj of jsonObjects.parsed) {
                if (obj.type === 'item' && obj.content) {
                  fullContent += obj.content
                  sendEvent(controller, 'content', { content: obj.content })
                }
              }
            }
            break
          }

          buffer += decoder.decode(value, { stream: true })

          // 解析n8n的响应
          const jsonObjects = parseN8nResponse(buffer)
          buffer = jsonObjects.remaining

          for (const obj of jsonObjects.parsed) {
            if (obj.type === 'item' && obj.content) {
              fullContent += obj.content
              sendEvent(controller, 'content', { content: obj.content })
            }
          }
        }

        // 如果没有解析到内容，尝试直接返回原始响应
        if (!fullContent && buffer) {
          fullContent = buffer
          sendEvent(controller, 'content', { content: buffer })
        }

        const duration = Date.now() - startTime
        sendEvent(controller, 'done', {
          duration,
          status: n8nResponse.status
        })

        // 记录成功日志
        logData.response = fullContent
        logData.duration = duration
        logData.status = 'success'
        await saveLog(logData)

        controller.close()

      } catch (error) {
        const duration = Date.now() - startTime
        const errorMsg = error.message || '测试失败'

        sendEvent(controller, 'error', {
          error: errorMsg,
          duration
        })
        sendEvent(controller, 'done', { duration })

        // 记录错误日志
        logData.response = fullContent
        logData.duration = duration
        logData.error = errorMsg
        await saveLog(logData)

        controller.close()
      }
    }
  })

  return sendStream(event, readable)
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