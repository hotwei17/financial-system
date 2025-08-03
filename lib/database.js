import { connect } from '@planetscale/database'

const config = {
  url: process.env.DATABASE_URL
}

export const db = connect(config)

// 初始化資料表
export async function initDatabase() {
  try {
    // 創建財務提交表
    await db.execute(`
      CREATE TABLE IF NOT EXISTS financial_submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        name VARCHAR(100),
        annual_income DECIMAL(10,2) DEFAULT 0,
        birth_date DATE,
        spouse_name VARCHAR(100),
        spouse_annual_income DECIMAL(10,2) DEFAULT 0,
        spouse_birth_date DATE,
        properties_data TEXT,
        presales_data TEXT,
        cash DECIMAL(10,2) DEFAULT 0,
        stocks DECIMAL(10,2) DEFAULT 0,
        dividend_investments DECIMAL(10,2) DEFAULT 0,
        dividend_monthly_income DECIMAL(10,2) DEFAULT 0,
        insurance_value DECIMAL(10,2) DEFAULT 0,
        personal_loan DECIMAL(10,2) DEFAULT 0,
        personal_loan_monthly DECIMAL(10,2) DEFAULT 0,
        car_loan DECIMAL(10,2) DEFAULT 0,
        car_loan_monthly DECIMAL(10,2) DEFAULT 0,
        stock_pledge DECIMAL(10,2) DEFAULT 0,
        stock_pledge_monthly DECIMAL(10,2) DEFAULT 0,
        insurance_loan DECIMAL(10,2) DEFAULT 0,
        insurance_loan_monthly DECIMAL(10,2) DEFAULT 0,
        INDEX idx_submission_date (submission_date),
        INDEX idx_name (name)
      )
    `)
    
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization error:', error)
  }
}

// 儲存財務資料
export async function saveFinancialData(formData) {
  try {
    const result = await db.execute(
      `INSERT INTO financial_submissions (
        name, annual_income, birth_date, spouse_name, spouse_annual_income, spouse_birth_date,
        properties_data, presales_data, cash, stocks, dividend_investments, dividend_monthly_income,
        insurance_value, personal_loan, personal_loan_monthly, car_loan, car_loan_monthly,
        stock_pledge, stock_pledge_monthly, insurance_loan, insurance_loan_monthly
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        formData.personalInfo.name,
        parseFloat(formData.personalInfo.annualIncome) || 0,
        formData.personalInfo.birthDate,
        formData.personalInfo.spouseName || null,
        parseFloat(formData.personalInfo.spouseAnnualIncome) || 0,
        formData.personalInfo.spouseBirthDate || null,
        JSON.stringify(formData.properties),
        JSON.stringify(formData.presales),
        parseFloat(formData.assets.cash) || 0,
        parseFloat(formData.assets.stocks) || 0,
        parseFloat(formData.assets.dividendInvestments) || 0,
        parseFloat(formData.assets.dividendMonthlyIncome) || 0,
        parseFloat(formData.assets.insuranceValue) || 0,
        parseFloat(formData.debts.personalLoan) || 0,
        parseFloat(formData.debts.personalLoanMonthly) || 0,
        parseFloat(formData.debts.carLoan) || 0,
        parseFloat(formData.debts.carLoanMonthly) || 0,
        parseFloat(formData.debts.stockPledge) || 0,
        parseFloat(formData.debts.stockPledgeMonthly) || 0,
        parseFloat(formData.debts.insuranceLoan) || 0,
        parseFloat(formData.debts.insuranceLoanMonthly) || 0
      ]
    )
    
    return { success: true, id: result.insertId }
  } catch (error) {
    console.error('Save financial data error:', error)
    return { success: false, error: error.message }
  }
}

// 獲取所有提交資料
export async function getAllSubmissions() {
  try {
    const result = await db.execute('SELECT * FROM financial_submissions ORDER BY submission_date DESC')
    return result.rows
  } catch (error) {
    console.error('Get submissions error:', error)
    return []
  }
}

