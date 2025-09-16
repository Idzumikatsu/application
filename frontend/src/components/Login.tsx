import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

interface LoginResponse {
  token: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post<LoginResponse>('/api/auth/signin', { email, password })
      localStorage.setItem('token', response.data.token)
      toast.success('Вход выполнен!')
      navigate('/dashboard')
    } catch (error: any) {
      console.error('Login error:', error)
      if (error.response && error.response.status === 401) {
        toast.error('Неверный email или пароль')
      } else {
        toast.error('Ошибка входа')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" required />
      <button type="submit">Войти</button>
    </form>
  )
}

export default Login