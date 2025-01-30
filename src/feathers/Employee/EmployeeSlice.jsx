import { createSlice } from "@reduxjs/toolkit";
import { filterEmployee, getAllEmployees } from "./EmployeeActions";

const initialState = {
  loading: false,
  errormsg: "",
  err: false,
  empPaged: { employees: [], page_number: 0, page_size: 0 },
};

export const employeeSlice = createSlice({
  name: "employee",
  initialState,
  extraReducers: (builder) => {
    builder
      // Handle getAllEmployees actions
      .addCase(getAllEmployees.pending, (state) => {
        state.loading = true;
        state.errormsg = false;
      })
      .addCase(getAllEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.errormsg = false;
        state.empPaged = action.payload;
      })
      .addCase(getAllEmployees.rejected, (state, action) => {
        state.loading = false;
        state.err = true;
      })
      // Handle filterEmployee actions
      .addCase(filterEmployee.pending, (state) => {
        state.loading = true;
        state.errormsg = false;
      })
      .addCase(filterEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.errormsg = false;
        state.empPaged = action.payload;
      })
      .addCase(filterEmployee.rejected, (state, action) => {
        state.loading = false;
        state.err = true;
      });
  },
});

export default employeeSlice.reducer;
