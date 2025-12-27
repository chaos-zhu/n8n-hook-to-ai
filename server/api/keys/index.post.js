import { keysDb, dbOperations } from '../../utils/db.js'
import { generateApiKey } from '../../utils/apiKey.js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name = '' } = body

    // 生成新的API Key
    const apiKey = generateApiKey()

    // 保存到数据库
    const newKey = await dbOperations.insert(keysDb, {
      key: apiKey,
      name,
      createdAt: new Date(),
      lastUsedAt: null
    })

    // 返回完整的key（仅在创建时返回一次）
    return {
      success: true,
      data: {
        ...newKey,
        fullKey: apiKey  // 完整的key，用于复制到剪贴板
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: '生成API Key失败'
    })
  }
})