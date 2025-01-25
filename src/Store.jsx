import { configureStore } from "@reduxjs/toolkit";
import departSlice from "../src/feathers/Departments/DepartmentSlice"
export const store=configureStore({
    reducer:{
        dept:departSlice
    }
})