'use client'
import { yupResolver } from '@hookform/resolvers/yup'
import { DialogClose } from '@radix-ui/react-dialog'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { EditIcon } from '@/assets/icons'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import axiosInstance from '@/utils/axiosInstance'
import { categorySchema } from '@/utils/validations/category'

import InputComp from '../inputComp'
interface EditCategoryProps {
  id: string
  categoryProp: string
  mutate: any
}

const EditCategory: React.FC<EditCategoryProps> = ({
  id,
  categoryProp,
  mutate
}) => {
  const [loading, setLoading] = useState(false)
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      category: categoryProp
    },
    mode: 'onChange'
  })

  const onSubmit = async (data: any) => {
    setLoading(true)
    await axiosInstance
      .patch(`/category/${id}`, data)
      .then(() => {
        setLoading(false)
        mutate()
        toast.success('Data Updated Successfully')
      })
      .catch((err) => {
        console.log(err, 'error===========')
        setLoading(false)
        toast.error('Error', {
          description: 'Something went wrong.Try Later'
        })
      })
  }
  return (
    <Dialog>
      <DialogTrigger
        className="h-4 w-20 cursor-pointer text-accent z-50"
        asChild
      >
        <EditIcon />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <InputComp
              label="Edit Category"
              name="category"
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

export default EditCategory
