import axios from '../untils/request'

export function Login (params) {
  return axios.post('login', params)
}