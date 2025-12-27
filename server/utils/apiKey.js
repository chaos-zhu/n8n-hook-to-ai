import { v4 as uuidv4 } from 'uuid'

// 生成类似OpenAI格式的API Key
// 格式: sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
export const generateApiKey = () => {
  // 生成两个UUID并拼接，然后取前48个字符
  const uuid1 = uuidv4().replace(/-/g, '')
  const uuid2 = uuidv4().replace(/-/g, '')
  const combined = uuid1 + uuid2

  // 返回 sk- 前缀 + 48个字符
  return `sk-${combined.substring(0, 48)}`
}

// 验证API Key格式
export const isValidApiKeyFormat = (key) => {
  if (!key || typeof key !== 'string') return false

  // 检查是否以 sk- 开头，后面跟着48个字母数字字符
  const pattern = /^sk-[a-f0-9]{48}$/
  return pattern.test(key)
}

// 从请求头中提取API Key
export const extractApiKey = (authHeader) => {
  if (!authHeader) return null

  // 支持 "Bearer sk-xxx" 格式
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  return authHeader
}

// 生成会话ID (用于n8n webhook)
export const generateSessionId = () => {
  return uuidv4()
}