import { saveFinancialData } from '../../lib/database'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允許POST請求' })
  }

  try {
    const formData = req.body

    // 驗證必填欄位
    if (!formData.personalInfo?.name || !formData.personalInfo?.annualIncome || !formData.personalInfo?.birthDate) {
      return res.status(400).json({ error: '請填寫必填欄位' })
    }

    // 儲存到資料庫
    const result = await saveFinancialData(formData)

    if (result.success) {
      res.status(200).json({ 
        success: true, 
        message: '資料提交成功',
        id: result.id 
      })
    } else {
      res.status(500).json({ 
        success: false, 
        error: '資料儲存失敗' 
      })
    }
  } catch (error) {
    console.error('Submit form error:', error)
    res.status(500).json({ 
      success: false, 
      error: '伺服器錯誤' 
    })
  }
}

