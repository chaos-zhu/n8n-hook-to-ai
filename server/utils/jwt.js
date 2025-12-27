import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { configDb, dbOperations } from './db.js'

// 缓存JWT密钥，避免每次都查询数据库
let cachedSecret = null

// 生成随机密钥
const generateRandomSecret = () => {
  return crypto.randomBytes(64).toString('hex')
}

// 获取JWT密钥（从数据库获取，如果不存在则生成并保存）
const getSecret = async () => {
  // 如果有缓存，直接返回
  if (cachedSecret) {
    return cachedSecret
  }

  // 从数据库获取
  const config = await dbOperations.findOne(configDb, { key: 'jwt_secret' })

  if (config) {
    cachedSecret = config.value
    return cachedSecret
  }

  // 生成新的密钥并保存到数据库
  const newSecret = generateRandomSecret()
  await dbOperations.insert(configDb, {
    key: 'jwt_secret',
    value: newSecret,
    createdAt: new Date()
  })

  cachedSecret = newSecret
  return cachedSecret
}

// 同步获取密钥（用于需要同步调用的场景，必须先调用initJwtSecret初始化）
const getSecretSync = () => {
  if (!cachedSecret) {
    throw new Error('JWT secret not initialized. Call initJwtSecret() first.')
  }
  return cachedSecret
}

// 初始化JWT密钥（应用启动时调用）
export const initJwtSecret = async () => {
  await getSecret()
  console.log('[JWT] Secret initialized')
}

// 生成JWT Token
export const generateToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, getSecretSync(), { expiresIn })
}

// 验证JWT Token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, getSecretSync())
  } catch (error) {
    return null
  }
}

// 从请求头中提取Token
export const extractToken = (authHeader) => {
  if (!authHeader) return null

  // 支持 "Bearer token" 格式
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  return authHeader
}