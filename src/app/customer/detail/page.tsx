'use client'
import React, { Suspense } from 'react'

import { BackArrow, DeleteIcon } from '@/assets/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
import axios from 'axios'
import { DollarSign } from 'lucide-react'
import moment from 'moment'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import useSWR from 'swr'

import { DeleteComp } from '@/components/delete-comp'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const CustomerPage = () => {
  const param = useSearchParams()
  const router = useRouter()
  const id = param.get('id')
  const deleteUrl = `${baseUrl}/user`

  const { data, error, isLoading } = useSWR(
    `${baseUrl}/invoice/detail`,
    async (args) => {
      const { data } = await axios.get(args, {
        withCredentials: true,
        params: {
          userId: id
        }
      })
      return data?.data
    }
  )
  if (isLoading) {
    return <div>loading...</div>
  }
  if (error) {
    toast.error('Error', {
      description: 'Something went wrong. Try later'
    })
  }

  return (
    <Suspense fallback={<div>Loading...!</div>}>
      <main className=" w-full  flex items-start justify-center  bg-white">
        <Card className="w-full max-w-4xl bg-slate-50 rounded-none  sm:px-12 sm:py-6 min-h-screen ">
          <CardHeader className=" -mt-2 rounded-t-md">
            <div>
              <Button className="rounded-sm h-9" onClick={router.back}>
                <BackArrow />
                Back
              </Button>
            </div>
            <div className="flex flex-row items-center justify-between">
              <h1 className="font-bold text-xl">Customer Detail</h1>
              <DeleteComp
                url={deleteUrl}
                id={id || ''}
                redirectUrl={'/customer'}
              >
                <Button className="rounded-sm" variant={'outline'}>
                  <DeleteIcon className="cursor-pointer mr-2 hover:text-accent-foreground" />{' '}
                  Delete User
                </Button>
              </DeleteComp>
            </div>
          </CardHeader>

          <CardContent className="sm:p-6 p-2">
            {/* --------------- Total Amount Total Paid Total Due --------------- */}
            <div className="flex w-full space-x-3 mb-3">
              <Card className="max-w-64 w-full rounded-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Amount
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <span>Rs. </span>
                    {data?.stat?.totalAmount || 0}
                  </div>
                </CardContent>
              </Card>
              <Card className="max-w-64 w-full rounded-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Paid
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <span>Rs. </span>
                    {data?.stat?.totalPaid || 0}
                  </div>
                </CardContent>
              </Card>
              <Card className="max-w-64 w-full rounded-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Due
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <span>Rs. </span>
                    {data?.stat?.totalDue || 0}
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* ------------------------ USER DETAIL --------------------------- */}
            <div className="w-full border rounded-sm sm:px-6 sm:py-6 px-3 py-3 mb-4 space-y-4 shadow-sm bg-white">
              <div className="flex space-x-5 capitalize">
                <Label className="text-gray-600 mr-9 capitalize">Name:</Label>
                <Label>{data?.user?.name}</Label>
              </div>
              <div className="flex space-x-5">
                <Label className="text-gray-600  mr-1">Phone No.:</Label>
                <Label>{data?.user?.cellNo}</Label>
              </div>
              <div className="flex space-x-5 capitalize">
                <Label className="text-gray-600 mr-12">City:</Label>
                <Label>{data?.user?.city}</Label>
              </div>
              <div className="flex space-x-5 capitalize">
                <Label className="text-gray-600 mr-6">address:</Label>
                <Label>{data?.user?.address}</Label>
              </div>
              <div className="flex space-x-5 capitalize">
                <Label className="text-gray-600">Description:</Label>
                <Label>{data?.user?.description}</Label>
              </div>
            </div>
            {/* ------------------------ SALES DETAILS ------------------------ */}
            {data?.invoice &&
              data?.invoice.map((item: any) => {
                return (
                  <CardContent
                    key={item?._id}
                    className="w-full pt-0 bg-white p-0 shadow-sm border mb-3 rounded-sm"
                  >
                    <div className="px-4 py-6">
                      <div className=" w-full h-12 bg-accent text-white text-center content-center font-semibold">
                        <span>The Invoice of Date</span>{' '}
                        {moment(item?.date).format('DD/MM/YYYY')}
                      </div>
                      {/* --------------- TABLE ---------------------- */}
                      <Table className="w-full border">
                        <TableHeader className="">
                          <TableRow className="grid grid-cols-4 w-full border bg-gray-100 text-white">
                            <TableHead className="h-10 content-center text-gray-700">
                              Category
                            </TableHead>
                            <TableHead className="h-10 content-center text-gray-700">
                              Sub Category
                            </TableHead>
                            <TableHead className="h-10 content-center text-gray-700">
                              Qty.
                            </TableHead>
                            <TableHead className="h-10 content-center text-center text-gray-700">
                              Price
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {item?.items.map((product: any) => (
                            <TableRow
                              className="grid grid-cols-4"
                              key={product?._id}
                            >
                              <TableCell className="font-medium  p-4 align-middle">
                                {product?.category?.category}
                              </TableCell>
                              <TableCell className="font-medium p-4 align-middle">
                                {product?.subCategory?.category}
                              </TableCell>
                              <TableCell className="font-medium p-4 align-middle">
                                {product?.quantity}
                              </TableCell>
                              <TableCell className="flex justify-center">
                                {product?.price}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      {/* --------------- TABLE ---------------------- */}
                      <Table className="w-full mt-4">
                        <TableHeader className="">
                          <TableRow className="grid grid-cols-4 w-full bg-gray-100">
                            <TableHead className="h-10 text-gray-600 border content-center text-center">
                              Amount
                            </TableHead>
                            <TableHead className="h-10 text-gray-600 border content-center text-center">
                              Paid Amount
                            </TableHead>
                            <TableHead className="h-10 text-gray-600 border content-center text-center">
                              Due Amount
                            </TableHead>
                            <TableHead className="h-10 text-gray-600 border content-center text-center">
                              Status
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="">
                          <TableRow className="grid grid-cols-4">
                            <TableCell className="h-10 p-2 font-medium  border content-center text-center">
                              {item.totalAmount}
                            </TableCell>
                            <TableCell className="h-10 p-2 font-medium border content-center text-center">
                              {item.paidAmount}
                            </TableCell>
                            <TableCell className="h-10 p-2 font-medium border content-center text-center">
                              {item.dueAmount}
                            </TableCell>
                            <TableCell className="h-10 p-2 font-medium border content-center text-center">
                              {item?.status ? (
                                <span className="text-accent">Paid</span>
                              ) : (
                                <span className="text-green-600">UnPaid</span>
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                )
              })}
          </CardContent>
        </Card>
      </main>
    </Suspense>
  )
}

export default CustomerPage
