'use client'
import { Value } from '@radix-ui/react-select'
import { stat } from 'fs'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

import LoadingSpinner from '@/components/loading/loading-spinner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { swrFetcher } from '@/utils/axiosInstance'

export default function Dashboard() {
  const [statsType, setStatsType] = useState('all')

  const url = `/invoice/stats?statsType=${statsType}`
  const { data, isLoading } = useSWR(url, swrFetcher)
  const stats = data?.at(0)

  const router = useRouter()
  const handleLogout = () => {
    Cookies.remove('token')
    router.push('/auth/login')
  }

  return (
    <div className="min-h-screen w-full flex justify-center bg-muted/40 sm:pt-10 pt-6 ">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 w-full max-w-4xl">
        <header className="flex items-center w-full justify-between">
          <h3 className="text-2xl text-gray-800">Dashboard</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z"
                  />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="">
          <Tabs onValueChange={(val) => setStatsType(val)} defaultValue="all">
            <div className="flex items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">Default</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="">
              <CardHeader className="">
                <CardDescription>Grand Total</CardDescription>
              </CardHeader>
              <CardContent className="text-4xl">
                {isLoading ? (
                  <LoadingSpinner className="w-3 h-3" />
                ) : (
                  `Rs. ${stats?.totalAmount || 0}`
                )}
              </CardContent>
            </Card>
            <Card className="">
              <CardHeader className="">
                <CardDescription>Total Collected</CardDescription>
              </CardHeader>
              <CardContent className="text-4xl">
                {isLoading ? (
                  <LoadingSpinner className="w-3 h-3" />
                ) : (
                  `Rs. ${stats?.totalPaid || 0}`
                )}
              </CardContent>
            </Card>
            <Card className="">
              <CardHeader className="">
                <CardDescription>Pending</CardDescription>
              </CardHeader>
              <CardContent className="text-4xl">
                {isLoading ? (
                  <LoadingSpinner className="w-3 h-3" />
                ) : (
                  `Rs. ${stats?.totalDue || 0}`
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
