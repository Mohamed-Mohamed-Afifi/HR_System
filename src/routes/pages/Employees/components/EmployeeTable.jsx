import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Toolbar,
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
  Tooltip,
  Menu,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  ListItemText,
  Card,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch } from "react-redux";
import { 
  addNewEmployee, 
  deleteEmployee, 
  filterEmployee, 
  updateEmployee 
} from "../../../../feathers/Employee/EmployeeActions";
import Swal from "sweetalert2";

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

  const availableCategories = ["ALL", "ssn", "full_name", "address", "sex", "salary", "department_number"];

  // Search functionality
  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSearchCategories(value);
  };

  const constructSearchArgs = () => {
    const searchArgs = {};
    if (searchQuery) {
      if (searchCategories.includes("ALL")) {
        availableCategories
          .filter(category => category !== "ALL")
          .forEach(category => {
            searchArgs[category] = searchQuery;
          });
      } else {
        searchCategories.forEach(category => {
          searchArgs[category] = searchQuery;
        });
      }
    }
    return searchArgs;
  };

  const handleSearchSubmit = async () => {
    const searchArgs = constructSearchArgs();
    const payload = {
      searchArgs,
      pageNumber: props.data.page_number || 0,
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
        manager_ssn: employee.manager_ssn || "",
        department_number: employee.department_number || ""
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
    
    if (["ssn", "salary", "department_number", "manager_ssn"].includes(name)) {
      if (!/^\d*$/.test(value)) return;
    }

    setNewEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmployee = () => {
    const errors = [];
    if (!newEmployee.ssn) errors.push("SSN is required");
    if (!newEmployee.full_name) errors.push("Full name is required");
    if (!newEmployee.birthdate) errors.push("Birthdate is required");
    if (isNaN(newEmployee.salary)) errors.push("Salary must be a number");
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
        props.onUpdateEmployees();
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
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteEmployee(ssn))
          .then(() => props.onDeleteEmployee(ssn))
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
    <Card elevation={3} sx={{ borderRadius: "16px", padding: "1.5rem", backgroundColor: "#f9f9fb" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: "#388e3c",
            color: "#fff",
            "&:hover": { backgroundColor: "#2c6d31" },
            fontWeight: "bold",
            borderRadius: "12px",
            textTransform: "none",
          }}
          onClick={() => handleOpenModal()}
        >
          Add Employee
        </Button>

        <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, maxWidth: '800px', ml: 2 }}>
          <TextField
            size="small"
            placeholder="Search employees..."
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#388e3c" }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: "25px",
                backgroundColor: "#ffffff",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              }
            }}
            value={searchQuery}
            onChange={handleSearch}
          />
          
          <Button
            variant="outlined"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              color: "#2e7d32",
              fontWeight: "bold",
              borderRadius: "12px",
              textTransform: "none",
              minWidth: '200px'
            }}
          >
            Search Categories
          </Button>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { borderRadius: "12px", mt: 1 } }}
          >
            <FormControl sx={{ width: 320, p: 2 }}>
              <InputLabel>Search Categories</InputLabel>
              <Select
                multiple
                value={searchCategories}
                onChange={handleCategoryChange}
                renderValue={(selected) => selected.join(", ")}
              >
                {availableCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    <Checkbox checked={searchCategories.includes(category)} />
                    <ListItemText primary={category} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Menu>

          <Button
            variant="contained"
            onClick={handleSearchSubmit}
            sx={{
              backgroundColor: "#388e3c",
              color: "#fff",
              "&:hover": { backgroundColor: "#2c6d31" },
              fontWeight: "bold",
              borderRadius: "12px",
              textTransform: "none",
            }}
          >
            Search
          </Button>
        </Box>
      </Toolbar>

      <TableContainer component={Paper} sx={{ borderRadius: "12px", mt: 2, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#388e3c" }}>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < props.data.employees.length}
                  checked={selected.length === props.data.employees.length}
                  sx={{ color: "#fff" }}
                />
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>SSN</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Full Name</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Birthdate</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Address</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Gender</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Salary</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Department</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.employees.map((employee) => (
              <TableRow key={employee.ssn} hover sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(employee.ssn)}
                    onChange={() => setSelected(prev => 
                      prev.includes(employee.ssn) 
                        ? prev.filter(id => id !== employee.ssn) 
                        : [...prev, employee.ssn]
                    )}
                    sx={{ color: "#388e3c" }}
                  />
                </TableCell>
                <TableCell>{employee.ssn}</TableCell>
                <TableCell>{employee.full_name}</TableCell>
                <TableCell>{new Date(employee.birthdate).toLocaleDateString()}</TableCell>
                <TableCell>{employee.address}</TableCell>
                <TableCell>{employee.sex}</TableCell>
                <TableCell>${employee.salary?.toLocaleString()}</TableCell>
                <TableCell>{employee.department_number || 'N/A'}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: "8px" }}>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOpenModal(employee)} sx={{ color: '#388e3c' }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(employee.ssn)} sx={{ color: '#d32f2f' }}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={props.data.totalPages * props.data.page_size}
        rowsPerPage={props.data.page_size}
        page={props.data.page_number}
        onPageChange={(e, newPage) => props.onPageChange(newPage)}
        onRowsPerPageChange={(e) => props.onRowsPerPageChange(parseInt(e.target.value, 10))}
        sx={{ mt: 2 }}
      />

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, textAlign: 'center' }}>
          {isEditMode ? 'Edit Employee' : 'New Employee'}
        </DialogTitle>
        <DialogContent sx={{ pt: '1rem!important' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SSN"
                name="ssn"
                value={newEmployee.ssn}
                onChange={handleChange}
                margin="dense"
                inputProps={{ inputMode: 'numeric' }}
                disabled={isEditMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="full_name"
                value={newEmployee.full_name}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Birthdate"
                type="date"
                name="birthdate"
                InputLabelProps={{ shrink: true }}
                value={newEmployee.birthdate}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={newEmployee.address}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Salary"
                name="salary"
                value={newEmployee.salary}
                onChange={handleChange}
                margin="dense"
                inputProps={{ inputMode: 'numeric' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Manager SSN (Optional)"
                name="manager_ssn"
                value={newEmployee.manager_ssn}
                onChange={handleChange}
                margin="dense"
                inputProps={{ inputMode: 'numeric' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department Number (Optional)"
                name="department_number"
                value={newEmployee.department_number}
                onChange={handleChange}
                margin="dense"
                inputProps={{ inputMode: 'numeric' }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default EmployeeTable;