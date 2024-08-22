'use client'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { HidePassword, ShowPassword } from '@/assets/icons'
import InputComp from '@/components/inputComp'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { registerUserValidator } from '@/utils/validations/user/auth'
const BaseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}`
const Register = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  //  -------------- FORM SUBMISSION LOGIC ------------------
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(registerUserValidator),
    mode: 'onChange',
    defaultValues: { name: '', email: '', password: '' }
  })
  const onSubmit = async (userData: any) => {
    setLoading(true)
    await axios
      .post(`${BaseUrl}/auth`, userData)
      .then((res) => {
        setLoading(false)
        toast.success('User Registered', {
          description: res.data.message
        })
        router.push('/auth/login')
      })
      .catch((err: any) => {
        toast.error('Error', {
          description: err?.response?.data?.message
        })
        setLoading(false)
      })
  }

  return (
    <main className="md:h-screen flex items-center justify-center container px-2 md:px-0 pt-9 md:pt-0 border border-black">
      <Card className="w-full max-w-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <InputComp
                name="name"
                label="Name"
                placeHolder="Enter your name"
                control={control}
              />

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

              <InputComp
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeHolder="Enter your password"
                control={control}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full mt-3">
              Create an account{' '}
              <span className={loading ? 'loader ml-3' : ''}></span>
            </Button>
            {/* <Button variant="outline" className="w-full">
              Sign up with GitHub
            </Button> */}
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default Register
