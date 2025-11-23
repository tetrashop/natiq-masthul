import React, { useEffect } from 'react'
import { useSystem } from '../contexts/SystemContext'

const NLP = () => {
  const { nlpPosts, loadNLPPosts, generateNLPSamples, loading } = useSystem()

  useEffect(() => {
    loadNLPPosts()
  }, [])

  const handleGenerateSamples = async () => {
    if (window.confirm('آیا از تولید ۱۶۲ پست نمونه اطمینان دارید؟')) {
      try {
        await generateNLPSamples()
        alert('پست‌های نمونه با موفقیت تولید شدند')
      } catch (error) {
        alert('خطا در تولید پست‌ها: ' + error.message)
      }
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>پردازش زبان طبیعی</h1>
        <button 
          className="btn btn-warning"
          onClick={handleGenerateSamples}
          disabled={loading}
        >
          {loading ? 'در حال تولید...' : '🎲 تولید پست‌های نمونه'}
        </button>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">اطلاعات سیستم</h3>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between">
                  <span>تعداد پست‌ها:</span>
                  <strong>{nlpPosts.totalPosts || 0}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>صفحه فعلی:</span>
                  <strong>{nlpPosts.page || 1}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>تعداد کل صفحات:</span>
                  <strong>{nlpPosts.totalPages || 1}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">پست‌های پردازش زبان طبیعی</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner"></div>
                  <p className="text-muted mt-2">در حال بارگذاری...</p>
                </div>
              ) : !nlpPosts.posts || nlpPosts.posts.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  پستی یافت نشد. برای شروع دکمه "تولید پست‌های نمونه" را بزنید.
                </div>
              ) : (
                <div className="row">
                  {nlpPosts.posts.map((post) => (
                    <div key={post.id} className="col-12 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title">{post.title}</h5>
                          <p className="card-text">{post.content}</p>
                          <div className="mt-2">
                            <span className="badge bg-primary me-1">{post.category}</span>
                            {post.tags.map((tag, index) => (
                              <span key={index} className="badge bg-secondary me-1">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NLP
