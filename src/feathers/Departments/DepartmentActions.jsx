import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllDepartments=createAsyncThunk("department/getAllDepartments",async(pageData,thunkAPI)=>{
    // const token = thunkAPI.getState().auth.userToken
    console.log(pageData)
    // let data = JSON.stringify({
    //   "pageNum": 1,
    //   "pageSize": 5
    // });
    let allDepartments = await axios({
      method: 'GET',
      maxBodyLength: Infinity,
    url: `http://localhost:8080/departments?pageNumber=${pageData.pageNum}&pageSize=${pageData.pageSize}`,
    headers: { 
      'Content-Type': 'application/json'
    },
    // data : data
  });
  // console.log(allDepartments.data);
  return allDepartments.data
})
export const addNewDepartment=createAsyncThunk("department/addDepartment",async(department)=>{
  // const token = thunkAPI.getState().auth.userToken
  console.log(department,"dasd")
let allDepartments = await axios({
  method: 'post',
  maxBodyLength: Infinity,
  url: `http://localhost:8080/departments`,
  headers: { 
    'Authorization': 'MKMMMMM', 
    'Content-Type': 'application/json'
  },
  data:department
});
console.log(allDepartments)
return allDepartments.data
})
export const updateDepartment=createAsyncThunk("department/updateDepartment",async(department)=>{
  // const token = thunkAPI.getState().auth.userToken
let allDepartments = await axios({
  method: 'put',
  maxBodyLength: Infinity,
  url: `http://localhost:8080/departments`,
  // headers: {
  //   'Authorization': `Bearer ${token}`
  // }
  data:department
});
console.log(allDepartments)
return allDepartments.data
})
export const deleteDepartment=createAsyncThunk("department/deleteDepartment",async(departmentNum)=>{
  // const token = thunkAPI.getState().auth.userToken
let allDepartments = await axios({
  method: 'delete',
  maxBodyLength: Infinity,
  url: `http://localhost:8080/departments/${departmentNum}`,
  // headers: {
  //   'Authorization': `Bearer ${token}`
  // }
  // data:thunkAPI.dept
});
console.log(allDepartments)
return allDepartments.data
})

export const filterDepartment=createAsyncThunk("department/filterDepartment",async(department)=>{
  // const token = thunkAPI.getState().auth.userToken
let allDepartments = await axios({
  method: 'POST',
  maxBodyLength: Infinity,
  url: `http://localhost:8080/departments/search`,
  // headers: {
  //   'Authorization': `Bearer ${token}`
  // }
  data:department
});
console.log(allDepartments.data)
return allDepartments.data
})