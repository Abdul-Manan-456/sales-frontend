import * as yup from 'yup'

export const salesSchema = yup.object({
  userId: yup.string().required('Required'),
  items: yup
    .array()
    .of(
      yup.object({
        category: yup.string().required('Select Category'),
        subCategory: yup.string().required('Required'),
        quantity: yup
          .number()
          .typeError('Must be a number')
          .min(1, 'Quantity must be at least 1'),
        price: yup
          .number()
          .typeError('Must be a number')
          .min(0, 'Price must be at least 0')
      })
    )
    .required('Items are required')
    .min(1, 'At least one item is required'),
  totalAmount: yup
    .number()
    .typeError('Must be a number')
    .required('Required')
    .min(0, 'Total amount must be at least 0'),
  paidAmount: yup.number().nullable().typeError('Must be a number'),
  dueAmount: yup.number().nullable().typeError('Must be a number'),
  status: yup.boolean().required('the field is required'),
  date: yup
    .date()
    .default(() => new Date())
    .required('Required')
})
