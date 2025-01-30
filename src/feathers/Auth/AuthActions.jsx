import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const checkAuth = createAsyncThunk(
    "auth/checkAuth",
    async (userAuth, thunkAPI) => {
        console.log(userAuth)
      try {
        const response = await axios({
          method: "post",
          url: "http://localhost:8080/auth/login",
          headers: { "Content-Type": "application/json" },
          data: userAuth,
        });
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("userInfo", response.data.user);
        localStorage.setItem("fullName", response.data.user.fullName);
        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("role", response.data.user.role);
        console.log(response.data,"from response");
        return response.data;
      } catch (error) {
        const message = error.response?.data || error.message;
        console.log(message);
        return thunkAPI.rejectWithValue({ message });
      }
    }
  );