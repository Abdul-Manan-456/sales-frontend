'use client'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { categorySchema } from "@/utils/validations/category"
import { DialogClose } from "@radix-ui/react-dialog"
import InputComp from "../inputComp"
import React, { useState } from "react"
import axios from "axios"

import { toast } from "sonner"
interface AddCategoryProps {
    mutate: any;
}

const AddCategory: React.FC<AddCategoryProps> = ({ mutate }) => {
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
    const [loading, setLoading] = useState(false)
    const initialValues = {
        category: "",
    }
    const {
        handleSubmit,
        control
    } = useForm({
        resolver: yupResolver(categorySchema),
        defaultValues: initialValues,
        mode: "onBlur"
    })

    const onSubmit = async (data: any) => {
        setLoading(true)
        await axios.post(`${baseUrl}/category`, data, {
            withCredentials: true
        }).then(() => {
            setLoading(false)
            mutate()
            toast.success("Success", {
                description: "Category Added",
            })
        }).catch((err) => {
            console.log(err, "error===========")
            setLoading(false)
            toast.error("Error", {
                description: "Something went wrong.Try Later",
            })
        })
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Add Category</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Category</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <InputComp
                            label="Category"
                            name="category"
                            placeHolder="Enter category"
                            control={control}
                        />
                    </div>
                    <DialogFooter >
                        <DialogClose className="h-10 mr-4">
                            <div className="border border-input bg-background hover:bg-gray-600 hover:text-accent-foreground px-4 py-1.5 rounded-md">Cancel</div>
                        </DialogClose>
                        <DialogClose>
                            <Button className="h-10" disabled={loading} type="submit">Save Changes  <span className={loading ? "loader ml-4" : ""}></span></Button>
                        </DialogClose>
                    </DialogFooter>
                </form>

            </DialogContent>
        </Dialog>
    )
}

export default AddCategory
