import { connect } from '@planetscale/database'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const config = {
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    }

    const conn = connect(config)

    const result = await conn.execute(
      'SELECT * FROM financial_submissions ORDER BY created_at DESC'
    )

    res.status(200).json({ 
      submissions: result.rows 
    })

  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ 
      message: '伺服器錯誤',
      error: error.message 
    })
  }
}

