import { adminDb, dbOperations } from '../../utils/db.js'

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth

    // 获取当前管理员信息
    const admin = await dbOperations.findOne(adminDb, { _id: auth.id })

    if (!admin) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: '用户不存在'
      })
    }

    return {
      success: true,
      data: {
        username: admin.username,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt
      }
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: '获取设置失败'
    })
  }
})