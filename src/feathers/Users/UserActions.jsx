import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const editSingleUser = createAsyncThunk(
    "user/editUser",
    async (userAuth, thunkAPI) => {
        console.log(userAuth)
        const token = thunkAPI.getState().auth.userToken;
      try {
        const response = await axios({
          method: "put",
          url: "http://localhost:8080/users/edit",
          headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${token}`,
           },
          data: userAuth,
        });
        return response.data;
      } catch (error) {
        const message = error.response?.data || error.message;
        console.log(message);
        return thunkAPI.rejectWithValue({ message });
      }
    }
  );