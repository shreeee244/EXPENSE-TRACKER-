import React from 'react'
import './Sidebar.css'

function Sidebar({ activeTab, setActiveTab }) {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      window.location.reload()
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="star-icon">✦</span>
        <span>AfterPay</span>
      </div>
      <nav className="sidebar-nav">
        <button className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          📊 Dashboard
        </button>
        <button className={`sidebar-item ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>
          ➕ Add Expense
        </button>
        <button className={`sidebar-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          📋 History
        </button>
      </nav>
      <button className="sidebar-logout" onClick={handleLogout}>🚪 Sign Out</button>
    </aside>
  )
}

export default Sidebar
