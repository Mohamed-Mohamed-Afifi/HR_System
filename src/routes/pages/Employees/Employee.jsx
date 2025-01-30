import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { filterEmployee, getAllEmployees } from "../../../../feathers/Employees/EmployeeActions";
import EmployeeTable from "./components/EmployeeTable";
import { CircularProgress, Alert, Box } from "@mui/material";
import { getAllEmployees } from "../../../feathers/Employee/EmployeeActions";

export const Employee = () => {
  const allPagedEmps = useSelector((state) => state.emp.empPaged);
  const loading = useSelector((state) => state.emp.loading);
  const error = useSelector((state) => state.emp.err);

  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, [page, rowsPerPage]);

  const fetchEmployees = () => {
    const pageParams = {
      pageNum: page,
      pageSize: rowsPerPage,
    };
    dispatch(getAllEmployees(pageParams));
  };

  useEffect(() => {
    if (allPagedEmps && allPagedEmps.employees) {
      setEmployees(allPagedEmps.employees);
    }
  }, [allPagedEmps]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleUpdateEmployees = (newEmployee, isEditMode) => {
    if (isEditMode) {
      const updatedEmployees = employees.map((emp) =>
        emp.ssn === newEmployee.ssn ? newEmployee : emp
      );
      setEmployees(updatedEmployees);
    } else {
      setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
    }
  };

  const handleDeleteEmployee = (ssn) => {
    setEmployees((prevEmployees) =>
      prevEmployees.filter((emp) => emp.ssn !== ssn)
    );
  };

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

  if (error) {
    return (
      <Box sx={{ width: "100%", marginTop: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div>
      <EmployeeTable
        data={{
          employees: employees,
          page_number: page,
          page_size: rowsPerPage,
          totalPages: allPagedEmps.totalPages,
        }}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onUpdateEmployees={handleUpdateEmployees}
        onDeleteEmployee={handleDeleteEmployee}
      />
    </div>
  );
};