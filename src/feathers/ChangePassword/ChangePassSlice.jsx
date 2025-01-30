import { createSlice } from "@reduxjs/toolkit";
import { checkAuth } from "../Auth/AuthActions";
import { changePasswordHandler } from "./ChangePassActions";
const userToken = localStorage.getItem("userToken")
  ? localStorage.getItem("userToken")
  : null;

const initialState = {
  loading: false,
  success: false,
  error: false,
};

const changePassSlice = createSlice({
  name: "changePass",
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
      .addCase(changePasswordHandler.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
      })
      .addCase(changePasswordHandler.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = false;
        state.success = true;
      })
      .addCase(changePasswordHandler.rejected, (state, { payload }) => {
        state.loading = false;
        state.success = false;
        state.error = true;
      })
    //   .addCase(checkAuth.pending, (state) => {
    //     state.loading = false;
    //     state.success = false;
    //     state.error = false;
    //   })
    //   .addCase(checkAuth.fulfilled, (state, { payload }) => {
    //     state.loading = false;
    //     state.error = false;
    //     state.success = false;
    //   })
    //   .addCase(checkAuth.rejected, (state, { payload }) => {
    //     state.loading = false;
    //     state.error = true;
    //     state.success = false;
    //       })
    },
});

export const { reset } = changePassSlice.actions;
export default changePassSlice.reducer;