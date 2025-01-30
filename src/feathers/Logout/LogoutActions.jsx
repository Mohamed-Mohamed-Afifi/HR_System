import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});
export const logoutHandler= createAsyncThunk(
  "logout/logoutHandler",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken;
        console.log(token)
      // Make the API request
      const response = await api.post("/auth/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Return the data
      return response.data;
    } catch (error) {
      // Handle errors
      console.error("Error fetching departments:", error);

      // Reject with error message
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch departments"
      );
    }
  }
);