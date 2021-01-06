import axios from '../untils/request'

export function Find (params) {
  return axios.get('/websites', { params })
}

export function Create (params) {
  return axios.post('/websites', params)
}

export function Update (params) {
  return axios.put(`/websites/${params.id}`, params)
}

export function Delete (params) {
  return axios.delete(`/websites/${params.id}`, params)
}