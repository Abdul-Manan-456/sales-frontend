'use client'
import { yupResolver } from '@hookform/resolvers/yup'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import useSWR from 'swr'

import { BackArrow, DeleteIcon, MaterialSymbolsAdd } from '@/assets/icons'
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
import axiosInstance from '@/utils/axiosInstance'
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
const defaultValues: SalesData = {
  userId: '',
  items: [
    {
      category: '',
      subCategory: ''
    }
  ],
  totalAmount: 0,
  status: false,
  date: new Date()
}
const swrFetcher = async (args: string) => {
  const { data } = await axiosInstance.get(args)
  return data
}

const AddSales = () => {
  const router = useRouter()
  const [date, setDate] = React.useState<Date>()
  const [loading, setLoading] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  // -----------------    FETCH DATA FROM BACKEND ----------
  const { data } = useSWR(`/user`, swrFetcher)
  const customers = data?.data
  const { data: fetchCategory } = useSWR(`/category`, swrFetcher)
  const categoryData = fetchCategory?.data
  //--------------------------- FROM LOGIC -------------------
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    register,
    formState: { errors }
  } = useForm<SalesData>({
    resolver: yupResolver(salesSchema),
    defaultValues: defaultValues,
    mode: 'onChange'
  })
  const { append, fields, remove } = useFieldArray({
    control,
    name: 'items'
  })
  const itemsArray = useWatch({ control, name: 'items' })
  const paidAmountWatch = useWatch({ control, name: 'paidAmount' })
  const grandTotal = itemsArray?.reduce(
    (total, item) => total + (item.quantity || 0) * (item.price || 0),
    0
  ) as number
  setValue('totalAmount', grandTotal)
  setValue('dueAmount', grandTotal - (paidAmountWatch || 0))
  const handleDate = (date: any) => {
    const utcDate = moment(date).format()
    setDate(date)
    setValue('date', utcDate as any)
  }
  // ----------------- HANDLE SUBMITTION -------------
  const onSubmit = async (data: any) => {
    const submittedData = { ...data, date, status: isChecked }
    setLoading(true)
    await axiosInstance
      .post(`/invoice`, submittedData)
      .then(() => {
        setLoading(false)
        toast.success('Added', {
          description: 'Sales Added in database'
        })
        reset(defaultValues)
      })
      .catch(() => {
        setLoading(false)
        toast.error('Error', {
          description: 'Something went wrong.Try Later'
        })
      })
    router.back()
  }
  const appendItem = () =>
    append({
      category: '',
      subCategory: ''
    })

  return (
    <div className="bg-slate-100 py-10 flex justify-center w-full">
      <Card className="rounded-sm w-full max-w-xs sm:max-w-4xl">
        <CardHeader>
          <Button onClick={router.back} className="h-8 w-20 mb-2">
            <BackArrow /> Back
          </Button>
          <CardTitle>Add Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ------------------- CUSTOMERS -------------------- */}
            <div>
              <Label>Customer</Label>
              <Select
                {...register('userId')}
                onValueChange={(value) => setValue('userId', value)}
              >
                <SelectTrigger className="w-full capitalize">
                  <SelectValue placeholder="Select Customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Customers</SelectLabel>
                    {customers &&
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
              <p className="text-xs text-red-500">
                {errors && errors?.userId?.message}
              </p>
            </div>

            {/* -------------------   ITEMS (FIELD ARRAY)  -------------- */}
            <div>
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 flex-row border pt-3 px-3 bg-slate-100 rounded-md my-6"
                >
                  <div className="w-full sm:flex sm:space-x-3 sm:justify-between mb-1">
                    {/* -------------              Select the category             -----------*/}
                    <div className="relative mt-4 sm:w-44 w-full">
                      <Label>Category</Label>
                      <Select
                        {...register(
                          `items[${index}].category` as keyof SalesData
                        )}
                        onValueChange={(value) =>
                          setValue(
                            `items[${index}].category` as keyof SalesData,
                            value
                          )
                        }
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

                    {/* ------------        SUB CATEGORY        ---------------- */}
                    <div className="relative mt-4 sm:w-44 w-full">
                      <Label>Sub Category</Label>
                      <Select
                        {...register(
                          `items[${index}].subCategory` as keyof SalesData
                        )}
                        onValueChange={(value) =>
                          setValue(
                            `items[${index}].subCategory` as keyof SalesData,
                            value
                          )
                        }
                      >
                        <SelectTrigger className="w-full capitalize">
                          <SelectValue placeholder="Sub Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select Sub Category</SelectLabel>
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
              <div className="flex items-center space-x-2 mb-4 mt-4">
                <Switch
                  {...register('status')}
                  onCheckedChange={() => setIsChecked(!isChecked)}
                  id="unPaid"
                />
                <Label htmlFor="unPaid">{isChecked ? 'Paid' : 'Unpaid'}</Label>
              </div>
              {/* ------------------          DATE PICKER         -------- */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    {...register('date')}
                    variant={'outline'}
                    className={cn(
                      'w-[280px] justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="mt-10 flex items-center justify-between">
              <Link href="/sales">
                <Button variant={'outline'} className="hover:bg-gray-700">
                  Cancel
                </Button>
              </Link>

              <Button className="h-10 px-8" disabled={loading} type="submit">
                Save Changes
                <span className={loading ? 'loader ml-4' : ''}></span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
export default AddSales
