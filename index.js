import { useState } from 'react'
import Head from 'next/head'

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: '',
    annualIncome: '',
    birthDate: '',
    propertyAddress: '',
    propertyValue: '',
    loanBalance: '',
    monthlyPayment: '',
    purchasePrice: '',
    downPayment: '',
    loanAmount: '',
    purpose: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        alert('提交失敗，請稍後再試')
      }
    } catch (error) {
      console.error('提交錯誤:', error)
      alert('提交失敗，請稍後再試')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <Head>
          <title>提交成功 - 財務資訊收集系統</title>
        </Head>
        <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '40px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <div style={{ color: '#4caf50', fontSize: '60px', marginBottom: '20px' }}>✓</div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>提交成功！</h1>
          <p style={{ color: '#666', marginBottom: '30px' }}>
            感謝您提供的資訊，我們會盡快與您聯繫。
          </p>
          <button
            onClick={() => {
              setSubmitted(false)
              setFormData({
                name: '',
                annualIncome: '',
                birthDate: '',
                propertyAddress: '',
                propertyValue: '',
                loanBalance: '',
                monthlyPayment: '',
                purchasePrice: '',
                downPayment: '',
                loanAmount: '',
                purpose: ''
              })
            }}
            style={{ background: '#2196f3', color: 'white', padding: '12px 24px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '16px' }}
          >
            填寫新表單
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)', padding: '20px' }}>
      <Head>
        <title>財務資訊收集系統</title>
        <meta name="description" content="財務資訊收集表單" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)', padding: '30px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', margin: '0 0 10px 0' }}>
              財務資訊收集系統
            </h1>
            <p style={{ color: '#e3f2fd', margin: 0 }}>
              請填寫以下資訊，我們將為您提供最適合的財務建議
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
            {/* 個人資訊 */}
            <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>個人資訊</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '5px' }}>
                    姓名 *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '5px' }}>
                    年收入(扣繳憑單) *
                  </label>
                  <input
                    type="number"
                    name="annualIncome"
                    value={formData.annualIncome}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '5px' }}>
                    出生年月日 *
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            {/* 目前手上成屋 */}
            <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>目前手上成屋</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '5px' }}>
                    地址
                  </label>
                  <input
                    type="text"
                    name="propertyAddress"
                    value={formData.propertyAddress}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '5px' }}>
                    銀行估價
                  </label>
                  <input
                    type="number"
                    name="propertyValue"
                    value={formData.propertyValue}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '5px' }}>
                    貸款餘額
                  </label>
                  <input
                    type="number"
                    name="loanBalance"
                    value={formData.loanBalance}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '5px' }}>
                    每月月付金
                  </label>
                  <input
                    type="number"
                    name="monthlyPayment"
                    value={formData.monthlyPayment}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            {/* 預計購買房屋 */}
            <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>預計購買房屋</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '5px' }}>
                    購買價格
                  </label>
                  <input
                    type="number"
                    name="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '5px' }}>
                    自備款
                  </label>
                  <input
                    type="number"
                    name="downPayment"
                    value={formData.downPayment}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '5px' }}>
                    貸款金額
                  </label>
                  <input
                    type="number"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#555', marginBottom: '5px' }}>
                    用途
                  </label>
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box' }}
                  >
                    <option value="">請選擇</option>
                    <option value="自住">自住</option>
                    <option value="投資">投資</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ 
                  background: isSubmitting ? '#ccc' : '#2196f3', 
                  color: 'white', 
                  padding: '15px 40px', 
                  borderRadius: '6px', 
                  border: 'none', 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s'
                }}
              >
                {isSubmitting ? '提交中...' : '提交表單'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

