import bcrypt from 'bcryptjs'
import { adminDb, dbOperations } from '../../utils/db.js'

export default defineEventHandler(async (event) => {
  try {
    const auth = event.context.auth
    const body = await readBody(event)
    const { currentPassword, newPassword, username } = body

    // 获取当前管理员信息
    const admin = await dbOperations.findOne(adminDb, { _id: auth.id })

    if (!admin) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: '用户不存在'
      })
    }

    const updateData = {
      updatedAt: new Date()
    }

    // 如果要修改密码
    if (newPassword) {
      if (!currentPassword) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: '请输入当前密码'
        })
      }

      // 验证当前密码
      const isValidPassword = await bcrypt.compare(currentPassword, admin.password)
      if (!isValidPassword) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: '当前密码错误'
        })
      }

      // 验证新密码长度
      if (newPassword.length < 4) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: '新密码长度不能少于4位'
        })
      }

      // 加密新密码
      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    // 如果要修改用户名
    if (username && username !== admin.username) {
      // 检查用户名是否已存在
      const existingUser = await dbOperations.findOne(adminDb, {
        username,
        _id: { $ne: auth.id }
      })
      if (existingUser) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: '用户名已存在'
        })
      }
      updateData.username = username
    }

    // 更新管理员信息
    await dbOperations.update(adminDb, { _id: auth.id }, { $set: updateData })

    return {
      success: true,
      message: '设置已更新'
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: '更新设置失败'
    })
  }
})