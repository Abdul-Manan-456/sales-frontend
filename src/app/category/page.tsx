'use client'
import { toast } from 'sonner'
import useSWR from 'swr'

import CategoryComp from '@/components/category/categoryComp'
import SubCategoryComp from '@/components/category/subCategoryComp'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import axiosInstance from '@/utils/axiosInstance'
const Category = () => {
  const { data, error, isLoading, mutate } = useSWR(
    '/category',
    async (args) => {
      const { data } = await axiosInstance.get(args)
      return data
    }
  )
  const categories = data?.data

  if (isLoading) {
    return <div>loading...</div>
  }
  if (error) {
    toast.error('Error', {
      description: 'Something went wrong. Try later'
    })
  }
  return (
    <main className="w-full  flex items-start justify-center  bg-muted/30 h-screen ">
      <Card className="w-full max-w-4xl rounded-none flex justify-center p-2 h-screen border-none">
        <Tabs defaultValue="category" className="w-full max-w-3xl">
          <TabsList className="grid h-12 grid-cols-2 max-w-56 my-3 mb-7">
            <TabsTrigger className="py-2.5" value="category">
              Category
            </TabsTrigger>
            <TabsTrigger className="py-2.5" value="subCategory">
              Sub Category
            </TabsTrigger>
          </TabsList>

          <CategoryComp categories={categories} mutate={mutate} />

          {/* Sub Category */}
          <SubCategoryComp categories={categories} mutate={mutate} />
        </Tabs>
      </Card>
    </main>
  )
}

export default Category
