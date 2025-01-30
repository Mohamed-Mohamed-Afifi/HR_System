import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DependentTable from "./components/DependentTable";
import { CircularProgress, Alert, Box } from "@mui/material";
import { getAllDependents } from "../../../feathers/Dependents/DependentActions";

export const Dependent = () => {
  const dispatch = useDispatch();
  const { 
    depPaged: allPagedDeps, 
    loading, 
    error 
  } = useSelector((state) => state.dependent);
  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  useEffect(() => {
    dispatch(getAllDependents({
      pageNum: page,
      pageSize: rowsPerPage,
    }));
  }, [dispatch, page, rowsPerPage]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newSize) => {
    setRowsPerPage(newSize);
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, width: '100%' }}>
        <Alert severity="error" variant="filled" sx={{ fontSize: '1rem' }}>
          Error: {error.message || "Failed to load dependents"}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <DependentTable
        data={{
          dependents: allPagedDeps?.dependents || [],
          page_number: page,
          page_size: rowsPerPage,
          totalPages: allPagedDeps?.totalPages || 0,
        }}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </Box>
  );
};