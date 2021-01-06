
import axios from 'axios'
const Axios = axios.create()
import { ElMessage } from 'element-plus'
import store from '../store'

Axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
Axios.interceptors.request.use((config) => {
  const token = store.state.token
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config;
}, (error) => {
  return Promise.reject(error)
})
Axios.interceptors.response.use((response) => {
  return response.data
}, (error) => {
  if (error.response.status === 400) {
    ElMessage.error(error.response.data.data[0].messages[0].id)
  } else if (error.response.status === 500) {
    ElMessage.error('系统出错，请稍后再试')
  }
})

export default Axios