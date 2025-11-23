import React, { useEffect } from 'react'
import { useSystem } from '../contexts/SystemContext'

const Dashboard = () => {
  const { 
    knowledgeHealth, 
    nlpHealth, 
    analytics, 
    loadAnalytics,
    checkSystemHealth 
  } = useSystem()

  useEffect(() => {
    loadAnalytics()
    checkSystemHealth()
  }, [])

  const stats = [
    {
      title: 'آیتم‌های دانش',
      value: analytics?.analytics?.totalItems || 0,
      color: 'var(--primary-color)',
      icon: '📚'
    },
    {
      title: 'تعداد بازدید',
      value: analytics?.analytics?.totalViews || 0,
      color: 'var(--success-color)',
      icon: '👁️'
    },
    {
      title: 'پست‌های NLP',
      value: nlpHealth?.postsCount || 0,
      color: 'var(--warning-color)',
      icon: '📝'
    },
    {
      title: 'دسته‌بندی‌ها',
      value: analytics?.analytics?.categories ? Object.keys(analytics.analytics.categories).length : 0,
      color: 'var(--secondary-color)',
      icon: '📊'
    }
  ]

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>داشبورد سامانه</h1>
        <div className="d-flex gap-2">
          <div className={`badge ${knowledgeHealth ? 'bg-success' : 'bg-error'}`}>
            پایگاه دانش: {knowledgeHealth ? 'فعال' : 'غیرفعال'}
          </div>
          <div className={`badge ${nlpHealth ? 'bg-success' : 'bg-error'}`}>
            پردازش زبان: {nlpHealth ? 'فعال' : 'غیرفعال'}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-5">
        {stats.map((stat, index) => (
          <div key={index} className="col-md-3 col-sm-6 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="mb-2" style={{ fontSize: '2rem' }}>
                  {stat.icon}
                </div>
                <h3 style={{ color: stat.color }}>{stat.value}</h3>
                <p className="text-muted mb-0">{stat.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">دسترسی سریع</h3>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-2">
                <a href="/knowledge" className="btn btn-outline d-flex justify-content-between align-items-center">
                  <span>مدیریت پایگاه دانش</span>
                  <span>🧠</span>
                </a>
                <a href="/nlp" className="btn btn-outline d-flex justify-content-between align-items-center">
                  <span>پردازش زبان طبیعی</span>
                  <span>📝</span>
                </a>
                <a href="/analytics" className="btn btn-outline d-flex justify-content-between align-items-center">
                  <span>تحلیل و آمار</span>
                  <span>📈</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">وضعیت سیستم</h3>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span>سرور پایگاه دانش</span>
                  <div className="d-flex align-items-center gap-2">
                    <div 
                      className="rounded-circle"
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: knowledgeHealth ? '#10b981' : '#ef4444'
                      }}
                    />
                    <span>{knowledgeHealth ? 'فعال' : 'غیرفعال'}</span>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span>سرور پردازش زبان</span>
                  <div className="d-flex align-items-center gap-2">
                    <div 
                      className="rounded-circle"
                      style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: nlpHealth ? '#10b981' : '#ef4444'
                      }}
                    />
                    <span>{nlpHealth ? 'فعال' : 'غیرفعال'}</span>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span>تعداد آیتم‌ها</span>
                  <span>{analytics?.analytics?.totalItems || 0}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span>تعداد بازدید</span>
                  <span>{analytics?.analytics?.totalViews || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
