import { requireAuth } from '../../../lib/auth'
import { getAllSubmissions } from '../../../lib/database'

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '只允許GET請求' })
  }

  try {
    const submissions = await getAllSubmissions()
    
    // 處理資料格式
    const processedSubmissions = submissions.map(submission => {
      // 解析JSON資料
      let properties = []
      let presales = []
      
      try {
        if (submission.properties_data) {
          properties = JSON.parse(submission.properties_data)
        }
      } catch (e) {
        console.error('Parse properties error:', e)
      }
      
      try {
        if (submission.presales_data) {
          presales = JSON.parse(submission.presales_data)
        }
      } catch (e) {
        console.error('Parse presales error:', e)
      }

      // 處理房產資料，計算可增貸金額
      const processedProperties = properties.map(prop => {
        const estimatedPrice = parseFloat(prop.estimatedMarketPrice) || 0
        const loanBalance = parseFloat(prop.loanBalance) || 0
        const availableCredit = Math.max(0, (estimatedPrice * 0.8) - loanBalance)
        
        return {
          ...prop,
          estimatedMarketPrice: estimatedPrice,
          loanBalance: loanBalance,
          availableCredit: availableCredit
        }
      })

      return {
        ...submission,
        properties: processedProperties,
        presales: presales,
        submission_date: new Date(submission.submission_date).toLocaleString('zh-TW')
      }
    })

    res.status(200).json({ 
      success: true, 
      data: processedSubmissions 
    })
  } catch (error) {
    console.error('Get submissions error:', error)
    res.status(500).json({ 
      success: false, 
      error: '獲取資料失敗' 
    })
  }
}

export default requireAuth(handler)

