import { createSlice } from "@reduxjs/toolkit";
import { checkAuth } from "./AuthActions";
import { logoutHandler } from "../Logout/LogoutActions";
import { changePasswordHandler } from "../ChangePassword/ChangePassActions";
;

const userToken = localStorage.getItem("userToken")
  ? localStorage.getItem("userToken")
  : null;
const userInfo = localStorage.getItem("userInfo")
  ? localStorage.getItem("userInfo")
  : {};

const initialState = {
  loading: false,
  success: false,
  error: false,
  errorMsg: "",
  loggedIn: true,
  userToken,
  userInfo: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.success = false;
      state.error = false;
      state.errorMsg = "";
      state.loggedIn = false;
      state.userToken = null;
      state.userInfo = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
      })
      .addCase(checkAuth.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = false;
        state.success = true;
        state.loggedIn = true;
        state.userToken = payload.token;
        state.userInfo = payload.user;
      })
      .addCase(checkAuth.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = true;
        state.errorMsg = payload.message;
        state.userToken = null;
        state.userInfo = {};
      })
      .addCase(logoutHandler.pending, (state) => {
        state.loading = false;
        state.success = false;
        state.error = false;
      })
      .addCase(logoutHandler.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = false;
        state.success = false;
        state.loggedIn = false;
        state.userToken = {};
      })
      .addCase(logoutHandler.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = false;
      })
      .addCase(changePasswordHandler.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
      })
      .addCase(changePasswordHandler.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = false;
        state.success = false;
        state.loggedIn = false;
        state.userToken = {};
      })
      .addCase(changePasswordHandler.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = false;
      })
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;