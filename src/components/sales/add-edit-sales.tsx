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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useForm, Resolver, useFieldArray } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { DialogClose } from "@radix-ui/react-dialog"
import InputComp from "../inputComp"
import React, { useState } from "react"
import axios from "axios"

import { toast } from "sonner"
import { Textarea } from "../ui/textarea"
import { AddIcon, DeleteIcon, EditIcon } from "@/assets/icons"
import { salesSchema } from "@/utils/validations/sales.validation"
import useSWR from "swr"
import CustomSelect from "../CustomSelect"
import { Label } from "../ui/label"
interface AddCategoryProps {
    mutate: any;
    user?: {
        _id?: string
        user: string;
        items: Array<{
            category: string;
            subCategory: string;
            quantity: number;
            price: number;
        }>;
        totalAmount: number;
        paidAmount: number;
        dueAmount: number;
        status: string;
        date: Date;
    }

}
type SalesData = {
    user: string;
    items: {
        category: string;
        subCategory: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    status: NonNullable<'unpaid' | 'paid' | undefined>;
    date: Date;
};
const defaultValues: SalesData = {
    user: '',
    items: [
        {
            category: '',
            subCategory: '',
            quantity: 1,
            price: 0,
        },
    ],
    totalAmount: 0,
    paidAmount: 0,
    dueAmount: 0,
    status: 'unpaid',
    date: new Date(),
};
const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
const AddEditSales: React.FC<AddCategoryProps> = ({ mutate, user }) => {
    const [loading, setLoading] = useState(false)
    const { data } = useSWR(`${baseUrl}/user`, async (args) => {
        const { data } = await axios.get(args, {
            withCredentials: true
        })
        return data?.data
    })
    const customers = data?.data

    const { data: categoryData } = useSWR(`${baseUrl}/category`, async (args) => {
        const { data } = await axios.get(args, {
            withCredentials: true
        })
        return data?.data
    })
    //--------------------------- FROM LOGIC -------------------
    const {
        handleSubmit,
        control,
        setValue,
        reset,
        register,

    } = useForm<SalesData>({
        resolver: yupResolver(salesSchema),
        defaultValues: defaultValues,
        mode: "onChange"
    })

    const { append, fields, remove } = useFieldArray({
        control,
        name: "items",
    })
    // ----------------- HANDLE SUBMITTION ------------- 
    const submitCustomerAdded = async (data: any) => {
        setLoading(true)
        await axios.post(`${baseUrl}/user`, data, {
            withCredentials: true
        }).then(() => {
            setLoading(false)
            mutate()
            toast.success("Added", {
                description: "Sales Added in database",
            })
            // reset(initialValues)
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
                <Button className="h-10">Add Sales</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Sales</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(submitCustomerAdded)}>
                    <Label>Customer</Label>
                    <CustomSelect
                        name="user"
                        placeholder="Select Customer"
                        label="Customers"
                        options={customers}
                        control={control}
                        setValue={setValue}
                    />

                    <div>
                        {
                            fields.map((item, index) => (
                                <div key={item.id} className="flex flex-col border pt-3 px-3 bg-slate-100 rounded-md my-6">
                                    <div className="flex gap-4">
                                        {/* Select the category */}
                                        <Select {...register(`items[${index}].category` as keyof SalesData)} onValueChange={(value) => setValue(`items[${index}].category` as keyof SalesData, value)}>
                                            <SelectTrigger className="w-full capitalize">
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Category</SelectLabel>
                                                    {categoryData && categoryData.map((option: any) => (!option.parentCategoryId && <SelectItem className="capitalize" key={option._id} value={option._id}>
                                                        {option.category}
                                                    </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select >

                                        {/* Select Sub category */}
                                        <Select {...register(`items[${index}].subCategory` as keyof SalesData)} onValueChange={(value) => setValue(`items[${index}].subCategory` as keyof SalesData, value)}>
                                            <SelectTrigger className="w-full capitalize">
                                                <SelectValue placeholder="Sub Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Select Sub Category</SelectLabel>
                                                    {categoryData && categoryData.map((option: any) => (option.parentCategoryId && <SelectItem className="capitalize" key={option._id} value={option._id}>
                                                        {option.category}
                                                    </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select >
                                    </div>


                                    <div className="flex gap-2 items-center">
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
                                        <AddIcon type="button" onClick={() => append({
                                            category: '',
                                            subCategory: '',
                                            quantity: 1,
                                            price: 0,
                                        })} className="text-orange-600 w-9 h-7 cursor-pointer" />
                                        <DeleteIcon type="button" onClick={() => remove(index)} className="text-orange-600 w-9 h-7 cursor-pointer" />
                                    </div>

                                </div>
                            ))
                        }
                    </div>
                    <div className="">
                        <InputComp
                            label="Name"
                            name="name"
                            placeHolder="Enter Customer name"
                            control={control}
                        />
                        <InputComp
                            label="Phone NO."
                            name="cellNo"
                            control={control}
                        />
                        <InputComp
                            label="City"
                            name="city"
                            control={control}
                        />
                        <InputComp
                            label="Address"
                            name="address"
                            control={control}
                        />
                        {/* <Textarea {...register("description")} name="description" className="min-h-60px" placeholder="Description about user" /> */}

                    </div>
                    <DialogFooter className="mt-3">
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

export default AddEditSales
