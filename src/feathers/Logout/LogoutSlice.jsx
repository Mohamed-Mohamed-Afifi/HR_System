import { createSlice } from "@reduxjs/toolkit";
import { logoutHandler } from "./LogoutActions";
import { checkAuth } from "../Auth/AuthActions";
;

const userToken = localStorage.getItem("userToken")
  ? localStorage.getItem("userToken")
  : null;

const initialState = {
  loading: false,
  success: false,
  error: false,
//   errorMsg: "",
//   loggedIn: true,
//   userToken,
//   userInfo: {},
};

const logoutSlice = createSlice({
  name: "logout",
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.success = false;
      state.error = false;
    //   state.errorMsg = "";
    //   state.loggedIn = false;
    //   state.userToken = null;
    //   state.userInfo = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutHandler.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
      })
      .addCase(logoutHandler.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = false;
        state.success = true;
        // state.loggedIn = true;
        // state.userToken = payload.token;
        // state.userInfo = payload.user;
      })
      .addCase(logoutHandler.rejected, (state, { payload }) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        // state.errorMsg = payload.message;
        // state.userToken = null;
        // state.userInfo = {};
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = false;
        state.success = false;
        state.error = false;
      })
      .addCase(checkAuth.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = false;
        state.success = false;
        // state.loggedIn = true;
        // state.userToken = payload.token;
        // state.userInfo = payload.user;
      })
      .addCase(checkAuth.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        // state.errorMsg = payload.message;
        // state.userToken = null;
        // state.userInfo = {}; 
          })
    },
});

export const { reset } = logoutSlice.actions;
export default logoutSlice.reducer;