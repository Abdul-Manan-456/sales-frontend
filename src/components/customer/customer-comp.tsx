import axios from "axios"
import React from "react"
import { toast } from "sonner"

import { DeleteIcon } from "@/assets/icons"
import AddCategory from "@/components/category/add-category"
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import EditCategory from "../category/edit-category"


const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL

interface CategoryCompProps {
    categories: any[];
    mutate: any;
}
const CategoryComp: React.FC<CategoryCompProps> = ({ categories, mutate }) => {
    console.log("categories----------", categories)
    const deleteCat = (id: string) => {
        axios.delete(`${baseUrl}/category/${id}`, {
            withCredentials: true
        }).then(() => {
            toast.success("Success", {
                description: "Category Deleted",
            })
            mutate()
        }).catch(() => {
            toast.error("Error", {
                description: "Something went wrong.Try Later",
            })
        })
    }

    return (
        <Card className="w-full max-w-3xl bg-gray-50 rounded-none">

            <CardHeader className="flex flex-row items-center justify-between -mt-2 rounded-t-md">
                <h1 className="font-bold text-xl">Category</h1>
                <AddCategory mutate={mutate} />
            </CardHeader>
            <CardContent>
                <Table className="w-full">
                    <TableHeader className="">
                        <TableRow className="grid grid-cols-4 w-full border bg-gray-500 text-white">
                            <TableHead className="h-10 mt-4 col-span-2 text-white">Category</TableHead>
                            <TableHead className="h-10 mt-4  text-center text-white">Edit</TableHead>
                            <TableHead className="h-10 mt-4  text-center text-white">Delete</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories && categories.map((cat) => (
                            !cat?.parentCategoryId &&  // Only Parent Categories will be displayed
                            <TableRow className="grid grid-cols-4" key={cat.category}>
                                <TableCell className="font-medium col-span-2 p-4 align-middle">{cat.category}</TableCell>
                                <TableCell className="flex justify-center"> <EditCategory id={cat._id} categoryProp={cat.category} mutate={mutate} /> </TableCell>
                                <TableCell className="flex justify-center"> <DeleteIcon className="h-4 w-20 cursor-pointer text-accent" onClick={() => deleteCat(cat._id)} /> </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>

        </Card>
    )
}

export default CategoryComp
