import { logsDb, dbOperations } from '../../utils/db.js'

export default defineEventHandler(async (event) => {
  try {
    // 获取查询参数
    const query = getQuery(event)
    const { status, model, limit = 50, skip = 0 } = query

    // 构建查询条件
    const filter = {}
    if (status) {
      filter.status = status
    }
    if (model) {
      filter.model = model
    }

    // 获取日志，按时间倒序，限制返回数量
    const logs = await dbOperations.find(logsDb, filter, { timestamp: -1 })

    // 分页处理
    const total = logs.length
    const paginatedLogs = logs.slice(Number(skip), Number(skip) + Number(limit))

    return {
      success: true,
      data: {
        logs: paginatedLogs,
        total,
        limit: Number(limit),
        skip: Number(skip)
      }
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: '获取日志列表失败'
    })
  }
})