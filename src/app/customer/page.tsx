'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'

import AddEditCustomer from '@/components/customer/add-edit-customer'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import axiosInstance from '@/utils/axiosInstance'

const CustomerPage = () => {
  const router = useRouter()
  const hanldeCustomerDetails = (id: string) => {
    router.push(`/customer/detail?id=${id}`)
  }

  const { data, error, isLoading, mutate } = useSWR(`/user`, async (args) => {
    const { data } = await axiosInstance.get(args)
    return data
  })
  const users = data?.data

  if (isLoading) {
    return <div>loading...</div>
  }
  if (error) {
    toast.error('Error', {
      description: 'Something went wrong. Try later'
    })
  }
  return (
    <main className="w-full  flex items-start justify-center  bg-muted/40 min-h-screen ">
      <Card className="w-full max-w-4xl bg-white rounded-none border-none min-h-screen">
        <CardHeader className="flex flex-row items-center justify-between -mt-2">
          <h1 className="font-bold text-xl text-gray-700">Customers</h1>
          <AddEditCustomer mutate={mutate} />
        </CardHeader>
        <CardContent>
          <Table className="w-full">
            <TableHeader className="">
              <TableRow className="grid grid-cols-3 w-full border bg-gray-500 text-white">
                <TableHead className="h-10 mt-4 text-white">Name</TableHead>
                <TableHead className="h-10 mt-4 text-white">City</TableHead>
                <TableHead className="h-10 mt-4 text-white">
                  Phone No.
                </TableHead>
                {/* <TableHead className="h-10 mt-4  text-center text-white">
                  Edit
                </TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users &&
                users.map((user: any) => (
                  <TableRow
                    onClick={() => hanldeCustomerDetails(user._id)}
                    className="grid grid-cols-3 hover:bg-neutral-100 h-12 sm:h-16 content-center"
                    key={user.name}
                  >
                    <TableCell className="font-medium align-middle">
                      {user.name}
                    </TableCell>
                    <TableCell className="font-medium  align-middle">
                      {user.city}
                    </TableCell>
                    <TableCell className="font-medium  align-middle">
                      {user.cellNo}
                    </TableCell>
                    {/* <TableCell
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      className="flex justify-center"
                    >
                      {' '}
                      <AddEditCustomer user={user} mutate={mutate} />
                    </TableCell> */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}

export default CustomerPage
