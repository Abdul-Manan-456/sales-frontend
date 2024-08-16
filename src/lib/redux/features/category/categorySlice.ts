// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// interface CategoryData {
//   category: string;
// }
// interface CategoryState {
//   category: any[];
//   loading: boolean;
//   error: string | undefined;
// }
// export const addCategory = createAsyncThunk(
//   "category/addCategory",
//   async (categoryData: WithFieldValue<CategoryData>, thunkApi) => {
//     try {
//       const docRef = await addDoc(collection(db, "categories"), categoryData);
//       console.log(docRef.id);
//       return { id: docRef.id, ...categoryData };
//     } catch (error) {
//       return thunkApi.rejectWithValue(error);
//     }
//   }
// );
// const initialState: CategoryState = {
//   category: [],
//   loading: false,
//   error: "",
// };
// const categorySlice = createSlice({
//   name: "category",
//   initialState: initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addCase(addCategory.pending, (state) => {
//       state.loading = true;
//     });
//     builder.addCase(addCategory.fulfilled, (state, action) => {
//       state.loading = false;
//       state.category.push(action.payload);
//     });
//     builder.addCase(addCategory.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.error.message;
//     });
//   },
// });
// export default categorySlice.reducer;
