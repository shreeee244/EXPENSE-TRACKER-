import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import './App.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="star-icon">✦</div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!session) {
    return <Landing supabase={supabase} setSession={setSession} />
  }

  return <Dashboard supabase={supabase} session={session} />
}

export default App