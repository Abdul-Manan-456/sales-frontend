'use client'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import useSWR from 'swr'

import { BackArrow, DeleteIcon, MaterialSymbolsAdd } from '@/assets/icons'
import { DeleteComp } from '@/components/delete-comp'
import InputComp from '@/components/inputComp'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { salesSchema } from '@/utils/validations/sales.validation'

type SalesData = {
  userId: string
  items: {
    category: string
    subCategory: string
    quantity?: number
    price?: number
  }[]
  totalAmount: number
  paidAmount?: number | null
  dueAmount?: number | null
  status: boolean
  date: Date
}

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
const deleteUrl = `${baseUrl}/invoice`
const redirectUrlWhenDeleted = '/sales'
const swrFetcher = async (args: string) => {
  const { data } = await axios.get(args, {
    withCredentials: true
  })
  return data
}
//
/////
////////
//////////
///////////------------- COMPONENT STARTS FROM HERE --------------
const EditSales = () => {
  const router = useRouter()
  const params = useSearchParams()
  const id = params.get('id')

  const [loading, setLoading] = useState(false)
  // -----------------    FETCH DATA FROM BACKEND ----------
  const { data } = useSWR(`${baseUrl}/user`, swrFetcher)
  const customers = data?.data
  const { data: fetchCategory } = useSWR(`${baseUrl}/category`, swrFetcher)
  const categoryData = fetchCategory?.data
  const { data: sales, isLoading } = useSWR(
    `${baseUrl}/invoice/${id}`,
    swrFetcher
  )
  const salesData = sales?.data
  const values: SalesData = {
    userId: salesData?.userId?._id,
    items: salesData?.items?.map((item: any) => ({
      category: item.category?._id,
      subCategory: item.subCategory?._id,
      quantity: item.quantity,
      price: item.price
    })),
    totalAmount: salesData?.totalAmount,
    paidAmount: salesData?.paidAmount,
    dueAmount: salesData?.dueAmount,
    status: salesData?.status,
    date: salesData?.date
  }
  //--------------------------- FROM LOGIC -------------------
  const {
    handleSubmit,
    control,
    register,
    formState: { errors, dirtyFields }
  } = useForm<SalesData>({
    resolver: yupResolver(salesSchema),
    defaultValues: {
      ...values
    },
    values,
    mode: 'onChange'
  })
  const isAnyFieldDirty = Object.keys(dirtyFields).length > 0
  const { append, fields, remove } = useFieldArray({
    control,
    name: 'items'
  })
  // ----------------- HANDLE SUBMITTION -------------
  const onSubmit = async (data: any) => {
    const submittedData = { ...data }
    setLoading(true)
    await axios
      .patch(`${baseUrl}/invoice/${id}`, submittedData, {
        withCredentials: true
      })
      .then(() => {
        setLoading(false)
        toast.success('Edited', {
          description: 'Successfully Edited'
        })
      })
      .catch((err) => {
        console.log(err, 'error===========')
        setLoading(false)
        toast.error('Error', {
          description: 'Something went wrong.Try Later'
        })
      })
  }

  const appendItem = () =>
    append({
      category: '',
      subCategory: ''
    })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    )
  }

  return (
    <Suspense fallback={<div>Loading...!</div>}>
      <div className="bg-slate-100 py-10 flex justify-center w-full">
        <Card className="rounded-sm w-full max-w-xs sm:max-w-4xl">
          <CardHeader className="mb-6">
            <div className="flex flex-row items-center justify-between">
              <CardTitle>Sale Detail</CardTitle>
              <Button onClick={router.back} className="h-8 w-20 mb-2">
                <BackArrow /> Back
              </Button>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* ------------------- CUSTOMERS -------------------- */}

              <Controller
                name="userId"
                control={control}
                render={({ field }) => {
                  const { value, onChange } = field
                  console.log('value----------------', value)
                  return (
                    <div className="relative mt-4 sm:w-44 w-full">
                      <Label>Customer</Label>
                      <Select defaultValue={value} onValueChange={onChange}>
                        <SelectTrigger className="w-full capitalize mb-4">
                          <SelectValue placeholder={'Select Customer'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Customers</SelectLabel>
                            {customers &&
                              salesData &&
                              customers.map((customer: any) => (
                                <SelectItem
                                  className="capitalize"
                                  key={customer._id}
                                  value={customer._id}
                                >
                                  {customer.name}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.userId && (
                        <span className="text-xs absolute text-rose-500 top-1 right-0">
                          {errors.userId.message}
                        </span>
                      )}
                    </div>
                  )
                }}
              />

              {/* -------------------   ITEMS (FIELD ARRAY)  -------------- */}
              <div>
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 flex-row border pt-3 px-3 bg-slate-100 rounded-md my-6"
                  >
                    <div className="w-full sm:flex sm:space-x-3 sm:justify-between mb-1">
                      {/* -------------              Select the category             -----------*/}
                      <Controller
                        name={`items[${index}].category` as keyof SalesData}
                        control={control}
                        render={({ field }) => {
                          const { value, onChange } = field
                          return (
                            <div className="relative mt-4 sm:w-44 w-full">
                              <Label>Category</Label>
                              <Select
                                {...register(
                                  `items[${index}].category` as keyof SalesData
                                )}
                                defaultValue={value as string}
                                onValueChange={onChange}
                              >
                                <SelectTrigger className="w-full capitalize mb-4">
                                  <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Category</SelectLabel>
                                    {categoryData &&
                                      categoryData.map(
                                        (option: any) =>
                                          !option.parentCategoryId && (
                                            <SelectItem
                                              className="capitalize"
                                              key={option._id}
                                              value={option._id}
                                            >
                                              {option.category}
                                            </SelectItem>
                                          )
                                      )}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              {errors.items &&
                                errors.items[index] &&
                                errors.items[index].category && (
                                  <span className="text-xs absolute text-rose-500 top-1 right-0">
                                    {errors.items[index].category.message}
                                  </span>
                                )}
                            </div>
                          )
                        }}
                      />
                      {/* ------------        SUB CATEGORY        ---------------- */}
                      <Controller
                        name={`items[${index}].subCategory` as keyof SalesData}
                        control={control}
                        render={({ field }) => {
                          const { value, onChange } = field
                          return (
                            <div className="relative mt-4 sm:w-44 w-full">
                              <Label>Sub Category</Label>
                              <Select
                                {...register(
                                  `items[${index}].subCategory` as keyof SalesData
                                )}
                                defaultValue={value as string}
                                onValueChange={onChange}
                              >
                                <SelectTrigger className="w-full capitalize">
                                  <SelectValue placeholder="Sub Category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>
                                      Select Sub Category
                                    </SelectLabel>
                                    {categoryData &&
                                      categoryData.map(
                                        (option: any) =>
                                          option.parentCategoryId && (
                                            <SelectItem
                                              className="capitalize"
                                              key={option._id}
                                              value={option._id}
                                            >
                                              {option.category}
                                            </SelectItem>
                                          )
                                      )}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              {errors.items &&
                                errors.items[index] &&
                                errors.items[index].subCategory && (
                                  <span className="text-xs absolute text-rose-500 top-1 right-0">
                                    {errors.items[index].subCategory.message}
                                  </span>
                                )}
                            </div>
                          )
                        }}
                      />

                      <InputComp
                        label="Quantity"
                        name={`items.${index}.quantity`}
                        control={control}
                      />
                      <InputComp
                        label="Price"
                        name={`items.${index}.price`}
                        control={control}
                      />
                      <div className="flex items-center mt-6 space-x-4 justify-between mb-4 sm:mb-2">
                        {!!index ? (
                          <DeleteIcon
                            type="button"
                            onClick={() => remove(index)}
                            className="text-gray-500 w-9 h-7 cursor-pointer"
                          />
                        ) : (
                          <div></div>
                        )}
                        <MaterialSymbolsAdd
                          type="button"
                          onClick={appendItem}
                          className="bg-accent rounded-sm text-accent-foreground w-9 h-7 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-5" />
              <div>
                <InputComp
                  label="Total Amount"
                  name="totalAmount"
                  control={control}
                />
                <InputComp
                  label="Paid Amount"
                  name="paidAmount"
                  control={control}
                />
                <InputComp
                  label="Due Amount"
                  name="dueAmount"
                  control={control}
                />
                {/* -------------- SWITCH FOR PAID/UNPAID  ---------------*/}
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <div
                      {...field}
                      {...register('status')}
                      className="flex items-center space-x-2 mb-4 mt-4"
                    >
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="unPaid"
                      />
                      <Label htmlFor="unPaid">
                        {field.value ? 'Paid' : 'Unpaid'}
                      </Label>
                    </div>
                  )}
                />
                {/* ------------------          DATE PICKER         -------- */}
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => {
                    const { value, onChange } = field
                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[280px] justify-start text-left font-normal',
                              !value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {value ? (
                              format(value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            {...field}
                            {...register('date')}
                            mode="single"
                            selected={value}
                            onSelect={onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )
                  }}
                />
              </div>
              <div className="mt-10 flex items-center justify-between">
                <div className="">
                  <Link href="/sales">
                    <Button
                      variant={'outline'}
                      className="hover:bg-gray-700 mr-5"
                    >
                      Cancel
                    </Button>
                    <Link href={'#'}>
                      <DeleteComp
                        url={deleteUrl}
                        id={id || ''}
                        redirectUrl={redirectUrlWhenDeleted}
                      >
                        <Button
                          variant={'destructive'}
                          className="hover:bg-gray-700"
                        >
                          Delete Record
                        </Button>
                      </DeleteComp>
                    </Link>
                  </Link>
                </div>

                <Button
                  className="h-10 px-8"
                  disabled={loading || !isAnyFieldDirty}
                  type="submit"
                >
                  Save Changes
                  <span className={loading ? 'loader ml-4' : ''}></span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  )
}

export default EditSales
