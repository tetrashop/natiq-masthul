import React, { useEffect } from 'react'
import { useSystem } from '../contexts/SystemContext'

const Analytics = () => {
  const { analytics, loadAnalytics, loading } = useSystem()

  useEffect(() => {
    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner"></div>
        <p className="text-muted mt-2">در حال بارگذاری تحلیل‌ها...</p>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-5 text-muted">
        اطلاعات تحلیلی در دسترس نیست
      </div>
    )
  }

  const { totalItems, totalViews, averageViews, categories, popularTags } = analytics.analytics

  return (
    <div>
      <h1 className="mb-4">تحلیل و آمار</h1>

      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 style={{ color: 'var(--primary-color)' }}>{totalItems}</h3>
              <p className="text-muted mb-0">کل آیتم‌ها</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 style={{ color: 'var(--success-color)' }}>{totalViews}</h3>
              <p className="text-muted mb-0">تعداد بازدید</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 style={{ color: 'var(--warning-color)' }}>{averageViews}</h3>
              <p className="text-muted mb-0">میانگین بازدید</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h3 style={{ color: 'var(--secondary-color)' }}>{Object.keys(categories || {}).length}</h3>
              <p className="text-muted mb-0">دسته‌بندی‌ها</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">دسته‌بندی‌ها</h3>
            </div>
            <div className="card-body">
              {categories && Object.entries(categories).length > 0 ? (
                <div className="d-flex flex-column gap-2">
                  {Object.entries(categories).map(([category, count]) => (
                    <div key={category} className="d-flex justify-content-between align-items-center">
                      <span>{category}</span>
                      <span className="badge bg-primary">{count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-3">
                  هیچ دسته‌بندی‌ای وجود ندارد
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">تگ‌های پرکاربرد</h3>
            </div>
            <div className="card-body">
              {popularTags && Object.entries(popularTags).length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {Object.entries(popularTags)
                    .sort(([,a], [,b]) => b - a)
                    .map(([tag, count]) => (
                      <span key={tag} className="badge bg-secondary">
                        {tag} ({count})
                      </span>
                    ))
                  }
                </div>
              ) : (
                <div className="text-center text-muted py-3">
                  هیچ تگی وجود ندارد
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="mb-0">اطلاعات سیستم</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h4>آمار کلی</h4>
              <ul className="list-unstyled">
                <li className="mb-2">کل آیتم‌ها: <strong>{totalItems}</strong></li>
                <li className="mb-2">کل بازدیدها: <strong>{totalViews}</strong></li>
                <li className="mb-2">میانگین بازدید: <strong>{averageViews}</strong></li>
                <li className="mb-2">تعداد دسته‌بندی‌ها: <strong>{Object.keys(categories || {}).length}</strong></li>
              </ul>
            </div>
            <div className="col-md-6">
              <h4>آخرین بروزرسانی</h4>
              <p className="text-muted">{analytics.analytics.lastUpdated}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
