import axios from '../untils/request'

export function Find (params) {
  return axios.get('/articles', { params })
}

export function Create (params) {
  return axios.post('/articles', params)
}

export function Update (params) {
  return axios.put(`/articles/${params.id}`, params)
}

export function Delete (params) {
  return axios.delete(`/articles/${params.id}`, params)
}