// /* eslint-disable no-unused-vars */
// 'use client'
// import { yupResolver } from '@hookform/resolvers/yup'
// import { DialogClose } from '@radix-ui/react-dialog'
// import axios from 'axios'
// import React, { useState } from 'react'
// import { Resolver, useForm } from 'react-hook-form'
// import { toast } from 'sonner'
// import useSWR from 'swr'

// import { EditIcon } from '@/assets/icons'
// import { Button } from '@/components/ui/button'
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger
// } from '@/components/ui/dialog'
// import { salesSchema } from '@/utils/validations/sales.validation'

// import CustomSelect from '../CustomSelect'
// import InputComp from '../inputComp'
// import { Label } from '../ui/label'
// import { Textarea } from '../ui/textarea'
// interface AddCategoryProps {
//   mutate: any
//   user?: {
//     _id?: string
//     user: string
//     items: Array<{
//       category: string
//       subCategory: string
//       quantity: number
//       price: number
//     }>
//     totalAmount: number
//     paidAmount: number
//     dueAmount: number
//     status: string
//     date: Date
//   }
// }
// type SalesData = {
//   user: string
//   items: {
//     category: string
//     subCategory: string
//     quantity: number
//     price: number
//   }[]
//   totalAmount: number
//   paidAmount: number
//   dueAmount: number
//   status: NonNullable<'unpaid' | 'paid' | undefined>
//   date: Date
// }
// const defaultValues: SalesData = {
//   user: '',
//   items: [
//     {
//       category: '',
//       subCategory: '',
//       quantity: 1,
//       price: 0
//     }
//   ],
//   totalAmount: 0,
//   paidAmount: 0,
//   dueAmount: 0,
//   status: 'unpaid',
//   date: new Date()
// }
// const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
// const AddEditSales: React.FC<AddCategoryProps> = ({ mutate, user }) => {
//   const [loading, setLoading] = useState(false)
//   const { data } = useSWR(`${baseUrl}/user`, async (args) => {
//     const { data } = await axios.get(args, {
//       withCredentials: true
//     })
//     return data
//   })
//   const customers = data?.data

//   const { handleSubmit, control, setValue, reset } = useForm<SalesData>({
//     resolver: yupResolver(salesSchema),
//     defaultValues: defaultValues,
//     mode: 'onChange'
//   })

//   const submitCustomerAdded = async (data: any) => {
//     setLoading(true)
//     await axios
//       .post(`${baseUrl}/user`, data, {
//         withCredentials: true
//       })
//       .then(() => {
//         setLoading(false)
//         mutate()
//         toast.success('Added', {
//           description: 'Sales Added in database'
//         })
//         // reset(initialValues)
//       })
//       .catch((err) => {
//         console.log(err, 'error===========')
//         setLoading(false)
//         toast.error('Error', {
//           description: 'Something went wrong.Try Later'
//         })
//       })
//   }
//   const submitCustomerEdit = async (data: any) => {
//     setLoading(true)
//     await axios
//       .patch(`${baseUrl}/user/${user?._id}`, data, {
//         withCredentials: true
//       })
//       .then(() => {
//         setLoading(false)
//         mutate()
//         toast.success('Sales Data Updated')
//         // reset(initialValues)
//       })
//       .catch((err) => {
//         console.log(err, 'error===========')
//         setLoading(false)
//         toast.error('Error', {
//           description: 'Something went wrong.Try Later'
//         })
//       })
//   }
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         {user ? (
//           <EditIcon className="text-orange-600 cursor-pointer" />
//         ) : (
//           <Button className="h-10">Add Sales</Button>
//         )}
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Add Sales</DialogTitle>
//         </DialogHeader>
//         <form
//           onSubmit={handleSubmit(
//             user ? submitCustomerEdit : submitCustomerAdded
//           )}
//         >
//           <Label>Customer</Label>
//           <CustomSelect
//             name="user"
//             placeholder="Select Customer"
//             label="Customers"
//             options={customers}
//             control={control}
//             setValue={setValue}
//           />
//           <div className="">
//             <InputComp
//               label="Name"
//               name="name"
//               placeHolder="Enter Customer name"
//               control={control}
//             />
//             <InputComp label="Phone NO." name="cellNo" control={control} />
//             <InputComp label="City" name="city" control={control} />
//             <InputComp label="Address" name="address" control={control} />
//             {/* <Textarea {...register("description")} name="description" className="min-h-60px" placeholder="Description about user" /> */}
//           </div>
//           <DialogFooter className="mt-3">
//             <DialogClose className="h-10 mr-4">
//               <div className="border border-input bg-background hover:bg-gray-600 hover:text-accent-foreground px-4 py-1.5 rounded-md">
//                 Cancel
//               </div>
//             </DialogClose>
//             <DialogClose>
//               <Button className="h-10" disabled={loading} type="submit">
//                 Save Changes{' '}
//                 <span className={loading ? 'loader ml-4' : ''}></span>
//               </Button>
//             </DialogClose>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default AddEditSales
