import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch all departments with pagination
export const getAllDepartments = createAsyncThunk(
  "department/getAllDepartments",
  async (pageData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken;

      // Validate pageData
      if (!pageData || typeof pageData.pageNum !== "number" || typeof pageData.pageSize !== "number") {
        throw new Error("Invalid pageData provided");
      }

      // Make the API request
      const response = await api.get("/departments", {
        params: {
          pageNumber: pageData.pageNum,
          pageSize: pageData.pageSize,
        },
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

// Add a new department
export const addNewDepartment = createAsyncThunk(
  "department/addDepartment",
  async (department, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken;

      const response = await api.post("/departments", department, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error adding department:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add department"
      );
    }
  }
);

// Update an existing department
export const updateDepartment = createAsyncThunk(
  "department/updateDepartment",
  async (department, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken;

      const response = await api.put("/departments", department, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error updating department:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update department"
      );
    }
  }
);

// Delete a department
export const deleteDepartment = createAsyncThunk(
  "department/deleteDepartment",
  async (departmentNum, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken;

      const response = await api.delete(`/departments/${departmentNum}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error deleting department:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete department"
      );
    }
  }
);

// Filter departments based on search criteria
export const filterDepartment = createAsyncThunk(
  "department/filterDepartment",
  async (department, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken;
console.log(token);
      const response = await api.post("/departments/search", department, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error filtering departments:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to filter departments"
      );
    }
  }
);