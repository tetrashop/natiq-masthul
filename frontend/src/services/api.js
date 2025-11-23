import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API Error:', error)
    const message = error.response?.data?.error || error.message || 'خطا در ارتباط با سرور'
    return Promise.reject(new Error(message))
  }
)

export const knowledgeAPI = {
  getHealth: () => api.get('/knowledge/health'),
  getItems: (page = 1, limit = 10) => api.get(`/knowledge/items?page=${page}&limit=${limit}`),
  search: (query) => api.get(`/knowledge/search?q=${encodeURIComponent(query)}`),
  addItem: (data) => api.post('/knowledge/items', data),
  getAnalytics: () => api.get('/knowledge/analytics')
}

export const nlpAPI = {
  getHealth: () => api.get('/nlp/health'),
  getPosts: (page = 1, limit = 20) => api.get(`/nlp/posts?page=${page}&limit=${limit}`),
  generateSamples: () => api.post('/nlp/generate-samples')
}

export default api
