import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import KnowledgeBase from './pages/KnowledgeBase'
import NLP from './pages/NLP'
import Analytics from './pages/Analytics'
import { SystemProvider } from './contexts/SystemContext'
import './styles/global.css'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Hide loading screen when app is ready
    const rootLoading = document.getElementById('root-loading')
    if (rootLoading) {
      setTimeout(() => {
        rootLoading.style.display = 'none'
        setLoading(false)
      }, 1000)
    }
  }, [])

  if (loading) {
    return null
  }

  return (
    <SystemProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/knowledge" element={<KnowledgeBase />} />
            <Route path="/nlp" element={<NLP />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Layout>
      </Router>
    </SystemProvider>
  )
}

export default App
