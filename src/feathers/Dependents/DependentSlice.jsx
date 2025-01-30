import { createSlice } from "@reduxjs/toolkit";
import { filterDependent, getAllDependents } from "./DependentActions"; // Update import

const initialState = {
  loading: false,
  errormsg: "",
  err: false,
  depPaged: { dependents: [], page_number: 0, page_size: 0 }, // Changed empPaged to depPaged
};

export const dependentSlice = createSlice({
  name: "dependent", // Changed slice name
  initialState,
  extraReducers: (builder) => {
    builder
      // Handle getAllDependents actions
      .addCase(getAllDependents.pending, (state) => {
        state.loading = true;
        state.errormsg = false;
      })
      .addCase(getAllDependents.fulfilled, (state, action) => {
        state.loading = false;
        state.errormsg = false;
        state.depPaged = action.payload; // Updated to depPaged
      })
      .addCase(getAllDependents.rejected, (state, action) => {
        state.loading = false;
        state.err = true;
      })
      // Handle filterDependent actions
      .addCase(filterDependent.pending, (state) => {
        state.loading = true;
        state.errormsg = false;
      })
      .addCase(filterDependent.fulfilled, (state, action) => {
        state.loading = false;
        state.errormsg = false;
        state.depPaged = action.payload; // Updated to depPaged
      })
      .addCase(filterDependent.rejected, (state, action) => {
        state.loading = false;
        state.err = true;
      });
  },
});

export default dependentSlice.reducer;