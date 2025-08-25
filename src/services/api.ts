import axios from 'axios'
import { config } from '@/config'

// Instância do axios configurada
const api = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tanstack.auth.token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('tanstack.auth.token')
      localStorage.removeItem('tanstack.auth.user')
      window.location.href = '/signin'
    }
    return Promise.reject(error)
  },
)

export default api
