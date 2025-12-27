import { keysDb, dbOperations } from '../../utils/db.js'

export default defineEventHandler(async (event) => {
  try {
    // 获取所有API Key，按创建时间倒序
    const keys = await dbOperations.find(keysDb, {}, { createdAt: -1 })

    // 隐藏完整的key，只显示前缀和后4位
    const maskedKeys = keys.map(key => ({
      ...key,
      key: `${key.key.substring(0, 7)}...${key.key.substring(key.key.length - 4)}`
    }))

    return {
      success: true,
      data: maskedKeys
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: '获取API Key列表失败'
    })
  }
})