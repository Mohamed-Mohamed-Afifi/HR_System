import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  InputAdornment,
  Box,
  Button,
  TablePagination,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  ListItemText,
  Card,
} from "@mui/material";
import { Delete, Edit, Search, Add } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { 
  addNewEmployee, 
  deleteEmployee, 
  filterEmployee, 
  updateEmployee 
} from "../../../../feathers/Employee/EmployeeActions";
import Swal from "sweetalert2";
import { format, parseISO } from 'date-fns';

const EmployeeTable = (props) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategories, setSearchCategories] = useState(["ALL"]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    ssn: "",
    full_name: "",
    birthdate: "",
    address: "",
    sex: "M",
    salary: "",
    manager_ssn: "",
    department_number: "",
  });

  const availableCategories = ["ssn", "full_name", "address", "sex", "salary", "department_number"];

  // Formatting functions
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      return format(parseISO(dateString), 'MM/dd/yyyy');
    } catch {
      return "—";
    }
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }) || "—";
  };

  // Search functionality
  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleCategoryChange = (event) => {
    setSearchCategories(event.target.value);
  };

  const constructSearchArgs = () => {
    const searchArgs = {};
    if (searchQuery) {
      const categories = searchCategories.includes("ALL") 
        ? availableCategories 
        : searchCategories;
      
      categories.forEach(category => {
        searchArgs[category] = searchQuery;
      });
    }
    return searchArgs;
  };

  const handleSearchSubmit = async () => {
    const payload = {
      searchArgs: constructSearchArgs(),
      pageNumber: 0,
      pageSize: props.data.page_size || 10,
    };

    try {
      await dispatch(filterEmployee(payload));
      props.onPageChange(0);
    } catch (error) {
      Swal.fire("Error", "Search failed", "error");
    }
  };

  // Employee CRUD operations
  const handleOpenModal = (employee = null) => {
    if (employee) {
      setNewEmployee({
        ...employee,
        birthdate: employee.birthdate?.split('T')[0] || "",
      });
      setIsEditMode(true);
    } else {
      setNewEmployee({
        ssn: "",
        full_name: "",
        birthdate: "",
        address: "",
        sex: "M",
        salary: "",
        manager_ssn: "",
        department_number: ""
      });
      setIsEditMode(false);
    }
    setOpenModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["ssn", "salary", "department_number", "manager_ssn"];
    
    if (numericFields.includes(name) && !/^\d*$/.test(value)) return;

    setNewEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmployee = () => {
    const errors = [];
    if (!/^\d{9}$/.test(newEmployee.ssn)) errors.push("SSN must be 9 digits");
    if (!newEmployee.full_name.trim()) errors.push("Full name is required");
    if (!newEmployee.birthdate) errors.push("Valid birthdate is required");
    if (!/^\d+$/.test(newEmployee.salary)) errors.push("Valid salary is required");
    return errors;
  };

  const handleSubmit = () => {
    const errors = validateEmployee();
    if (errors.length > 0) {
      Swal.fire("Validation Error", errors.join("\n"), "error");
      return;
    }

    const employeeData = {
      ...newEmployee,
      ssn: parseInt(newEmployee.ssn, 10),
      salary: parseInt(newEmployee.salary, 10),
      department_number: newEmployee.department_number ? 
        parseInt(newEmployee.department_number, 10) : null,
      manager_ssn: newEmployee.manager_ssn ? 
        parseInt(newEmployee.manager_ssn, 10) : null,
      birthdate: new Date(newEmployee.birthdate).toISOString()
    };

    const action = isEditMode ? updateEmployee : addNewEmployee;
    dispatch(action(employeeData))
      .then(() => {
        Swal.fire("Success", `Employee ${isEditMode ? 'updated' : 'added'}!`, "success");
        handleCloseModal();
        props.onRefresh();
      })
      .catch(error => {
        Swal.fire("Error", error.message || "Operation failed", "error");
      });
  };

  const handleDelete = (ssn) => {
    Swal.fire({
      title: "Delete Employee?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteEmployee(ssn))
          .then(() => props.onRefresh())
          .catch(error => Swal.fire("Error", error.message, "error"));
      }
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewEmployee({
      ssn: "",
      full_name: "",
      birthdate: "",
      address: "",
      sex: "M",
      salary: "",
      manager_ssn: "",
      department_number: ""
    });
    setIsEditMode(false);
  };

  return (
    <Card elevation={0} sx={{
      borderRadius: "12px",
      p: 3,
      backgroundColor: "white",
      boxShadow: "0px 8px 24px -12px rgba(0, 0, 0, 0.1)",
      overflowX: 'auto'
    }}>
      {/* Toolbar */}
      <Box sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 3,
        flexWrap: 'wrap',
        '& > *': { my: 0.5 }
      }}>
        <Button
          variant="outlined"
          startIcon={<Add />}
          sx={{
            // backgroundColor: "#4CAF50",
            color: "#4CAF50",
            "&:hover": { backgroundColor: "#ccc" },
            borderRadius: "8px",
            borderColor:'#4CAF50',
            px: 3,
            py: 1,
            fontWeight: 600,
            textTransform: 'none'
          }}
          onClick={() => handleOpenModal()}
        >
          Add Employee
        </Button>

        <TextField
          size="small"
          placeholder="Search employees..."
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "action.active" }} />
              </InputAdornment>
            ),
            sx: {
              borderRadius: "8px",
              backgroundColor: "background.paper",
              "& .MuiOutlinedInput-input": { py: '8px' }
            },
          }}
          value={searchQuery}
          onChange={handleSearch}
          sx={{ maxWidth: "400px", flex: 1 }}
        />

        <Button
          variant="outlined"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            color: "text.secondary",
            borderColor: "divider",
            borderRadius: "8px",
            textTransform: "none",
            px: 3,
            fontWeight: 500
          }}
        >
          Search Categories
        </Button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              borderRadius: "8px",
              boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
              minWidth: "250px",
            },
          }}
        >
          <FormControl sx={{ width: "100%", p: 2 }}>
            <InputLabel>Categories</InputLabel>
            <Select
              multiple
              value={searchCategories}
              onChange={handleCategoryChange}
              renderValue={(selected) => selected.join(", ")}
            >
              {["ALL", ...availableCategories].map((category) => (
                <MenuItem key={category} value={category} sx={{ py: 0.5 }}>
                  <Checkbox
                    checked={searchCategories.includes(category)}
                    sx={{ color: "text.secondary", "&.Mui-checked": { color: "#4CAF50" } }}
                  />
                  <ListItemText primary={category} sx={{ typography: 'body2' }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Menu>

        <Button
          variant="outlined"
          onClick={handleSearchSubmit}
          sx={{
            // backgroundColor: "#4CAF50",
            color: "#4CAF50",
            "&:hover": { backgroundColor: "#ccc" },
            borderRadius: "8px",
            borderColor:'#4CAF50',
            px: 3,
            py: 1,
            fontWeight: 600,
            textTransform: 'none'
          }}
        >
          Search
        </Button>
      </Box>

      {/* Table */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          minWidth: 1200
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ 
                backgroundColor: '#FAFAFA', 
                borderBottom: '2px solid',
                borderColor: 'divider'
              }}>
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < props.data.employees.length}
                  checked={selected.length === props.data.employees.length}
                  onChange={(e) => setSelected(e.target.checked ? props.data.employees.map(e => e.ssn) : [])}
                  color="primary"
                />
              </TableCell>
              {['SSN', 'Full Name', 'Birthdate', 'Address', 'Gender', 'Salary','Supervisor_Ssn', 'DepartmentNumber','DepartmentName', 'Actions'].map((header) => (
                <TableCell 
                  key={header}
                  sx={{
                    backgroundColor: '#FAFAFA',
                    borderBottom: '2px solid',
                    borderColor: 'divider',
                    py: 2,
                    fontWeight: 600,
                    color: 'text.primary',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {props.data.employees.map((employee) => (
              <TableRow 
                key={employee.ssn} 
                hover 
                sx={{ 
                  '&:nth-of-type(even)': { backgroundColor: '#FAFAFA' },
                  '&:hover': { backgroundColor: '#F5F5F5' }
                }}
              >
                <TableCell padding="checkbox" sx={{ py: 1.5 }}>
                  <Checkbox
                    checked={selected.includes(employee.ssn)}
                    onChange={() => setSelected(prev => 
                      prev.includes(employee.ssn) 
                        ? prev.filter(id => id !== employee.ssn) 
                        : [...prev, employee.ssn]
                    )}
                    color="primary"
                  />
                </TableCell>
                <TableCell sx={{ py: 1.5, fontWeight: 500 }}>{employee.ssn}</TableCell>
                <TableCell sx={{ py: 1.5 }}>{employee.full_name}</TableCell>
                <TableCell sx={{ py: 1.5 }}>{formatDate(employee.birthdate)}</TableCell>
                <TableCell sx={{ py: 1.5, color: 'text.secondary' }}>{employee.address || "—"}</TableCell>
                <TableCell sx={{ py: 1.5 }}>{employee.sex === 'M' ? 'Male' : 'Female'}</TableCell>
                <TableCell sx={{ py: 1.5 }}>{formatCurrency(employee.salary)}</TableCell>
                <TableCell sx={{ py: 1.5 }}>{employee.manager_ssn}</TableCell>
                <TableCell sx={{ py: 1.5 }}>{employee.department_number || "—"}</TableCell>
                <TableCell sx={{ py: 1.5 }}>{employee.department_name || "—"}</TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton 
                      onClick={() => handleOpenModal(employee)}
                      sx={{ 
                        color: '#4CAF50',
                        '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.1)' }
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(employee.ssn)}
                      sx={{ 
                        color: 'rgb(189 25 25)',
                        '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={props.data.totalPages * props.data.page_size}
        rowsPerPage={props.data.page_size}
        page={props.data.page_number}
        onPageChange={(e, newPage) => props.onPageChange(newPage)}
        onRowsPerPageChange={(e) => props.onRowsPerPageChange(parseInt(e.target.value, 10))}
        sx={{
          mt: 2,
          '& .MuiTablePagination-toolbar': { px: 0 },
          '& .MuiTablePagination-actions': { ml: 2 }
        }}
      />

      {/* Employee Form Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            width: "100%",
            maxWidth: "600px",
            boxShadow: "0px 12px 24px -12px rgba(0, 0, 0, 0.1)",
            p: 3
          }
        }}
      >
        <DialogTitle sx={{
          typography: 'h6',
          px: 0,
          pt: 0,
          pb: 2,
          fontWeight: 600
        }}>
          {isEditMode ? "Edit Employee" : "New Employee"}
        </DialogTitle>

        <DialogContent sx={{ px: 0, py: 1 }}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              fullWidth
              label="SSN"
              name="ssn"
              value={newEmployee.ssn}
              onChange={handleChange}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              disabled={isEditMode}
            />

            <TextField
              fullWidth
              label="Full Name"
              name="full_name"
              value={newEmployee.full_name}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Birthdate"
              type="date"
              name="birthdate"
              InputLabelProps={{ shrink: true }}
              value={newEmployee.birthdate}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Address"
              name="address"
              value={newEmployee.address}
              onChange={handleChange}
            />

            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                name="sex"
                value={newEmployee.sex}
                onChange={handleChange}
                label="Gender"
              >
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Salary"
              name="salary"
              value={newEmployee.salary}
              onChange={handleChange}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />

            <TextField
              fullWidth
              label="Manager SSN (Optional)"
              name="manager_ssn"
              value={newEmployee.manager_ssn}
              onChange={handleChange}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />

            <TextField
              fullWidth
              label="Department Number (Optional)"
              name="department_number"
              value={newEmployee.department_number}
              onChange={handleChange}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 0, pt: 2 }}>
          <Button
            onClick={handleCloseModal}
            sx={{
              color: 'text.secondary',
              px: 3,
              borderRadius: "6px",
              "&:hover": { backgroundColor: "action.hover" }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              px: 3,
              borderRadius: "6px",
              "&:hover": { backgroundColor: "#43A047" }
            }}
          >
            {isEditMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default EmployeeTable;