export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允許POST請求' })
  }

  try {
    // 清除Cookie
    res.setHeader('Set-Cookie', [
      `auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
    ])

    res.status(200).json({ 
      success: true, 
      message: '登出成功' 
    })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ 
      success: false, 
      error: '伺服器錯誤' 
    })
  }
}

