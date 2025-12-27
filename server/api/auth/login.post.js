import bcrypt from 'bcryptjs'
import { adminDb, dbOperations } from '../../utils/db.js'
import { generateToken } from '../../utils/jwt.js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { username, password } = body

    // 验证输入
    if (!username || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: '用户名和密码不能为空'
      })
    }

    // 查找用户
    const admin = await dbOperations.findOne(adminDb, { username })

    if (!admin) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: '用户名或密码错误'
      })
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, admin.password)

    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: '用户名或密码错误'
      })
    }

    // 生成JWT Token
    const token = generateToken({
      id: admin._id,
      username: admin.username
    })

    return {
      success: true,
      data: {
        token,
        user: {
          id: admin._id,
          username: admin.username
        }
      }
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: '登录失败，请稍后重试'
    })
  }
})