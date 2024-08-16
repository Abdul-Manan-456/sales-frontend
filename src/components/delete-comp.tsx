
import axios from "axios"
import { useRouter } from "next/navigation"
import React from "react"
import { toast } from "sonner"

import { DeleteIcon } from "@/assets/icons"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "./ui/button"

interface Props {
    id: string
    url: string
    mutate?: any
    children?: any
    redirectUrl?: any
}

export const DeleteComp: React.FC<Props> = ({ id, url, mutate, children, redirectUrl }) => {
    const router = useRouter()
    const deleteApi = (id: string) => {
        axios.delete(`${url}/${id}`, {
            withCredentials: true
        }).then(() => {
            toast.success("Success", {
                description: "Deleted Successfully",
            })
            mutate && mutate()
            redirectUrl && router.push(redirectUrl)
        }).catch(() => {
            toast.error("Error", {
                description: "Something went wrong.Try Later",
            })
        })
    }
    return (
        <Dialog>
            <DialogTrigger >
                {
                    children ? children : <DeleteIcon className="h-4 w-20 cursor-pointer text-accent" />
                }
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Do you want to delete?</DialogTitle>
                </DialogHeader>
                <DialogDescription className="">
                    This action cannot be undone.
                </DialogDescription>
                <DialogFooter className="mt-6">

                    <DialogClose>
                        <Button variant={"outline"} onClick={() => deleteApi(id)}>
                            <DeleteIcon className="cursor-pointer mr-2 hover:text-white" /> Delete
                        </Button>
                    </DialogClose>

                    <DialogClose>
                        <Button>Cancel</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
