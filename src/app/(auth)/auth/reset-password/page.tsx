'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
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
import { BaseUrl } from '@/lib/constants'
import { resetPasswordValidator } from '@/utils/validations'
const ResetPassword = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const searchParam = useSearchParams()
  const param = searchParam.get('resetPasswordToken')

  //  -------------- FORM SUBMISSION LOGIC ------------------
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(resetPasswordValidator),
    mode: 'onChange',
    defaultValues: { password: '' }
  })
  const onSubmit = async (data: any) => {
    setLoading(true)
    setError('')
    const resetData = {
      password: data.password,
      resetPasswordToken: param as string
    }
    await axios
      .post(`${BaseUrl}/auth/reset-password`, resetData)
      .then(() => {
        setLoading(false)
        router.push('/auth/login')
      })
      .catch((err: any) => {
        toast.error('Error', {
          description: err?.response?.data?.message
        })
        setError(err?.response?.data?.message)
        setLoading(false)
      })
  }

  return (
    <Suspense fallback={<div>Loading...!</div>}>
      <main className="container h-full flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Rest Password</CardTitle>
            <CardDescription>
              Make sure, your new password must be different to old password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
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
                <div className="w-full flex flex-col items-center justify-center">
                  <Button
                    disabled={loading}
                    type="submit"
                    className=" mt-6 rounded-sm w-full"
                  >
                    Reset Password
                    <span className={loading ? 'loader ml-3' : ''}></span>
                  </Button>

                  {error && (
                    <Link
                      href={'/auth/forgot-password'}
                      className="text-sm underline mt-5"
                    >
                      Verify Your Mail
                    </Link>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </Suspense>
  )
}

export default ResetPassword
