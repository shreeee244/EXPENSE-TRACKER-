import React, { useState } from 'react'
import './Landing.css'

function Landing({ supabase }) {
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async () => {
    setError('')
    setLoading(true)

    if (authMode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else alert('Check your email for confirmation!')
    }
    setLoading(false)
  }

  return (
    <div className="landing-container">
      <nav className="landing-nav">
        <div className="logo">
          <span className="star-icon">✦</span>
          <span>AfterPay</span>
        </div>
        <button className="btn-outline" onClick={() => setShowAuth(true)}>Sign In</button>
      </nav>

      <main className="hero-section">
        <div className="hero-badge">✨ AI-Powered Expense Intelligence</div>
        <h1 className="hero-title">
          Track every <span className="gradient-text">rupee</span>,<br />effortlessly.
        </h1>
        <p className="hero-subtitle">
          Snap a receipt, paste an SMS, or type it in — AfterPay categorizes, analyzes,<br />
          and gives you real financial clarity.
        </p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => setShowAuth(true)}>Start for free →</button>
          <button className="btn-outline" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>See how it works</button>
        </div>

        <div className="feature-pills">
          <div className="pill">📷 OCR Receipt Scanning</div>
          <div className="pill">🧠 AI Auto Categorization</div>
          <div className="pill">💬 SMS Transaction Parsing</div>
          <div className="pill">📊 Insights</div>
        </div>

        
      </main>

      <section id="features" className="features-section">
        <h2 className="section-title">Everything you need to manage <span className="gradient-text">money</span></h2>
        <div className="features-grid">
          <div className="feature-card"><span className="feature-icon">📷</span><h3>Receipt OCR</h3><p>Take a photo of any bill. AI extracts amount, merchant, and date automatically.</p></div>
          <div className="feature-card"><span className="feature-icon">💬</span><h3>SMS Parsing</h3><p>Paste your bank SMS and we'll pull out the transaction details instantly.</p></div>
          <div className="feature-card"><span className="feature-icon">🧠</span><h3>AI Categorization</h3><p>AI reads your expense description and assigns the right category automatically.</p></div>
          <div className="feature-card"><span className="feature-icon">📊</span><h3>Visual Analytics</h3><p>Pie charts, bar graphs, trends — see exactly where your money goes every month.</p></div>
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">How it <span className="gradient-text">works</span></h2>
        <div className="steps">
          <div className="step"><div className="step-number">1</div><h3>Add expense</h3><p>Type, scan receipt, or paste SMS</p></div>
          <div className="step"><div className="step-number">2</div><h3>AI processes</h3><p>Extracts amount & category</p></div>
          <div className="step"><div className="step-number">3</div><h3>Get insights</h3><p>See charts & spending trends</p></div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo">✦ AfterPay</div>
        <p>© 2026 AfterPay — AI-powered expense tracking</p>
      </footer>

      {showAuth && (
        <div className="auth-modal">
          <div className="auth-card">
            <button className="auth-close" onClick={() => setShowAuth(false)}>✕</button>
            <h2>{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className="auth-error">{error}</p>}
            <button className="btn-primary" onClick={handleAuth} disabled={loading}>
              {loading ? 'Loading...' : (authMode === 'login' ? 'Sign In' : 'Sign Up')}
            </button>
            <p className="auth-toggle">
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <a href="#" onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setError(''); }}> {authMode === 'login' ? 'Sign up' : 'Sign in'}</a>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Landing