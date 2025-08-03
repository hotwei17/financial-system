import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { username, password } = req.body

  // 簡單的管理員驗證（實際應用中應該從資料庫查詢）
  const adminUsername = 'admin'
  const adminPassword = 'admin123' // 實際應用中應該是加密的

  if (username === adminUsername && password === adminPassword) {
    const token = jwt.sign(
      { username: adminUsername },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    // 設置 HTTP-only cookie
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=86400`)
    
    res.status(200).json({ 
      message: '登入成功',
      token 
    })
  } else {
    res.status(401).json({ message: '使用者名稱或密碼錯誤' })
  }
}

