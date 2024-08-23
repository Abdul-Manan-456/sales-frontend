'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import InputComp from '@/components/inputComp'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { BaseUrl } from '@/lib/constants'
import { forgotPasswordValidator } from '@/utils/validations'

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false)
  //  -------------- FORM SUBMISSION LOGIC ------------------
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(forgotPasswordValidator),
    mode: 'onChange',
    defaultValues: { email: '' }
  })
  const onSubmit = async (userData: any) => {
    setLoading(true)

    await axios
      .post(`${BaseUrl}/auth/forgot-password`, userData)
      .then((res) => {
        setLoading(false)
        toast.success('Mail Sent', {
          description: res.data.message
        })
      })
      .catch((err: any) => {
        toast.error('Error', {
          description: err?.response?.data?.message
        })
        setLoading(false)
      })
  }

  return (
    <main className="container h-full flex items-center justify-center">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password?</CardTitle>
          <CardDescription>
            No worries. Enter you email address and we will share link to you to
            reset password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <InputComp
                name="email"
                label="Email"
                placeHolder="Enter your email"
                control={control}
              />

              <div className="w-full flex flex-col items-center justify-center">
                <Button
                  disabled={loading}
                  type="submit"
                  className=" mt-6 rounded-sm w-full"
                >
                  Send Mail
                  <span className={loading ? 'loader ml-3' : ''}></span>
                </Button>
                <Link
                  href="/auth/login"
                  className="text-xs text-gray-600 underline hover:text-sky-600 mt-8"
                >
                  Go back to Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

export default ForgotPassword
