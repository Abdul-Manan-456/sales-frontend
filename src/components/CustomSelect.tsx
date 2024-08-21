import { useController } from 'react-hook-form';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface CustomSelectProps {
    name: string;
    placeholder: string;
    label: string;
    options: { _id: string; name: string }[];
    control: any
    setValue: any
}

const CustomSelect: React.FC<CustomSelectProps> = ({ name, placeholder, label, options, control, setValue }) => {
    const { field, fieldState } = useController({ name, control })

    const { isTouched, error } = fieldState
    return (
        <Select {...field} onValueChange={(value) => setValue(name, value)}>
            <SelectTrigger className="w-full capitalize">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {options && options.map((option) => (
                        <SelectItem className="capitalize" key={option._id} value={option._id}>
                            {option.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
            {isTouched && error && <span className="text-rose-500 text-xs mt-1 absolute right-0">{error.message}</span>}
        </Select >
    );
};

export default CustomSelect;
