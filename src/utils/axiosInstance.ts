import axios from 'axios'

import { BaseUrl } from '@/lib/constants'

const axiosInstance = axios.create({
  baseURL: `${BaseUrl}`,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Process the response data if necessary
//     return response
//   },
//   (error) => {
//     // Handle the error
//     return Promise.reject(error)
//   }
// )

export default axiosInstance
