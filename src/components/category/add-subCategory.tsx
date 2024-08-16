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
import { categorySchema, subCategorySchema } from "@/utils/validations/category"
import { DialogClose } from "@radix-ui/react-dialog"
import InputComp from "../inputComp"
import React, { useEffect, useState } from "react"
import axios from "axios"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
interface AddSubCategoryProps {
    mutate: any;
    categories: any[];
}

const AddSubCategory: React.FC<AddSubCategoryProps> = ({ mutate, categories }) => {

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
    const [loading, setLoading] = useState(false)
    const initialValues = {
        category: "",
        parentCategoryId: ""
    }
    const {
        handleSubmit,
        control,
        register,
        reset,

        formState: { errors, isSubmitSuccessful },
        setValue,
    } = useForm({
        resolver: yupResolver(subCategorySchema),
        defaultValues: initialValues,
        mode: "onBlur"
    })
    useEffect(() => {
        if (isSubmitSuccessful) {
            reset()
        }
    }, [isSubmitSuccessful])
    const onSubmit = async (data: any) => {
        setLoading(true)
        await axios.post(`${baseUrl}/category`, data, {
            withCredentials: true
        }).then(() => {
            setLoading(false)
            mutate()
            toast.success("Success", {
                description: "Data Added Successfully",
            })
        }).catch((err) => {
            console.log(err, "error===========")
            setLoading(false)
            toast.error("Error", {
                description: "Something went wrong.Try Later",
            })
        })
    }
    console.log("errors------", errors)
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
                        <Select  {...register("parentCategoryId")} onValueChange={(value) => setValue("parentCategoryId", value)} >
                            <SelectTrigger className="w-full capitalize">
                                <SelectValue placeholder="Select a Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Category</SelectLabel>
                                    {
                                        categories.map(item => !item?.parentCategoryId &&
                                            < SelectItem className="capitalize" value={`${item._id}`}>
                                                {item.category}
                                            </SelectItem>)
                                    }
                                </SelectGroup>
                            </SelectContent>
                            <div className="text-xs absolute right-0 -top-2 text-red-500">
                                {errors.parentCategoryId && <p> {errors.parentCategoryId.message}</p>}
                            </div>
                        </Select>
                        <InputComp
                            label="Sub Category"
                            name="category"
                            placeHolder="Enter Sub Category"
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
        </Dialog >
    )
}

export default AddSubCategory
