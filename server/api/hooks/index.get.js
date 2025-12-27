import { hooksDb, dbOperations } from '../../utils/db.js'

export default defineEventHandler(async (event) => {
  try {
    // 获取所有Hook，按创建时间倒序
    const hooks = await dbOperations.find(hooksDb, {}, { createdAt: -1 })

    return {
      success: true,
      data: hooks
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: '获取Hook列表失败'
    })
  }
})