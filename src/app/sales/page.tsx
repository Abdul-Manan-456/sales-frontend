'use client'
import React from 'react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
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
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import useSWR from 'swr'

import { Button } from '@/components/ui/button'

const SalesPage = () => {
  const router = useRouter()
  const { data, error, isLoading } = useSWR(
    `${baseUrl}/invoice`,
    async (args) => {
      const { data } = await axios.get(args, {
        withCredentials: true
      })
      return data
    }
  )
  const sales = data?.data

  if (isLoading) {
    return <div>loading...</div>
  }
  if (error) {
    toast.error('Error', {
      description: 'Something went wrong. Try later'
    })
  }
  const navigateToEdit = (id: string) => {
    return router.push(`/sales/edit?id=${id}`)
  }
  return (
    <main className="w-full  flex items-start justify-center  bg-muted/40 h-screen ">
      <Card className="w-full max-w-3xl  rounded-none min-h-screen border-none">
        <Command>
          <CardHeader className="flex flex-row items-center justify-between mt-2 rounded-t-md">
            <h1 className="font-bold text-xl">Sales</h1>
            <div className="flex space-x-16 items-center">
              <CommandInput className="w-full" placeholder="Search..." />
              <Link href={'/sales/add'}>
                <Button>Add Sales</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Table className="w-full">
              <TableHeader className="">
                <TableRow className="grid grid-cols-4 w-full border bg-gray-500 text-white">
                  <TableHead className="h-10 mt-4 text-white">Name</TableHead>
                  <TableHead className="h-10 mt-4 text-white">Amount</TableHead>
                  <TableHead className="h-10 mt-4 text-white">
                    Due Amount
                  </TableHead>
                  <TableHead className="h-10 mt-4 text-white">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <CommandList className="max-h-none">
                  {/* <CommandGroup> */}
                  {sales &&
                    sales.map((sale: any) => (
                      <CommandItem
                        asChild
                        key={sale?._id}
                        className="w-full border-b last:border-b-0 hover:bg-slate-100"
                      >
                        <div>
                          <TableRow
                            onClick={() => navigateToEdit(sale._id)}
                            className="grid grid-cols-4 w-full"
                          >
                            <TableCell className="font-medium col-span-1 align-middle capitalize">
                              {sale?.userId?.name || '-'}
                            </TableCell>
                            <TableCell className="font-medium col-span-1 align-middle">
                              {sale.totalAmount}
                            </TableCell>
                            <TableCell className="font-medium col-span-1 align-middle">
                              {sale.dueAmount}
                            </TableCell>
                            <TableCell className="font-medium col-span-1 align-middle">
                              {sale.status ? (
                                <span className="text-green-700 text-bold">
                                  Paid
                                </span>
                              ) : (
                                <span className="text-orange-500 text-bold">
                                  Pending
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        </div>
                      </CommandItem>
                    ))}
                </CommandList>
              </TableBody>
            </Table>
          </CardContent>
        </Command>
      </Card>
    </main>
  )
}

export default SalesPage
