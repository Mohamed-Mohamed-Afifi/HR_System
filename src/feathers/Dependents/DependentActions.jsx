import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch all dependents with pagination
export const getAllDependents = createAsyncThunk(
  "dependent/getAllDependents",
  async (pageData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken;

      if (!pageData || typeof pageData.pageNum !== "number" || typeof pageData.pageSize !== "number") {
        throw new Error("Invalid pageData provided");
      }

      const response = await api.get("/dependents", {
        params: {
            pageNum: pageData.pageNum,
            pageSize: pageData.pageSize,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching dependents:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch dependents"
      );
    }
  }
);

// Add a new dependent
export const addNewDependent = createAsyncThunk(
  "dependent/addDependent",
  async (dependent, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken;

      const response = await api.post("/dependents", dependent, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error adding dependent:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add dependent"
      );
    }
  }
);

// Update an existing dependent
export const updateDependent = createAsyncThunk(
  "dependent/updateDependent",
  async (dependent, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken;

      const response = await api.put("/dependents", dependent, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error updating dependent:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update dependent"
      );
    }
  }
);

// Delete a dependent
export const deleteDependent = createAsyncThunk(
  "dependent/deleteDependent",
  async (dependentId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken;

      const response = await api.delete(`/dependents/${dependentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error deleting dependent:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete dependent"
      );
    }
  }
);

// Filter dependents based on search criteria
export const filterDependent = createAsyncThunk(
  "dependent/filterDependent",
  async (criteria, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken;

      const response = await api.post("/dependents/search", criteria, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error filtering dependents:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to filter dependents"
      );
    }
  }
);