import { verifyToken, extractToken } from '../utils/jwt.js'

export default defineEventHandler((event) => {
  const url = getRequestURL(event)
  const path = url.pathname

  // 不需要认证的路径
  const publicPaths = [
    '/api/auth/login',
    '/api/v1/models',
    '/api/v1/chat/completions'
  ]

  // 检查是否是公开路径
  if (publicPaths.some(p => path.startsWith(p))) {
    return
  }

  // 检查是否是需要JWT认证的API路径
  if (path.startsWith('/api/') && !path.startsWith('/api/v1/')) {
    const authHeader = getHeader(event, 'authorization')
    const token = extractToken(authHeader)

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: '未提供认证令牌'
      })
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: '无效或过期的认证令牌'
      })
    }

    // 将用户信息附加到事件上下文
    event.context.auth = decoded
  }
})