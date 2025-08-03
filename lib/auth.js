import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'hotwei17'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync('780210', 10)

export function verifyPassword(password) {
  return bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)
}

export function generateToken(username) {
  return jwt.sign(
    { username, isAdmin: true },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function authenticateAdmin(username, password) {
  if (username === ADMIN_USERNAME && verifyPassword(password)) {
    return generateToken(username)
  }
  return null
}

// 中間件：檢查管理員權限
export function requireAuth(handler) {
  return async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '') || 
                   req.cookies?.auth_token

      if (!token) {
        return res.status(401).json({ error: '未授權訪問' })
      }

      const decoded = verifyToken(token)
      if (!decoded || !decoded.isAdmin) {
        return res.status(401).json({ error: '無效的認證令牌' })
      }

      req.user = decoded
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ error: '認證失敗' })
    }
  }
}

