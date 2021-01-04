
import axios from 'axios'
const Axios = axios.create()
Axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
Axios.interceptors.request.use((config) => {
  return config;
}, (error) => {
  return Promise.reject(error)
})

Axios.interceptors.response.use((response) => {

  return response.data
})

export default Axios