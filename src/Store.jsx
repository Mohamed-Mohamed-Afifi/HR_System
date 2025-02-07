import { configureStore } from "@reduxjs/toolkit";
import departSlice from "../src/feathers/Departments/DepartmentSlice"
import authReducer from "../src/feathers/Auth/AuthSlice"
import logoutSlice from "../src/feathers/Logout/LogoutSlice"
import changePasswordSlice from "../src/feathers/ChangePassword/ChangePassSlice"
import employeeSlice  from "./feathers/Employee/EmployeeSlice";
import projectSlice from "./feathers/Project/ProjectSlice";
import dependentSlice from "./feathers/Dependents/DependentSlice"; 
import userSlice from "./feathers/Users/UserSlice";
export const store=configureStore({
    reducer:{
        dept:departSlice,
        auth:authReducer,
        logout:logoutSlice,
        changePassword:changePasswordSlice,
        emp:employeeSlice,
        project:projectSlice,
        dependent:dependentSlice,
        users:userSlice
    }
})