import { connect } from '@planetscale/database'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const config = {
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
    }

    const conn = connect(config)

    const {
      name,
      annualIncome,
      birthDate,
      propertyAddress,
      propertyValue,
      loanBalance,
      monthlyPayment,
      purchasePrice,
      downPayment,
      loanAmount,
      purpose
    } = req.body

    // 插入資料到資料庫
    const result = await conn.execute(
      `INSERT INTO financial_submissions (
        name, annual_income, birth_date, property_address, property_value,
        loan_balance, monthly_payment, purchase_price, down_payment,
        loan_amount, purpose, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        name,
        annualIncome,
        birthDate,
        propertyAddress,
        propertyValue,
        loanBalance,
        monthlyPayment,
        purchasePrice,
        downPayment,
        loanAmount,
        purpose
      ]
    )

    res.status(200).json({ 
      message: '表單提交成功',
      id: result.insertId 
    })

  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ 
      message: '伺服器錯誤',
      error: error.message 
    })
  }
}

