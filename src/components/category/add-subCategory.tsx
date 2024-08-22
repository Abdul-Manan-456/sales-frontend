'use client'
import { yupResolver } from '@hookform/resolvers/yup'
import { DialogClose } from '@radix-ui/react-dialog'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import axiosInstance from '@/utils/axiosInstance'
import { subCategorySchema } from '@/utils/validations/category'

import InputComp from '../inputComp'
interface AddSubCategoryProps {
  mutate: any
  categories: any[]
}

const AddSubCategory: React.FC<AddSubCategoryProps> = ({
  mutate,
  categories
}) => {
  const [loading, setLoading] = useState(false)
  const initialValues = {
    category: '',
    parentCategoryId: ''
  }
  const {
    handleSubmit,
    control,
    register,
    reset,

    formState: { errors, isSubmitSuccessful },
    setValue
  } = useForm({
    resolver: yupResolver(subCategorySchema),
    defaultValues: initialValues,
    mode: 'onBlur'
  })
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful])
  const onSubmit = async (data: any) => {
    setLoading(true)
    await axiosInstance
      .post(`/category`, data)
      .then(() => {
        setLoading(false)
        mutate()
        toast.success('Success', {
          description: 'Data Added Successfully'
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
  console.log('errors------', errors)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Sub Category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Sub Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4 relative">
            <Select
              {...register('parentCategoryId')}
              onValueChange={(value) => setValue('parentCategoryId', value)}
            >
              <SelectTrigger className="w-full capitalize">
                <SelectValue placeholder="Select a Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  {categories.map(
                    (item) =>
                      !item?.parentCategoryId && (
                        <SelectItem
                          className="capitalize"
                          value={`${item._id}`}
                          key={item._id}
                        >
                          {item.category}
                        </SelectItem>
                      )
                  )}
                </SelectGroup>
              </SelectContent>
              <div className="text-xs absolute right-0 -top-2 text-red-500">
                {errors.parentCategoryId && (
                  <p> {errors.parentCategoryId.message}</p>
                )}
              </div>
            </Select>
            <InputComp
              label="Sub Category"
              name="category"
              placeHolder="Enter Sub Category"
              control={control}
            />
          </div>
          <DialogFooter>
            <DialogClose className="h-10 mr-4">
              <div className="border border-input bg-background hover:bg-gray-600 hover:text-accent-foreground px-4 py-1.5 rounded-md">
                Cancel
              </div>
            </DialogClose>

            <DialogClose>
              <Button className="h-10" disabled={loading} type="submit">
                Save Changes{' '}
                <span className={loading ? 'loader ml-4' : ''}></span>
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddSubCategory
