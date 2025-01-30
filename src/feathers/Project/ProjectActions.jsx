import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch all projects with pagination
export const getAllProjects = createAsyncThunk(
  "project/getAllProjects",
  async (pageData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken;

      // Validate pageData
      if (!pageData || typeof pageData.pageNum !== "number" || typeof pageData.pageSize !== "number") {
        throw new Error("Invalid pageData provided");
      }

      // Make the API request
      const response = await api.get("/projects", {
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
      console.error("Error fetching projects:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch projects"
      );
    }
  }
);

// Add a new project
export const addNewProject = createAsyncThunk(
  "project/addProject",
  async (project, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken;
      const response = await api.post("/projects", project, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error adding project:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add project"
      );
    }
  }
);

// Update an existing project
export const updateProject = createAsyncThunk(
  "project/updateProject",
  async (project, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken;
      const response = await api.put("/projects", project, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating project:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update project"
      );
    }
  }
);

// Delete a project
export const deleteProject = createAsyncThunk(
  "project/deleteProject",
  async (projectId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.userToken;
      const response = await api.delete(`/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting project:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete project"
      );
    }
  }
);

// Filter projects based on search criteria
export const filterProject = createAsyncThunk(
  "project/filterProject",
  async (criteria, thunkAPI) => {
    console.log(criteria, "criteria from redux"); // Debugging
    try {
      const token = thunkAPI.getState().auth.userToken;
      const response = await api.post("/projects/search", criteria, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error filtering projects:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to filter projects"
      );
    }
  }
);