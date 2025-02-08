import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterDepartment, getAllDepartments } from "../../../feathers/Departments/DepartmentActions";
import MultiSelectTable from "../../components/table/MultiSelectTable";
import { CircularProgress, Alert, Box } from "@mui/material";

export const Department = () => {
  const allPagedDepts = useSelector((state) => state.dept.deptPaged);
  const loading = useSelector((state) => state.dept.loading);
  const error = useSelector((state) => state.dept.err);

  const dispatch = useDispatch();
  const [page, setPage] = useState(0); // Backend pages are usually zero-indexed
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [departments, setDepartments] = useState([]); // Initialize state with an empty array
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  useEffect(() => {
    fetchDepartments();
  }, [page, rowsPerPage]); // Fetch departments whenever page or rows per page changes

  const fetchDepartments = () => {
    const pageParams = {
      pageNum: page,
      pageSize: rowsPerPage,
    };
    dispatch(getAllDepartments(pageParams));
  };
  useEffect(() => {
    fetchDepartments();
  }, [page, rowsPerPage, refreshTrigger]); // Add refreshTrigger as dependency
  useEffect(() => {
    if (allPagedDepts && allPagedDepts.departments) {
      setDepartments(allPagedDepts.departments); // Update departments state with fetched data
    }
  }, [allPagedDepts]); // Update when allPagedDepts changes
  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to the first page when rows per page changes
  };

  // Function to update departments after adding or editing
  const handleUpdateDepartments = (newDepartment, isEditMode) => {
    if (isEditMode) {
      // Update existing department
      const updatedDepartments = departments.map((dept) =>
        dept.dnum === newDepartment.dnum ? newDepartment : dept
      );
      setDepartments(updatedDepartments);
    } else {
      // Add new department
      setDepartments((prevDepartments) => [...prevDepartments, newDepartment]);
    }
  };

  // Function to handle department deletion
  const handleDeleteDepartment = (dnum) => {
    // Remove the deleted department from the state
    setDepartments((prevDepartments) =>
      prevDepartments.filter((dept) => dept.dnum !== dnum)
    );
  };

  // If loading, display a spinner
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If there's an error, display an alert message
  if (error) {
    return (
      <Box sx={{ width: "100%", marginTop: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div>
      <MultiSelectTable
        data={{
          departments: departments, // Use the local department state
          page_number: page,
          page_size: rowsPerPage,
          totalPages: allPagedDepts.totalPages,
        }}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onUpdateDepartments={handleUpdateDepartments} // Pass the update function
        onDeleteDepartment={handleDeleteDepartment} // Pass the delete function
        onRefresh={handleRefresh}
      />
    </div>
  );
};