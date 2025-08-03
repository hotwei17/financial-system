import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function AdminPage() {
  const [submissions, setSubmissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/submissions')
      const data = await response.json()

      if (response.ok) {
        setSubmissions(data.submissions || [])
      } else {
        setError(data.message || '載入失敗')
      }
    } catch (error) {
      setError('網路錯誤')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/login'
    } catch (error) {
      console.error('登出錯誤:', error)
    }
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '20px' }}>載入中...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Head>
        <title>管理後台 - 財務資訊收集系統</title>
      </Head>
      
      <div style={{ background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', margin: 0 }}>
              財務資訊管理後台
            </h1>
            <button
              onClick={handleLogout}
              style={{ background: '#f44336', color: 'white', padding: '10px 20px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
            >
              登出
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {error && (
          <div style={{ background: '#ffebee', border: '1px solid #f44336', color: '#c62828', padding: '12px', borderRadius: '4px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', margin: '0 0 5px 0' }}>
              提交記錄 ({submissions.length})
            </h3>
            <p style={{ color: '#666', margin: 0 }}>
              所有客戶提交的財務資訊
            </p>
          </div>
          
          {submissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              暫無提交記錄
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f9f9f9' }}>
                  <tr>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', borderBottom: '1px solid #eee' }}>
                      姓名
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', borderBottom: '1px solid #eee' }}>
                      年收入
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', borderBottom: '1px solid #eee' }}>
                      出生日期
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', borderBottom: '1px solid #eee' }}>
                      房產地址
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', borderBottom: '1px solid #eee' }}>
                      提交時間
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500', color: '#333' }}>
                        {submission.name}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#666' }}>
                        {submission.annual_income ? `${Number(submission.annual_income).toLocaleString()}` : '-'}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#666' }}>
                        {submission.birth_date || '-'}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#666' }}>
                        {submission.property_address || '-'}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#666' }}>
                        {submission.created_at ? new Date(submission.created_at).toLocaleString('zh-TW') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


