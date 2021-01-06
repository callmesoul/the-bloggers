import axios from '../untils/request'

export function Login (params) {
  return axios.post('/auth/local', params)
}

export function Register (params) {
  return axios.post('/auth/local/register', params)
}

export function Me (params) {
  return axios.get('/users/me', params)
}