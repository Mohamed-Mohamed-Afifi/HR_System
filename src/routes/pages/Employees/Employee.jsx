import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllEmployees } from "../../../feathers/Employee/EmployeeActions";
import EmployeeTable from "./components/EmployeeTable";
import { CircularProgress, Alert, Box } from "@mui/material";

export const Employee = () => {
  const dispatch = useDispatch();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { empPaged: pagedData, loading, error } = useSelector((state) => state.emp);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const pageParams = {
      pageNum: page,
      pageSize: rowsPerPage,
    };
    dispatch(getAllEmployees(pageParams));
  }, [page, rowsPerPage, refreshTrigger, dispatch]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page when page size changes
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: 300 
      }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          Error loading employees: {error}
        </Alert>
      </Box>
    );
  }

  return (
    // <Box sx={{ 
    //   maxWidth: 1440, 
    //   mx: 'auto', 
    //   p: { xs: 2, md: 4 },
    //   backgroundColor: 'background.paper'
    // }}>
      <EmployeeTable
        data={{
          employees: pagedData?.employees || [],
          page_number: page,
          page_size: rowsPerPage,
          totalPages: pagedData?.totalPages || 0,
        }}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onRefresh={handleRefresh}
      />
    // </Box>
  );
};