import axios from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'sonner'

import { BaseUrl } from '@/lib/constants'

const axiosInstance = axios.create({
  baseURL: `${BaseUrl}`,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const swrFetcher = async (url: any) => {
  const { data } = await axiosInstance
    .get(url)
    .then((res) => res.data)
    .catch((error) => {
      const errTitle = error?.request?.statusText || 'Error'
      const errDesc =
        error?.response?.data?.message || 'Something Went Wrong.Try Again Later'
      toast.error(errTitle, {
        description: errDesc
      })
      throw error?.response?.data
    })
  return data
}
export default axiosInstance
