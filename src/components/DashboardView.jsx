import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import './DashboardView.css'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

function DashboardView({ expenses, loading }) {
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.type === 'debit' ? e.amount : -e.amount), 0)
  const totalSpent = expenses.filter(e => e.type === 'debit').reduce((sum, e) => sum + e.amount, 0)
  const totalIncome = expenses.filter(e => e.type === 'credit').reduce((sum, e) => sum + e.amount, 0)
  const transactionCount = expenses.length

  const categoryData = {}
  expenses.filter(e => e.type === 'debit').forEach(e => {
    categoryData[e.category] = (categoryData[e.category] || 0) + e.amount
  })

  const doughnutData = {
    labels: Object.keys(categoryData),
    datasets: [{ data: Object.values(categoryData), backgroundColor: ['#a3e635', '#eab308', '#3b82f6', '#ec489a', '#8b5cf6', '#06b6d4', '#f97316'] }]
  }

  const monthlyData = {}
  expenses.forEach(e => {
    const month = e.date?.slice(0, 7)
    if (month) monthlyData[month] = (monthlyData[month] || 0) + (e.type === 'debit' ? e.amount : -e.amount)
  })

  const barData = {
    labels: Object.keys(monthlyData).slice(-6),
    datasets: [{ label: 'Net Flow', data: Object.values(monthlyData).slice(-6), backgroundColor: '#a3e635', borderRadius: 8 }]
  }

  const recentExpenses = expenses.slice(0, 5)

  if (loading) return <div className="loading">Loading dashboard...</div>

  return (
    <div className="dashboard-view">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card"><span className="stat-title">Balance</span><span className={`stat-value ${totalExpenses >= 0 ? 'positive' : 'negative'}`}>₹{totalExpenses.toLocaleString()}</span></div>
        <div className="stat-card"><span className="stat-title">Income</span><span className="stat-value positive">+₹{totalIncome.toLocaleString()}</span></div>
        <div className="stat-card"><span className="stat-title">Spent</span><span className="stat-value negative">-₹{totalSpent.toLocaleString()}</span></div>
        <div className="stat-card"><span className="stat-title">Transactions</span><span className="stat-value">{transactionCount}</span></div>
      </div>

      <div className="charts-row">
        <div className="chart-card"><h3>Spending by Category</h3>{Object.keys(categoryData).length > 0 ? <Doughnut data={doughnutData} /> : <p className="no-data">No data yet</p>}</div>
        <div className="chart-card"><h3>Monthly Trend</h3>{Object.keys(monthlyData).length > 0 ? <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} /> : <p className="no-data">No data yet</p>}</div>
      </div>

      <div className="recent-section"><h3>Recent Transactions</h3>{recentExpenses.map(exp => (<div key={exp.id} className="recent-item"><div><strong>{exp.description || exp.category}</strong><br /><small>{exp.date}</small></div><div className={`recent-amount ${exp.type === 'debit' ? 'negative' : 'positive'}`}>{exp.type === 'debit' ? '-' : '+'}₹{exp.amount}</div></div>))}{recentExpenses.length === 0 && <p className="no-data">No transactions yet. Add one!</p>}</div>
    </div>
  )
}

export default DashboardView