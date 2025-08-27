import axios, { type AxiosError } from 'axios'
import { config } from '@/config'

// Interface para padronizar erros da API
export interface ApiError {
  message: string
  statusCode: number
  error?: string
}

// Instância do axios configurada
export const api = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tanstack.auth.token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    console.error('API Error:', error)

    let errorMessage = 'Erro interno do servidor'
    let statusCode = 500

    if (error.response) {
      // Erro com resposta do servidor
      statusCode = error.response.status
      const data = error.response.data

      switch (statusCode) {
        case 400:
          errorMessage = data?.message || 'Dados inválidos'
          break
        case 401:
          errorMessage = data?.message || 'Não autorizado'
          // Token expirado ou inválido
          localStorage.removeItem('tanstack.auth.token')
          localStorage.removeItem('tanstack.auth.user')
          window.location.href = '/signin'
          break
        case 403:
          errorMessage = data?.message || 'Acesso negado'
          break
        case 404:
          errorMessage = data?.message || 'Recurso não encontrado'
          break
        case 409:
          errorMessage = data?.message || 'Conflito de dados'
          break
        case 422:
          errorMessage = data?.message || 'Dados de entrada inválidos'
          break
        case 500:
          errorMessage = data?.message || 'Erro interno do servidor'
          break
        default:
          errorMessage = data?.message || `Erro ${statusCode}`
      }
    } else if (error.request) {
      // Erro de rede/conexão
      errorMessage = 'Erro de conexão com o servidor'
      statusCode = 0
    } else {
      // Outro tipo de erro
      errorMessage = error.message || 'Erro desconhecido'
    }

    // Cria um objeto de erro padronizado
    const apiError = new Error(errorMessage) as Error & {
      statusCode: number
      originalError: AxiosError
    }
    apiError.statusCode = statusCode
    apiError.originalError = error

    return Promise.reject(apiError)
  }
)
