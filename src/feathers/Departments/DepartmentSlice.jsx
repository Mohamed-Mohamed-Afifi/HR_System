import { createSlice } from "@reduxjs/toolkit";
import { filterDepartment, getAllDepartments } from "./DepartmentActions";
const initialState={loading:false,errormsg:"",err:false,deptPaged:{"departments":[],page_number:0,page_size:0}}
export const departSlice=createSlice({
    name:"department",
    initialState,
    extraReducers:(builder)=>{
        builder
        .addCase(getAllDepartments.pending, (state) => {
          state.loading = true;
          state.errormsg = false;
        })
        .addCase(getAllDepartments.fulfilled, (state, action) => {
          state.loading = false;
          state.errormsg = false;
          state.deptPaged = action.payload;
        })
        .addCase(getAllDepartments.rejected, (state,action) => {
            state.loading = false;
            state.err=true;
          })
        .addCase(filterDepartment.pending,(state)=>{
          state.loading = true;
          state.errormsg = false;
        })
        .addCase(filterDepartment.fulfilled, (state, action) => {
          state.loading = false;
          state.errormsg = false;
          state.deptPaged = action.payload;
        })
        .addCase(filterDepartment.rejected, (state,action) => {
          state.loading = false;
          state.err=true;
        })
        },
        
})
export default departSlice.reducer;