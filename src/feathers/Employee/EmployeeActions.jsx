import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch all employees with pagination
export const getAllEmployees = createAsyncThunk(
  "employee/getAllEmployees",
  async (pageData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken;

      // Validate pageData
      if (!pageData || typeof pageData.pageNum !== "number" || typeof pageData.pageSize !== "number") {
        throw new Error("Invalid pageData provided");
      }

      // Make the API request
      const response = await api.get("/employees", {
        params: {
            pageNum: pageData.pageNum,
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
      console.error("Error fetching employees:", error);

      // Reject with error message
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch employees"
      );
    }
  }
);

// Add a new employee
export const addNewEmployee = createAsyncThunk(
  "employee/addEmployee",
  async (employee, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken;

      const response = await api.post("/employees", employee, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error adding employee:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add employee"
      );
    }
  }
);

// Update an existing employee
export const updateEmployee = createAsyncThunk(
  "employee/updateEmployee",
  async (employee, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken;

      const response = await api.put("/employees", employee, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error updating employee:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update employee"
      );
    }
  }
);

// Delete an employee
export const deleteEmployee = createAsyncThunk(
  "employee/deleteEmployee",
  async (employeeId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken;

      const response = await api.delete(`/employees/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error deleting employee:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete employee"
      );
    }
  }
);

// Filter employees based on search criteria
export const filterEmployee = createAsyncThunk(
  "employee/filterEmployee",
  async (criteria, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken;

      const response = await api.post("/employees/search", criteria, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error filtering employees:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to filter employees"
      );
    }
  }
);
