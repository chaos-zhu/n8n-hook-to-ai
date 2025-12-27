import { hooksDb, dbOperations } from '../../utils/db.js'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { name, modelName, webhookUrl, enabled } = body

    // 检查Hook是否存在
    const existingHook = await dbOperations.findOne(hooksDb, { _id: id })
    if (!existingHook) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Hook不存在'
      })
    }

    // 如果修改了模型名称，检查是否与其他Hook冲突
    if (modelName && modelName !== existingHook.modelName) {
      const conflictHook = await dbOperations.findOne(hooksDb, {
        modelName,
        _id: { $ne: id }
      })
      if (conflictHook) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: '该模型名称已被其他Hook使用'
        })
      }
    }

    // 构建更新对象
    const updateData = {
      updatedAt: new Date()
    }

    if (name !== undefined) updateData.name = name
    if (modelName !== undefined) updateData.modelName = modelName
    if (webhookUrl !== undefined) updateData.webhookUrl = webhookUrl
    if (enabled !== undefined) updateData.enabled = enabled

    // 更新Hook
    await dbOperations.update(hooksDb, { _id: id }, { $set: updateData })

    // 获取更新后的Hook
    const updatedHook = await dbOperations.findOne(hooksDb, { _id: id })

    return {
      success: true,
      data: updatedHook
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: '更新Hook失败'
    })
  }
})