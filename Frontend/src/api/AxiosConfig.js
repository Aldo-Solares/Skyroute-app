import axios from 'axios'
import { getToken, clearSession } from '../storage/StorageService'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false
})

// =========================
// INTERCEPTOR DE REQUEST
// =========================
api.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => Promise.reject(error)
)

// =========================
// INTERCEPTOR DE RESPONSE
// =========================
api.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status
    if (status === 401) {
      clearSession()
    }

    return Promise.reject(error)
  }
)

export default api
