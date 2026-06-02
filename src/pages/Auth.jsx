import React, { useState } from 'react'
import './Landing.css'

function Auth({ supabase, setSession }) {
  const [authMode, setAuthMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async () => {
    setError('')
    setLoading(true)

    if (authMode === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else if (setSession) setSession(data.session)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else alert('Check your email for confirmation!')
    }
    setLoading(false)
  }

  return (
    <div className="auth-modal" style={{ display: 'flex' }}>
      <div className="auth-card">
        <h2>{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        {error && <p className="auth-error">{error}</p>}
        <button className="btn-primary" onClick={handleAuth} disabled={loading}>
          {loading ? 'Loading...' : (authMode === 'login' ? 'Sign In' : 'Sign Up')}
        </button>
        <p className="auth-toggle">
          {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <a href="#" onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setError(''); }}>
            {authMode === 'login' ? 'Sign up' : 'Sign in'}
          </a>
        </p>
      </div>
    </div>
  )
}

export default Auth