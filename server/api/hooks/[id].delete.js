import { hooksDb, dbOperations } from '../../utils/db.js'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    // 检查Hook是否存在
    const existingHook = await dbOperations.findOne(hooksDb, { _id: id })
    if (!existingHook) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Hook不存在'
      })
    }

    // 删除Hook
    await dbOperations.remove(hooksDb, { _id: id })

    return {
      success: true,
      message: 'Hook已删除'
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: '删除Hook失败'
    })
  }
})