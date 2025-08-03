import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Admin() {
  const [submissions, setSubmissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/submissions')
      const data = await response.json()

      if (data.success) {
        setSubmissions(data.data)
      } else {
        setError(data.error || '獲取資料失敗')
      }
    } catch (error) {
      console.error('Fetch submissions error:', error)
      setError('獲取資料失敗')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const calculateTotals = (submission) => {
    // 計算總資產
    const propertyValue = submission.properties.reduce((sum, prop) => 
      sum + (parseFloat(prop.estimatedMarketPrice) || 0), 0)
    const presaleValue = submission.presales.reduce((sum, presale) => 
      sum + (parseFloat(presale.contractPrice) || 0), 0)
    const totalAssets = propertyValue + presaleValue + 
      (parseFloat(submission.cash) || 0) + 
      (parseFloat(submission.stocks) || 0) + 
      (parseFloat(submission.dividend_investments) || 0) + 
      (parseFloat(submission.insurance_value) || 0)

    // 計算總負債
    const propertyLoans = submission.properties.reduce((sum, prop) => 
      sum + (parseFloat(prop.loanBalance) || 0), 0)
    const presalePayments = submission.presales.reduce((sum, presale) => 
      sum + (parseFloat(presale.remainingPayment) || 0), 0)
    const totalDebts = propertyLoans + presalePayments + 
      (parseFloat(submission.personal_loan) || 0) + 
      (parseFloat(submission.car_loan) || 0) + 
      (parseFloat(submission.stock_pledge) || 0) + 
      (parseFloat(submission.insurance_loan) || 0)

    // 計算月付金總額
    const propertyMonthly = submission.properties.reduce((sum, prop) => 
      sum + (parseFloat(prop.monthlyPayment) || 0), 0)
    const totalMonthlyPayments = propertyMonthly + 
      (parseFloat(submission.personal_loan_monthly) || 0) + 
      (parseFloat(submission.car_loan_monthly) || 0) + 
      (parseFloat(submission.stock_pledge_monthly) || 0) + 
      (parseFloat(submission.insurance_loan_monthly) || 0)

    // 計算月收入總額
    const totalMonthlyIncome = (parseFloat(submission.dividend_monthly_income) || 0)

    return {
      totalAssets,
      totalDebts,
      netWorth: totalAssets - totalDebts,
      totalMonthlyPayments,
      totalMonthlyIncome
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchSubmissions}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            重新載入
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>管理介面 - 財務資訊系統</title>
      </Head>

      {/* 頂部導航 */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl mr-2">👥</span>
              <h1 className="text-xl font-bold text-gray-800">客戶資料管理</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <span className="mr-1">🚪</span>
              登出
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 統計概覽 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <span className="text-3xl text-blue-500 mr-3">👥</span>
              <div>
                <p className="text-sm text-gray-600">總客戶數</p>
                <p className="text-2xl font-bold text-gray-800">{submissions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <span className="text-3xl text-green-500 mr-3">💰</span>
              <div>
                <p className="text-sm text-gray-600">總資產價值</p>
                <p className="text-2xl font-bold text-gray-800">
                  {submissions.reduce((sum, s) => sum + calculateTotals(s).totalAssets, 0).toFixed(1)}萬
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <span className="text-3xl text-purple-500 mr-3">📊</span>
              <div>
                <p className="text-sm text-gray-600">匯出資料</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  下載Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 客戶列表 */}
        {submissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <span className="text-6xl text-gray-300 block mb-4">👥</span>
            <h3 className="text-lg font-medium text-gray-800 mb-2">目前還沒有任何客戶資料</h3>
            <p className="text-gray-600">當有客戶提交表格後，資料會顯示在這裡</p>
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map((submission, index) => {
              const totals = calculateTotals(submission)
              
              return (
                <div
                  key={submission.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    {/* 客戶基本資訊 */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-xl">👤</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{submission.name}</h3>
                          <p className="text-sm text-gray-600">
                            <span className="mr-1">📅</span>
                            提交時間: {submission.submission_date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">客戶編號</p>
                        <p className="font-mono text-lg">#00{submission.id}</p>
                      </div>
                    </div>

                    {/* 財務摘要 */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">總資產</p>
                        <p className="text-lg font-bold text-green-600">{totals.totalAssets.toFixed(1)}萬</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">總負債</p>
                        <p className="text-lg font-bold text-red-600">{totals.totalDebts.toFixed(1)}萬</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">淨資產</p>
                        <p className={`text-lg font-bold ${totals.netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {totals.netWorth.toFixed(1)}萬
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">月付金</p>
                        <p className="text-lg font-bold text-orange-600">{totals.totalMonthlyPayments.toLocaleString()}元</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">月收入</p>
                        <p className="text-lg font-bold text-blue-600">{totals.totalMonthlyIncome.toLocaleString()}元</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* 個人資訊 */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800 flex items-center">
                          <span className="mr-2">👤</span>
                          個人資訊
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div><strong>年收入:</strong> {submission.annual_income}萬</div>
                          <div><strong>出生日期:</strong> {new Date(submission.birth_date).toLocaleDateString('zh-TW')}</div>
                          {submission.spouse_name && (
                            <>
                              <div className="flex items-center pt-2 border-t">
                                <span className="mr-1">❤️</span>
                                <strong>配偶資訊</strong>
                              </div>
                              <div><strong>配偶姓名:</strong> {submission.spouse_name}</div>
                              <div><strong>配偶年收入:</strong> {submission.spouse_annual_income}萬</div>
                              {submission.spouse_birth_date && (
                                <div><strong>配偶出生日期:</strong> {new Date(submission.spouse_birth_date).toLocaleDateString('zh-TW')}</div>
                              )}
                            </>
                          )}
                        </div>

                        {/* 動產資訊 */}
                        <h4 className="font-semibold text-gray-800 flex items-center">
                          <span className="mr-2">💰</span>
                          動產資訊
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div><strong>現金:</strong> {submission.cash}萬</div>
                          <div><strong>股票:</strong> {submission.stocks}萬</div>
                          <div><strong>有配息投資:</strong> {submission.dividend_investments}萬</div>
                          <div><strong>配息月收入:</strong> {submission.dividend_monthly_income}元</div>
                          <div><strong>保單價值金:</strong> {submission.insurance_value}萬</div>
                        </div>
                      </div>

                      {/* 房產和負債資訊 */}
                      <div className="space-y-4">
                        {/* 房產資訊 */}
                        {submission.properties.length > 0 && (
                          <>
                            <h4 className="font-semibold text-gray-800 flex items-center">
                              <span className="mr-2">🏠</span>
                              房產資訊
                            </h4>
                            <div className="space-y-3">
                              {submission.properties.map((property, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                                  <div><strong>地址:</strong> {property.address || '未填寫'}</div>
                                  <div><strong>預估市價:</strong> {property.estimatedMarketPrice}萬</div>
                                  <div><strong>貸款餘額:</strong> {property.loanBalance}萬</div>
                                  <div><strong>月付金:</strong> {property.monthlyPayment}元</div>
                                  <div><strong>可增貸金額:</strong> 
                                    <span className="text-green-600 font-medium"> {property.availableCredit.toFixed(1)}萬</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 預售資訊 */}
                        {submission.presales.length > 0 && submission.presales[0].projectName && (
                          <>
                            <h4 className="font-semibold text-gray-800 flex items-center">
                              <span className="mr-2">🏗️</span>
                              預售資訊
                            </h4>
                            <div className="space-y-3">
                              {submission.presales.map((presale, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                                  <div><strong>建案名稱:</strong> {presale.projectName}</div>
                                  <div><strong>合約價格:</strong> {presale.contractPrice}萬</div>
                                  <div><strong>預計交屋:</strong> {presale.expectedDelivery}</div>
                                  <div><strong>待付工程款:</strong> {presale.remainingPayment}萬</div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {/* 負債資訊 */}
                        <h4 className="font-semibold text-gray-800 flex items-center">
                          <span className="mr-2">💳</span>
                          負債資訊
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          {submission.personal_loan > 0 && (
                            <>
                              <div><strong>信貸餘額:</strong> {submission.personal_loan}萬</div>
                              <div><strong>信貸月付金:</strong> {submission.personal_loan_monthly}元</div>
                            </>
                          )}
                          {submission.car_loan > 0 && (
                            <>
                              <div><strong>車貸餘額:</strong> {submission.car_loan}萬</div>
                              <div><strong>車貸月付金:</strong> {submission.car_loan_monthly}元</div>
                            </>
                          )}
                          {submission.stock_pledge > 0 && (
                            <>
                              <div><strong>股債質押:</strong> {submission.stock_pledge}萬</div>
                              <div><strong>股債質押月付金:</strong> {submission.stock_pledge_monthly}元</div>
                            </>
                          )}
                          {submission.insurance_loan > 0 && (
                            <>
                              <div><strong>保單貸款:</strong> {submission.insurance_loan}萬</div>
                              <div><strong>保單貸款月付金:</strong> {submission.insurance_loan_monthly}元</div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

