import axios from 'axios'
import type { AxiosInstance } from 'axios'

export class ApiService {
  protected api: AxiosInstance

  constructor(apiBase: string) {
    this.api = axios.create({
      baseURL: apiBase,
    })
    // Interceptor para agregar token automáticamente a todas las solicitudes
    this.api.interceptors.request.use(config => {
      
      const token = localStorage.getItem('token')
      if (token) {
        if (config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
      return config
    })
  }
}
