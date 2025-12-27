import bcrypt from 'bcryptjs'
import { adminDb, dbOperations } from '../utils/db.js'
import { initJwtSecret } from '../utils/jwt.js'

export default defineNitroPlugin(async () => {
  console.log('[Init] Initializing application...')

  try {
    // 初始化JWT密钥
    await initJwtSecret()

    // 检查是否已存在管理员账户
    const existingAdmin = await dbOperations.findOne(adminDb, {})

    if (!existingAdmin) {
      // 创建默认管理员账户
      const hashedPassword = await bcrypt.hash('admin', 10)

      await dbOperations.insert(adminDb, {
        username: 'admin',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      console.log('[Init] Default admin account created (username: admin, password: admin)')
    } else {
      console.log('[Init] Admin account already exists')
    }
  } catch (error) {
    console.error('[Init] Error initializing application:', error)
  }
})