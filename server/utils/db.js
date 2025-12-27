import Datastore from '@seald-io/nedb'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync, mkdirSync } from 'fs'

// 获取数据目录路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const dataDir = join(__dirname, '../../data')

// 确保数据目录存在
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

// 创建数据库实例
const createDatabase = (filename) => {
  return new Datastore({
    filename: join(dataDir, filename),
    autoload: true
  })
}

// 数据库实例
export const adminDb = createDatabase('admin.db')
export const hooksDb = createDatabase('hooks.db')
export const keysDb = createDatabase('keys.db')
export const logsDb = createDatabase('logs.db')
export const configDb = createDatabase('config.db')

// 通用数据库操作封装
export const dbOperations = {
  // 查找单个文档
  findOne: (db, query) => {
    return new Promise((resolve, reject) => {
      db.findOne(query, (err, doc) => {
        if (err) reject(err)
        else resolve(doc)
      })
    })
  },

  // 查找多个文档
  find: (db, query = {}, sort = {}, limit = 0) => {
    return new Promise((resolve, reject) => {
      let cursor = db.find(query)
      if (Object.keys(sort).length > 0) {
        cursor = cursor.sort(sort)
      }
      if (limit > 0) {
        cursor = cursor.limit(limit)
      }
      cursor.exec((err, docs) => {
        if (err) reject(err)
        else resolve(docs)
      })
    })
  },

  // 插入文档
  insert: (db, doc) => {
    return new Promise((resolve, reject) => {
      db.insert(doc, (err, newDoc) => {
        if (err) reject(err)
        else resolve(newDoc)
      })
    })
  },

  // 更新文档
  update: (db, query, update, options = {}) => {
    return new Promise((resolve, reject) => {
      db.update(query, update, options, (err, numAffected) => {
        if (err) reject(err)
        else resolve(numAffected)
      })
    })
  },

  // 删除文档
  remove: (db, query, options = {}) => {
    return new Promise((resolve, reject) => {
      db.remove(query, options, (err, numRemoved) => {
        if (err) reject(err)
        else resolve(numRemoved)
      })
    })
  },

  // 统计文档数量
  count: (db, query = {}) => {
    return new Promise((resolve, reject) => {
      db.count(query, (err, count) => {
        if (err) reject(err)
        else resolve(count)
      })
    })
  }
}

// 日志数据库特殊操作 - 保持最多500条记录
export const trimLogs = async () => {
  const count = await dbOperations.count(logsDb)
  if (count > 500) {
    // 获取最旧的记录并删除
    const oldLogs = await dbOperations.find(logsDb, {}, { timestamp: 1 }, count - 500)
    const oldIds = oldLogs.map(log => log._id)
    await dbOperations.remove(logsDb, { _id: { $in: oldIds } }, { multi: true })
  }
}