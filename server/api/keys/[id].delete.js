import { keysDb, dbOperations } from '../../utils/db.js'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    // 检查Key是否存在
    const existingKey = await dbOperations.findOne(keysDb, { _id: id })
    if (!existingKey) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'API Key不存在'
      })
    }

    // 删除Key
    await dbOperations.remove(keysDb, { _id: id })

    return {
      success: true,
      message: 'API Key已删除'
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: '删除API Key失败'
    })
  }
})