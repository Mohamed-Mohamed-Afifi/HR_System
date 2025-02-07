import { createSlice } from "@reduxjs/toolkit";
import { editSingleUser } from "./UserActions";
const userToken = localStorage.getItem("userToken")
  ? localStorage.getItem("userToken")
  : null;
const userInfo = localStorage.getItem("userInfo")
  ? localStorage.getItem("userInfo")
  : {};

const initialState = {
  loading: false,
  success: false,
  error: false
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.success = false;
      state.error = false;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(editSingleUser.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
    })
    .addCase(editSingleUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = false;
        state.success = true;
    })
    .addCase(editSingleUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = true;
        state.success = false;
    })
},
});
export const { reset } = userSlice.actions;
export default userSlice.reducer;