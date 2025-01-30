import { createSlice } from "@reduxjs/toolkit";
import { filterProject, getAllProjects } from "./ProjectActions"; // Updated import

const initialState = {
  loading: false,
  errormsg: "",
  err: false,
  projPaged: { projects: [], page_number: 0, page_size: 0 }, // Changed to projects
};

export const projectSlice = createSlice({ // Renamed to projectSlice
  name: "project", // Changed slice name
  initialState,
  extraReducers: (builder) => {
    builder
      // Handle getAllProjects actions
      .addCase(getAllProjects.pending, (state) => {
        state.loading = true;
        state.errormsg = false;
      })
      .addCase(getAllProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.errormsg = false;
        state.projPaged = action.payload; // Changed to projPaged
        console.log(state.projPaged); // Added console.log
      })
      .addCase(getAllProjects.rejected, (state, action) => {
        state.loading = false;
        state.err = true;
      })
      // Handle filterProject actions
      .addCase(filterProject.pending, (state) => {
        state.loading = true;
        state.errormsg = false;
      })
      .addCase(filterProject.fulfilled, (state, action) => {
        state.loading = false;
        state.errormsg = false;
        state.projPaged = action.payload; // Changed to projPaged
      })
      .addCase(filterProject.rejected, (state, action) => {
        state.loading = false;
        state.err = true;
      });
  },
});

export default projectSlice.reducer;