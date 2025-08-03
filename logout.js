export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // 清除 cookie
  res.setHeader('Set-Cookie', 'token=; HttpOnly; Path=/; Max-Age=0')
  
  res.status(200).json({ message: '登出成功' })
}

