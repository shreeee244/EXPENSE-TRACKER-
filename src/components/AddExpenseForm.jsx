import React, { useState } from 'react'
import './AddExpenseForm.css'

// OCR.space API key (free tier - 500 requests/month)
const OCR_API_KEY = 'helloworld'

// Parse receipt text to extract amount and merchant
const parseReceiptText = (text) => {
  // Multiple amount patterns for different receipt formats
  const amountPatterns = [
    /(?:TOTAL|AMOUNT|DUE|PAY|BALANCE|GRAND TOTAL)[:\s]*([0-9,]+\.?[0-9]*)/i,
    /(?:RS\.?|₹|INR)[:\s]*([0-9,]+\.?[0-9]*)/i,
    /([0-9,]+\.?[0-9]*)\s*(?:TOTAL|AMOUNT)/i,
    /(?:Net|Gross|SUBTOTAL)[:\s]*([0-9,]+\.?[0-9]*)/i,
    /(?:BILL|INVOICE|RECEIPT)[:\s]*[\w-]+\s*([0-9,]+\.?[0-9]*)/i,
    /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)(?=\s*(?:TOTAL|AMOUNT|DUE|PAY))/i
  ]
  
  let amount = null
  for (const pattern of amountPatterns) {
    const match = text.match(pattern)
    if (match) {
      amount = parseFloat(match[1].replace(/,/g, ''))
      if (amount > 0 && amount < 1000000) break
    }
  }
  
  // Clean the text for better parsing
  const cleanText = text.replace(/[^\x20-\x7E]/g, ' ').replace(/\s+/g, ' ')
  
  // Extract merchant (usually first few lines before common keywords)
  const merchantMatch = cleanText.match(/^([A-Za-z0-9\s&]+?)(?:\n|RESTAURANT|CAFE|STORE|BILL|INVOICE)/i)
  const merchant = merchantMatch ? merchantMatch[1].trim().substring(0, 40) : null
  
  return { amount, merchant }
}

function AddExpenseForm({ onAdd }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    description: '',
    type: 'debit',
    date: new Date().toISOString().split('T')[0],
    source: 'manual'
  })
  const [submitting, setSubmitting] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [parsingSMS, setParsingSMS] = useState(false)
  const [smsText, setSmsText] = useState('')
  const [ocrResult, setOcrResult] = useState('')

  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other']

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.amount || formData.amount <= 0) {
      alert('Please enter a valid amount')
      return
    }
    setSubmitting(true)
    await onAdd({
      ...formData,
      amount: parseFloat(formData.amount)
    })
    setFormData({
      amount: '',
      category: 'Food',
      description: '',
      type: 'debit',
      date: new Date().toISOString().split('T')[0],
      source: 'manual'
    })
    setSubmitting(false)
  }

  // OCR Receipt Scanning with OCR.space API
  const handleReceiptUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file size (OCR.space free tier limit is 1MB)
    if (file.size > 1 * 1024 * 1024) {
      setOcrResult('❌ File too large. Please use image under 1MB.')
      setScanning(false)
      e.target.value = ''
      return
    }

    setScanning(true)
    setOcrResult('📡 Scanning receipt with OCR.space...')

    const formData = new FormData()
    formData.append('apikey', OCR_API_KEY)
    formData.append('file', file)
    formData.append('language', 'eng')
    formData.append('isOverlayRequired', 'false')
    formData.append('detectOrientation', 'true')
    formData.append('scale', 'true')

    try {
      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      
      if (data.OCRExitCode === 1) {
        const parsedText = data.ParsedResults[0].ParsedText
        const { amount, merchant } = parseReceiptText(parsedText)
        
        if (amount && amount > 0) {
          setFormData((prevData) => ({
            ...prevData,
            amount: amount.toString(),
            description: merchant || 'Receipt',
            source: 'ocr'
          }))
          setOcrResult(`✅ Found: ₹${amount} from ${merchant || 'Receipt'}`)
          alert(`🎉 Amount ₹${amount} detected!\nMerchant: ${merchant || 'Receipt'}\n\nClick "Add Transaction" to save.`)
        } else {
          setOcrResult('❌ Could not detect amount. Try manual entry or a clearer photo.')
        }
      } else {
        setOcrResult('❌ OCR failed: ' + (data.ErrorMessage || 'Unknown error'))
      }
    } catch (err) {
      console.error('OCR Error:', err)
      setOcrResult('❌ Network error. Check your connection and try again.')
    }
    setScanning(false)
    e.target.value = ''
  }

  // SMS Parsing
  const handleParseSMS = () => {
    if (!smsText.trim()) {
      alert('Please paste an SMS first')
      return
    }

    setParsingSMS(true)

    // Parse amount
    const amountMatch = smsText.match(/(?:Rs\.?|INR|₹)\s*([0-9,]+\.?[0-9]*)/i)
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null

    // Parse merchant/vendor
    const merchantMatch = smsText.match(/(?:at|to|for|spent at|paid to)\s+([A-Za-z0-9\s]+?)(?:\.| on| |$)/i)
    const merchant = merchantMatch ? merchantMatch[1].trim() : 'SMS Transaction'

    // Parse date
    const dateMatch = smsText.match(/(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/)
    const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0]

    if (amount && amount > 0) {
      setFormData({
        ...formData,
        amount: amount.toString(),
        description: merchant,
        date: date,
        source: 'sms'
      })
      setSmsText('')
      alert(`✅ Parsed: ₹${amount} from ${merchant}\nClick Add Transaction to save.`)
    } else {
      alert('❌ Could not parse amount from SMS.\nTry format like: "HDFC Bank: Rs 450 spent at Dominos"')
    }
    setParsingSMS(false)
  }

  return (
    <div className="add-expense-form">
      <h1>Add Expense</h1>

      {/* OCR Section */}
      <div className="ocr-section card">
        <h3>📸 Scan Receipt / Bill</h3>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleReceiptUpload}
          disabled={scanning}
        />
        {scanning && <p className="scanning-text">🔄 Scanning... please wait</p>}
        {ocrResult && <p className="ocr-result">{ocrResult}</p>}
      </div>

      {/* SMS Parsing Section */}
      <div className="sms-section card">
        <h3>💬 Parse Bank SMS</h3>
        <textarea
          rows="3"
          placeholder="Paste SMS here...&#10;Example: HDFC Bank: Rs 450 spent at Dominos on 25 Dec"
          value={smsText}
          onChange={(e) => setSmsText(e.target.value)}
        />
        <button 
          className="btn-outline" 
          onClick={handleParseSMS}
          disabled={parsingSMS}
        >
          {parsingSMS ? 'Parsing...' : 'Parse SMS'}
        </button>
      </div>

      {/* Manual Entry Section */}
      <div className="manual-section card">
        <h3>✍️ Manual Entry</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type</label>
            <div className="type-buttons">
              <button type="button" className={`type-btn ${formData.type === 'debit' ? 'active-debit' : ''}`} onClick={() => setFormData({ ...formData, type: 'debit' })}>💸 Expense</button>
              <button type="button" className={`type-btn ${formData.type === 'credit' ? 'active-credit' : ''}`} onClick={() => setFormData({ ...formData, type: 'credit' })}>💰 Income</button>
            </div>
          </div>
          <div className="form-group">
            <label>Amount (₹)</label>
            <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} placeholder="Enter amount" required />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
              {categories.map(cat => (<option key={cat}>{cat}</option>))}
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="What was this for?" />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddExpenseForm