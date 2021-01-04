import axios from '../untils/request'

export function Find (params) {
  return axios.get('/websites', { params })
}