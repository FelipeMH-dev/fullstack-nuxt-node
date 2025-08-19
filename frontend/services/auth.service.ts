import { ApiService } from './api.service'
import type { User, LoginResponse } from '@/types/user.interface'

export class AuthService extends ApiService {

  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await this.api.post('/auth/login', { email, password })
    const { token, user } = res.data
    localStorage.setItem('token', token)
    return { token, user }
  }

  async register(user: User): Promise<User> {
    const res = await this.api.post('/auth/register', user)
    return res.data
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token')
  }
}
