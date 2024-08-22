import Cookies from 'js-cookie'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
interface ProtectedRouteProps {
  children: React.ReactNode
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter()
  const path = usePathname()
  useEffect(() => {
    const protectedRoutes = ['/', '/customer', '/category', '/sales']
    const token = localStorage.getItem('token')
    console.log('token-----------', token)
    if (!token && protectedRoutes.includes(path)) {
      router.push('/auth/login')
    }
  }, [path, router])

  return children
}

export default ProtectedRoute
