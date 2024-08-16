import * as yup from "yup";
export const categorySchema = yup.object({
  category: yup.string().required(),
});

export const subCategorySchema = yup.object({
  category: yup.string().required(),
  parentCategoryId: yup.string().required("Select Cetegory"),
});
