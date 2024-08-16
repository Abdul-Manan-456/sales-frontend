import React from 'react'

import AddCategory from '@/components/category/add-category'
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

import { DeleteComp } from '../delete-comp'
import EditCategory from './edit-category'

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
const deleteUrl = `${baseUrl}/category`
interface CategoryCompProps {
  categories: any[]
  mutate: any
}
const CategoryComp: React.FC<CategoryCompProps> = ({ categories, mutate }) => {
  return (
    <Card className="w-full max-w-3xl bg-gray-50 rounded-none">
      <TabsContent value="category">
        <CardHeader className="flex flex-row items-center justify-between -mt-2">
          <h1 className="font-bold text-xl text-neutral-700">Category</h1>
          <AddCategory mutate={mutate} />
        </CardHeader>
        <CardContent>
          <Table className="w-full overflow-x-hidden overflow-y-hidden">
            <TableHeader>
              <TableRow className="grid grid-cols-4 w-full border bg-gray-500 text-white">
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
                    !cat?.parentCategoryId && ( // Only Parent Categories will be displayed
                      <TableRow
                        className="grid grid-cols-4 h-12 hover:bg-slate-100"
                        key={cat.category}
                      >
                        <TableCell className="font-medium col-span-2 align-middle content-center">
                          {cat.category}
                        </TableCell>
                        <TableCell className="flex justify-center items-center">
                          <EditCategory
                            id={cat._id}
                            categoryProp={cat.category}
                            mutate={mutate}
                          />
                        </TableCell>
                        <TableCell className="flex justify-center">
                          <DeleteComp
                            id={cat._id}
                            url={deleteUrl}
                            mutate={mutate}
                          />
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

export default CategoryComp
