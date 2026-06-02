import React, { useState } from 'react'
import './ExpenseHistory.css'

function ExpenseHistory({ expenses, onDelete, loading }) {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  const filtered = expenses.filter(exp => {
    if (filterType !== 'all' && exp.type !== filterType) return false
    if (filterCategory !== 'all' && exp.category !== filterCategory) return false
    if (search && !exp.description?.toLowerCase().includes(search.toLowerCase()) && !exp.category?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const categories = [...new Set(expenses.map(e => e.category))]

  if (loading) return <div className="loading">Loading history...</div>

  return (
    <div className="expense-history">
      <h1>Transaction History</h1>
      <div className="filters"><input type="text" placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} /><select value={filterType} onChange={(e) => setFilterType(e.target.value)}><option value="all">All Types</option><option value="debit">Expenses</option><option value="credit">Income</option></select><select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}><option value="all">All Categories</option>{categories.map(cat => (<option key={cat}>{cat}</option>))}</select></div>
      <div className="history-list">{filtered.map(exp => (<div key={exp.id} className="history-item"><div className="history-info"><div className="history-title"><strong>{exp.description || exp.category}</strong><span className={`history-type ${exp.type}`}>{exp.type === 'debit' ? 'Expense' : 'Income'}</span></div><div className="history-meta"><span className="history-cat">{exp.category}</span><span className="history-date">{exp.date}</span></div></div><div className="history-amount"><span className={`amount ${exp.type}`}>{exp.type === 'debit' ? '-' : '+'}₹{exp.amount}</span><button className="delete-btn" onClick={() => onDelete(exp.id)}>🗑️</button></div></div>))}{filtered.length === 0 && <p className="no-data">No transactions found</p>}</div>
    </div>
  )
}

export default ExpenseHistory