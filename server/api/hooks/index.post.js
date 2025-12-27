import { hooksDb, dbOperations } from '../../utils/db.js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, modelName, webhookUrl, enabled = true } = body

    // 验证必填字段
    if (!name || !modelName || !webhookUrl) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: '名称、模型名称和Webhook URL不能为空'
      })
    }

    // 检查模型名称是否已存在
    const existingHook = await dbOperations.findOne(hooksDb, { modelName })
    if (existingHook) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: '该模型名称已存在'
      })
    }

    // 创建新Hook
    const newHook = await dbOperations.insert(hooksDb, {
      name,
      modelName,
      webhookUrl,
      enabled,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return {
      success: true,
      data: newHook
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: '创建Hook失败'
    })
  }
})