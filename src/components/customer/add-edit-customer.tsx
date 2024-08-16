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
import { useForm, Resolver } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { DialogClose } from "@radix-ui/react-dialog"
import InputComp from "../inputComp"
import React, { useState } from "react"
import axios from "axios"

import { toast } from "sonner"
import { Textarea } from "../ui/textarea"
import { EditIcon } from "@/assets/icons"
import { customerSchema } from "@/utils/validations/customer"
interface AddCategoryProps {
    mutate: any;
    user?: {
        _id: string;
        name: string;
        cellNo: string;
        address: string;
        city: string;
        description: string;
    }
}
interface CustomerData {
    address?: string;
    cellNo?: string;
    city?: string;
    description: string;
    name: string;
}
const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
const AddEditCustomer: React.FC<AddCategoryProps> = ({ mutate, user }) => {
    const defaultValues = {
        name: "",
        cellNo: "",
        address: "",
        city: "",
        description: ""
    };

    const initialValues = user ? {
        name: user.name,
        cellNo: user.cellNo,
        address: user.address,
        city: user.city,
        description: user.description
    } : defaultValues;

    const [loading, setLoading] = useState(false)

    const {
        handleSubmit,
        register,
        control,
        reset
    } = useForm<CustomerData>({
        resolver: yupResolver(customerSchema),
        defaultValues: user || initialValues,
        mode: "onChange"
    })

    const submitCustomerAdded = async (data: any) => {
        setLoading(true)
        await axios.post(`${baseUrl}/user`, data, {
            withCredentials: true
        }).then(() => {
            setLoading(false)
            mutate()
            toast.success("Added", {
                description: "Customer Added in database",
            })
            reset(initialValues)
        }).catch((err) => {
            console.log(err, "error===========")
            setLoading(false)
            toast.error("Error", {
                description: "Something went wrong.Try Later",
            })
        })
    }
    const submitCustomerEdit = async (data: any) => {
        setLoading(true)
        await axios.patch(`${baseUrl}/user/${user?._id}`, data, {
            withCredentials: true
        }).then(() => {
            setLoading(false)
            mutate()
            toast.success("Customer Data Updated")
            reset(initialValues)
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
                {user ? <EditIcon className="text-orange-600 cursor-pointer" /> : <Button className="h-10">Add Customer</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Customer</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(user ? submitCustomerEdit : submitCustomerAdded)}>
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
                        <Textarea {...register("description")} name="description" className="min-h-60px" placeholder="Description about user" />

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

export default AddEditCustomer
