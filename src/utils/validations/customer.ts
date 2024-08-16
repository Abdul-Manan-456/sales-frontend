import * as yup from "yup";

export const customerSchema = yup.object({
  name: yup.string().required("Name is required").trim(),
  cellNo: yup.string().optional().trim(),
  address: yup.string().optional().trim(),
  city: yup.string().optional().trim(),
  description: yup.string().default("").trim(),
});
