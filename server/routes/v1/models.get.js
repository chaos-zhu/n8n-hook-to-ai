import { hooksDb, keysDb, dbOperations } from '../../utils/db.js'
import { extractApiKey } from '../../utils/apiKey.js'

export default defineEventHandler(async (event) => {
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

    // 获取所有启用的Hook作为模型
    const hooks = await dbOperations.find(hooksDb, { enabled: true })

    // 转换为OpenAI模型格式
    const models = hooks.map(hook => ({
      id: hook.modelName,
      object: 'model',
      created: Math.floor(new Date(hook.createdAt).getTime() / 1000),
      owned_by: 'n8n-hook'
    }))

    return {
      object: 'list',
      data: models
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to fetch models'
    })
  }
})