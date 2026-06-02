import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import DashboardView from '../components/DashboardView'
import AddExpenseForm from '../components/AddExpenseForm'
import ExpenseHistory from '../components/ExpenseHistory'
import './Dashboard.css'

function Dashboard({ supabase, session }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExpenses()
  }, [])

  const loadExpenses = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false })

    if (!error && data) {
      setExpenses(data)
    }
    setLoading(false)
  }

  const addExpense = async (expense) => {
    const { error } = await supabase
      .from('expenses')
      .insert([{ ...expense, user_id: session.user.id }])

    if (!error) {
      loadExpenses()
    } else {
      alert('Error adding expense: ' + error.message)
    }
  }

  const deleteExpense = async (id) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)

    if (!error) {
      loadExpenses()
    } else {
      alert('Error deleting: ' + error.message)
    }
  }

  return (
    <div className="dashboard-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="dashboard-main">
        {activeTab === 'dashboard' && <DashboardView expenses={expenses} loading={loading} />}
        {activeTab === 'add' && <AddExpenseForm onAdd={addExpense} />}
        {activeTab === 'history' && <ExpenseHistory expenses={expenses} onDelete={deleteExpense} loading={loading} />}
      </main>
    </div>
  )
}

export default Dashboard