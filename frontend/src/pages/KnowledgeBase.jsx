import React, { useEffect, useState } from 'react'
import { useSystem } from '../contexts/SystemContext'

const KnowledgeBase = () => {
  const { 
    knowledgeItems, 
    loadKnowledgeItems, 
    addKnowledgeItem,
    loading 
  } = useSystem()

  const [showAddForm, setShowAddForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  })

  useEffect(() => {
    loadKnowledgeItems()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addKnowledgeItem({
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      })
      setFormData({ title: '', content: '', category: '', tags: '' })
      setShowAddForm(false)
    } catch (error) {
      alert('خطا در افزودن آیتم: ' + error.message)
    }
  }

  const filteredItems = knowledgeItems.items?.filter(item => 
    item.title?.includes(searchQuery) || 
    item.content?.includes(searchQuery) ||
    item.tags?.some(tag => tag.includes(searchQuery))
  ) || []

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>پایگاه دانش</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'انصراف' : '➕ افزودن آیتم جدید'}
        </button>
      </div>

      {/* Search Box */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="جستجو در پایگاه دانش..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h3 className="mb-0">افزودن آیتم دانش جدید</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">عنوان</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">دسته‌بندی</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">محتوا</label>
                <textarea
                  className="form-textarea"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">تگ‌ها (با کاما جدا کنید)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="NLP, هوش مصنوعی, پردازش متن"
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'در حال افزودن...' : 'افزودن آیتم'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline"
                  onClick={() => setShowAddForm(false)}
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="mb-0">آیتم‌های دانش</h3>
          <span className="text-muted">
            {filteredItems.length} آیتم
          </span>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner"></div>
              <p className="text-muted mt-2">در حال بارگذاری...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-4 text-muted">
              آیتمی یافت نشد
            </div>
          ) : (
            <div className="row">
              {filteredItems.map((item) => (
                <div key={item.id} className="col-md-6 col-lg-4 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h4 className="card-title">{item.title}</h4>
                      <p className="card-text text-muted">
                        {item.content?.substring(0, 100)}...
                      </p>
                      <div className="mt-2">
                        <span className="badge bg-primary">{item.category}</span>
                        {item.tags?.map((tag, index) => (
                          <span key={index} className="badge bg-secondary me-1">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="card-footer">
                      <small className="text-muted">
                        بازدید: {item.views || 0}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KnowledgeBase
