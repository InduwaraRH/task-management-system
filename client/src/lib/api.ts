import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach token automatically
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('tms:token')
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
  } catch (e) {
    // noop
  }
  return config
})

// Response interceptor to handle 401 centrally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // TODO: handle logout / redirect to login
    }
    return Promise.reject(err)
  }
)

export default api
