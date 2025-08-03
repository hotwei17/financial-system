import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Home, Building, DollarSign, CreditCard, CheckCircle } from 'lucide-react'
import Head from 'next/head'

export default function Home() {
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      annualIncome: '',
      birthDate: '',
      spouseName: '',
      spouseAnnualIncome: '',
      spouseBirthDate: ''
    },
    properties: [{
      address: '',
      estimatedMarketPrice: '',
      loanBalance: '',
      monthlyPayment: ''
    }],
    presales: [{
      projectName: '',
      contractPrice: '',
      expectedDelivery: '',
      remainingPayment: ''
    }],
    assets: {
      cash: '',
      stocks: '',
      dividendInvestments: '',
      dividendMonthlyIncome: '',
      insuranceValue: ''
    },
    debts: {
      personalLoan: '',
      personalLoanMonthly: '',
      carLoan: '',
      carLoanMonthly: '',
      stockPledge: '',
      stockPledgeMonthly: '',
      insuranceLoan: '',
      insuranceLoanMonthly: ''
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleInputChange = (section, field, value, index = null) => {
    setFormData(prev => {
      const newData = { ...prev }
      
      if (index !== null) {
        newData[section][index][field] = value
      } else if (typeof newData[section] === 'object' && !Array.isArray(newData[section])) {
        newData[section][field] = value
      }
      
      return newData
    })
  }

  const addProperty = () => {
    setFormData(prev => ({
      ...prev,
      properties: [...prev.properties, {
        address: '',
        estimatedMarketPrice: '',
        loanBalance: '',
        monthlyPayment: ''
      }]
    }))
  }

  const removeProperty = (index) => {
    if (formData.properties.length > 1) {
      setFormData(prev => ({
        ...prev,
        properties: prev.properties.filter((_, i) => i !== index)
      }))
    }
  }

  const addPresale = () => {
    setFormData(prev => ({
      ...prev,
      presales: [...prev.presales, {
        projectName: '',
        contractPrice: '',
        expectedDelivery: '',
        remainingPayment: ''
      }]
    }))
  }

  const removePresale = (index) => {
    if (formData.presales.length > 1) {
      setFormData(prev => ({
        ...prev,
        presales: prev.presales.filter((_, i) => i !== index)
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowSuccess(true)
      } else {
        alert('提交失敗，請稍後再試')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('提交失敗，請稍後再試')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Head>
          <title>提交成功 - 財務資訊表格</title>
        </Head>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">提交成功！</h1>
          <p className="text-gray-600 mb-6">
            感謝您填寫財務資訊表格。我們已收到您的資料，將盡快為您提供專業的財務建議。
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">聯絡方式</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>📧 Email: hotwei17@life.fubon.com</p>
              <p>📱 電話: 0917229463</p>
              <p>💬 LINE: @hotwie17</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            如有任何問題，歡迎隨時與我們聯繫。
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <Head>
        <title>財務資訊填寫表格</title>
        <meta name="description" content="請填寫您的財務資訊，我們將為您提供專業的理財建議" />
      </Head>
      
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">財務資訊填寫表格</h1>
          <p className="text-gray-600">請詳細填寫以下資訊，提供的資訊越完整，越能快速地找出解答或提供初步的建議。</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 個人資訊 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">個人資訊</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="請輸入姓名"
                  value={formData.personalInfo.name}
                  onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">年收入(扣繳憑單)（萬） *</label>
                <input
                  type="number"
                  required
                  className="input-field"
                  placeholder="請輸入年收入"
                  value={formData.personalInfo.annualIncome}
                  onChange={(e) => handleInputChange('personalInfo', 'annualIncome', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">出生年/月/日 *</label>
                <input
                  type="date"
                  required
                  className="input-field"
                  value={formData.personalInfo.birthDate}
                  onChange={(e) => handleInputChange('personalInfo', 'birthDate', e.target.value)}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-700 mb-4">配偶資訊 (選填)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">配偶姓名</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="請輸入配偶姓名"
                    value={formData.personalInfo.spouseName}
                    onChange={(e) => handleInputChange('personalInfo', 'spouseName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">配偶年收入（萬）</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="請輸入配偶年收入"
                    value={formData.personalInfo.spouseAnnualIncome}
                    onChange={(e) => handleInputChange('personalInfo', 'spouseAnnualIncome', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">配偶出生年/月/日</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.personalInfo.spouseBirthDate}
                    onChange={(e) => handleInputChange('personalInfo', 'spouseBirthDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* 成屋資訊 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Home className="w-5 h-5 text-primary-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">目前手上成屋</h2>
              </div>
              <button
                type="button"
                onClick={addProperty}
                className="btn-secondary text-sm"
              >
                新增成屋
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">如果不只一間請點擊新增成屋</p>

            {formData.properties.map((property, index) => (
              <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-700">成屋 #{index + 1}</h3>
                  {formData.properties.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProperty(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      刪除
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="請輸入房屋地址"
                      value={property.address}
                      onChange={(e) => handleInputChange('properties', 'address', e.target.value, index)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">預估市價（萬）</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="請輸入預估市價"
                      value={property.estimatedMarketPrice}
                      onChange={(e) => handleInputChange('properties', 'estimatedMarketPrice', e.target.value, index)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">貸款餘額（萬）</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="請輸入貸款餘額"
                      value={property.loanBalance}
                      onChange={(e) => handleInputChange('properties', 'loanBalance', e.target.value, index)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">每月月付金（元）</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="請輸入每月月付金"
                      value={property.monthlyPayment}
                      onChange={(e) => handleInputChange('properties', 'monthlyPayment', e.target.value, index)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* 預售屋資訊 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Building className="w-5 h-5 text-primary-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">預售</h2>
              </div>
              <button
                type="button"
                onClick={addPresale}
                className="btn-secondary text-sm"
              >
                新增預售
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">如果不只一間請點擊新增預售</p>

            {formData.presales.map((presale, index) => (
              <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium text-gray-700">預售 #{index + 1}</h3>
                  {formData.presales.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePresale(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      刪除
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">建案名稱</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="請輸入建案名稱"
                      value={presale.projectName}
                      onChange={(e) => handleInputChange('presales', 'projectName', e.target.value, index)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">合約價格（萬）</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="請輸入合約價格"
                      value={presale.contractPrice}
                      onChange={(e) => handleInputChange('presales', 'contractPrice', e.target.value, index)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">預計交屋時間</label>
                    <input
                      type="month"
                      className="input-field"
                      value={presale.expectedDelivery}
                      onChange={(e) => handleInputChange('presales', 'expectedDelivery', e.target.value, index)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">待付工程款（萬）</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="請輸入待付工程款"
                      value={presale.remainingPayment}
                      onChange={(e) => handleInputChange('presales', 'remainingPayment', e.target.value, index)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* 動產 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center mb-4">
              <DollarSign className="w-5 h-5 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">動產</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">現金（萬）</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="請輸入現金金額"
                  value={formData.assets.cash}
                  onChange={(e) => handleInputChange('assets', 'cash', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">股票（萬）</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="請輸入股票價值"
                  value={formData.assets.stocks}
                  onChange={(e) => handleInputChange('assets', 'stocks', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">有配息投資（萬）</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="請輸入有配息投資金額"
                  value={formData.assets.dividendInvestments}
                  onChange={(e) => handleInputChange('assets', 'dividendInvestments', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">有配息投資月收入（元）</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="請輸入月配息收入"
                  value={formData.assets.dividendMonthlyIncome}
                  onChange={(e) => handleInputChange('assets', 'dividendMonthlyIncome', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">保單價值金（萬）</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="請輸入保單價值金"
                  value={formData.assets.insuranceValue}
                  onChange={(e) => handleInputChange('assets', 'insuranceValue', e.target.value)}
                />
              </div>
            </div>
          </motion.div>

          {/* 其他負債 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <div className="flex items-center mb-4">
              <CreditCard className="w-5 h-5 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">其他負債</h2>
            </div>
            
            <div className="space-y-6">
              {/* 信貸 */}
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-700 mb-3">信貸</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">信貸餘額（萬）</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="請輸入信貸餘額"
                      value={formData.debts.personalLoan}
                      onChange={(e) => handleInputChange('debts', 'personalLoan', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">信貸月付金（元）</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="請輸入信貸月付金"
                      value={formData.debts.personalLoanMonthly}
                      onChange={(e) => handleInputChange('debts', 'personalLoanMonthly', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* 車貸 */}
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-700 mb-3">車貸</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">車貸餘額（萬）</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="請輸入車貸餘額"
                      value={formData.debts.carLoan}
                      onChange={(e) => handleInputChange('debts', 'carLoan', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">車貸月付金（元）</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="請輸入車貸月付金"
                      value={formData.debts.carLoanMonthly}
                      onChange={(e) => handleInputChange('debts', 'carLoanMonthly', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* 股債質押 */}
              <div className="border-b pb-4">
                <h3 className="font-medium text-gray-700 mb-3">股債質押</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">股債質押（萬）</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="請輸入股債質押金額"
                      value={formData.debts.stockPledge}
                      onChange={(e) => handleInputChange('debts', 'stockPledge', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">股債質押月付金（元）</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="請輸入股債質押月付金"
                      value={formData.debts.stockPledgeMonthly}
                      onChange={(e) => handleInputChange('debts', 'stockPledgeMonthly', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* 保單貸款 */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">保單貸款</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">保單貸款（萬）</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="請輸入保單貸款金額"
                      value={formData.debts.insuranceLoan}
                      onChange={(e) => handleInputChange('debts', 'insuranceLoan', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">保單貸款月付金（元）</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="請輸入保單貸款月付金"
                      value={formData.debts.insuranceLoanMonthly}
                      onChange={(e) => handleInputChange('debts', 'insuranceLoanMonthly', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 提交按鈕 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '提交中...' : '提交表格'}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}

