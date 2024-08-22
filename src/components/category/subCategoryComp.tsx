import React from 'react'
import { toast } from 'sonner'

import { DeleteIcon } from '@/assets/icons'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { TabsContent } from '@/components/ui/tabs'
import axiosInstance from '@/utils/axiosInstance'

import AddSubCategory from './add-subCategory'
import EditCategory from './edit-category'

interface SubCategoryCompProps {
  categories: any[]
  mutate: any
}
const SubCategoryComp: React.FC<SubCategoryCompProps> = ({
  categories,
  mutate
}) => {
  const deleteCat = (id: string) => {
    axiosInstance
      .delete(`/category/${id}`)
      .then(() => {
        toast.success('Success', {
          description: 'Category Deleted'
        })
        mutate()
      })
      .catch(() => {
        toast.error('Error', {
          description: 'Something went wrong.Try Later'
        })
      })
  }

  return (
    <Card className="w-full max-w-3xl bg-gray-50 rounded-none">
      <TabsContent value="subCategory">
        <CardHeader className="flex flex-row items-center  justify-between -mt-2 rounded-t-md">
          <h1 className="font-bold sm:text-xl text-lg text-neutral-700">
            Sub Category
          </h1>
          <AddSubCategory categories={categories} mutate={mutate} />
        </CardHeader>
        <CardContent>
          <Table className="w-full min-w-[360px]">
            <TableHeader className="">
              <TableRow className="grid grid-cols-6 w-full border bg-gray-500 text-white text-sm">
                <TableHead className="h-10 mt-4 col-span-2 text-white">
                  Sub Category
                </TableHead>
                <TableHead className="h-10 mt-4 col-span-2 text-white">
                  Category
                </TableHead>
                <TableHead className="h-10 mt-4  text-center text-white">
                  Edit
                </TableHead>
                <TableHead className="h-10 mt-4  text-center text-white">
                  Delete
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories &&
                categories.map(
                  (cat) =>
                    cat.parentCategoryId && ( // Only Sub Categories will be displayed
                      <TableRow className="grid grid-cols-6" key={cat.category}>
                        <TableCell className="font-medium col-span-2 p-4 align-middle">
                          {cat.category}
                        </TableCell>
                        <TableCell className="font-medium col-span-2 p-4 align-middle">
                          {cat?.parentCategoryId.category}
                        </TableCell>
                        <TableCell className="flex justify-center">
                          {' '}
                          <EditCategory
                            id={cat._id}
                            categoryProp={cat.category}
                            mutate={mutate}
                          />{' '}
                        </TableCell>
                        <TableCell className="flex justify-center">
                          {' '}
                          <DeleteIcon
                            className="h-4 w-20 cursor-pointer text-accent"
                            onClick={() => deleteCat(cat._id)}
                          />{' '}
                        </TableCell>
                      </TableRow>
                    )
                )}
            </TableBody>
          </Table>
        </CardContent>
      </TabsContent>
    </Card>
  )
}

export default SubCategoryComp
