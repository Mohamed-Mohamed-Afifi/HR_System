import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export const changePasswordHandler = createAsyncThunk(
  "change/changePasswordHandler",
  async (passwordReq, thunkAPI) => {
    console.log(passwordReq, "form redux"); // Debugging
    try {
      const token = thunkAPI.getState().auth.userToken;
      console.log(token, "from token"); // Debugging

      // Make the API request
      const response = await api.patch(
        "/changepassword", // URL
        passwordReq, // Request body (data)
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization header
          },
        }
      );

      // Return the data
      return response.data;
    } catch (error) {
      // Handle errors
      console.error("Error Change Password:", error);

      // Reject with error message
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to Change Password"
      );
    }
  }
);