import { authenticateAdmin } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允許POST請求' })
  }

  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: '請提供用戶名和密碼' })
    }

    const token = authenticateAdmin(username, password)

    if (token) {
      // 設定Cookie
      res.setHeader('Set-Cookie', [
        `auth_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
      ])

      res.status(200).json({ 
        success: true, 
        message: '登入成功',
        token 
      })
    } else {
      res.status(401).json({ 
        success: false, 
        error: '用戶名或密碼錯誤' 
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      success: false, 
      error: '伺服器錯誤' 
    })
  }
}

