'use client'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { HidePassword } from '@/assets/icons/hide_password'
import { ShowPassword } from '@/assets/icons/show_password'
import InputComp from '@/components/inputComp'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { loginValidator } from '@/utils/validations'
const BaseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}`
const Login = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  //  -------------- FORM SUBMISSION LOGIC ------------------
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginValidator),
    mode: 'onChange',
    defaultValues: { email: '', password: '' }
  })
  const onSubmit = async (data: any) => {
    setLoading(true)
    await axios
      .post(`${BaseUrl}/auth/login`, data, {
        withCredentials: true
      })
      .then((res) => {
        setLoading(false)
        console.log('res--------', res)
        toast.success('Success', {
          description: res?.data?.message
        })
        Cookies.set('auth-token', res?.data?.data?.token, {
          sameSite: 'None',
          path: '/',
          secure: true
        })
        router.push('/')
      })
      .catch((err: any) => {
        setLoading(false)
        console.log('err-----', err)
        toast.error('Error', { description: err?.response?.data?.message })
      })
  }

  return (
    <main className="md:h-screen flex items-center justify-center container px-2 md:px-0 pt-9 md:pt-0 ">
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <InputComp
                name="email"
                label="Email"
                placeHolder="Enter your email"
                control={control}
              />

              <div className="relative">
                <InputComp
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeHolder="Enter your password"
                  control={control}
                />

                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 transform -translate-y-0 mr-2 cursor-pointer p-1"
                >
                  {showPassword ? <ShowPassword /> : <HidePassword />}
                </div>
              </div>
              <div>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-gray-600 underline hover:text-sky-600"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="w-full flex flex-col items-center justify-center">
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full mt-6 rounded-sm"
                >
                  Login<span className={loading ? 'loader ml-3' : ''}></span>
                </Button>
                {/* <Button variant="outline" className="w-full">
                                    Login with Google
                                </Button> */}
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="underline">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

export default Login
