
import axios from 'axios'
const Axios = axios.create()
import { ElMessage } from 'element-plus'
import store from '../store'
import router from '../router'

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
    let msg = error.response.data.message ? error.response.data.message : error.response.data.data[0].messages[0].id
    ElMessage.error(msg)
  } else if (error.response.status === 500) {
    ElMessage.error('系统出错，请稍后再试')
  } else if (error.response.status === 401) {
    store.commit('logout')
    router.push('/login')
  }
})

export default Axios