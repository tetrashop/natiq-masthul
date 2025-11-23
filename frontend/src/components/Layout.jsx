import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSystem } from '../contexts/SystemContext'

const Layout = ({ children }) => {
  const location = useLocation()
  const { knowledgeHealth, nlpHealth, loading } = useSystem()

  const navigation = [
    { path: '/dashboard', label: 'داشبورد', icon: '📊' },
    { path: '/knowledge', label: 'پایگاه دانش', icon: '🧠' },
    { path: '/nlp', label: 'پردازش زبان', icon: '📝' },
    { path: '/analytics', label: 'تحلیل‌ها', icon: '📈' }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="d-flex flex-column min-h-100">
      {/* Header */}
      <header className="bg-surface-color shadow-sm border-bottom">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center py-3">
            <div className="d-flex align-items-center gap-4">
              <h1 className="text-xl mb-0">🧠 سامانه مدیریت دانش</h1>
              <nav className="d-flex gap-2">
                {navigation.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`btn btn-outline ${isActive(item.path) ? 'active' : ''}`}
                    style={{
                      backgroundColor: isActive(item.path) ? 'var(--primary-color)' : 'transparent',
                      color: isActive(item.path) ? 'white' : 'var(--text-primary)'
                    }}
                  >
                    <span className="ml-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            
            <div className="d-flex gap-3 align-items-center">
              {/* System Status */}
              <div className="d-flex gap-2">
                <div className="d-flex align-items-center gap-1">
                  <div 
                    className="rounded-circle"
                    style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: knowledgeHealth ? '#10b981' : '#ef4444'
                    }}
                  />
                  <span className="text-sm">پایگاه دانش</span>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <div 
                    className="rounded-circle"
                    style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: nlpHealth ? '#10b981' : '#ef4444'
                    }}
                  />
                  <span className="text-sm">NLP</span>
                </div>
              </div>
              
              {loading && (
                <div className="spinner text-primary"></div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1 py-4">
        <div className="container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-color border-top py-3 mt-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center text-muted text-sm">
            <div>سامانه مدیریت دانش و پردازش زبان طبیعی</div>
            <div>نسخه ۱.۰.۰</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
