import React from "react"
import { useController } from "react-hook-form"

import { Input } from "@/components/ui/input"

import { Label } from "./ui/label"


type inputCompProps = {
    name: string,
    placeHolder?: string,
    control: any,
    label: string,
    type?: string
}
const InputComp = (props: inputCompProps) => {
    const { field, fieldState } = useController(props)
    const { isTouched, error } = fieldState
    return (
        <div className="my-4 relative">
            <Label htmlFor={props.name}>{props.label}</Label>
            <Input placeholder={props.placeHolder} {...field} type={props.type ? props.type : 'text'} />
            {isTouched && error && <span className="text-rose-500 text-xs mt-1 absolute right-0">{error.message}</span>}
        </div>
    )
}

export default InputComp
