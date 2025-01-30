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
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch } from "react-redux";
import { addNewDepartment, deleteDepartment, filterDepartment, updateDepartment } from "../../../feathers/Departments/DepartmentActions";
import Swal from "sweetalert2";

const MultiSelectTable = (props) => {
  const dispatch = useDispatch();

  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategories, setSearchCategories] = useState(["ALL"]); // Default search by "ALL"
  const [anchorEl, setAnchorEl] = useState(null); // To handle dropdown menu anchor
  const [open, setOpen] = useState(false); // To handle dropdown visibility
  const [openModal, setOpenModal] = useState(false); // Controls modal visibility
  const [isEditMode, setIsEditMode] = useState(false); // To distinguish between add and edit modes
  const [newDepartment, setNewDepartment] = useState({
    dnum: "",
    dname: "",
    mgsStartDate: "",
    supervisorSsn: "",
  });

  
  const handleOpenDropdown = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };
  
  const handleCloseDropdown = () => {
    setAnchorEl(null);
    setOpen(false);
  };
  
  const availableCategories = ["ALL", "dnum", "dname", "supervisorSsn", "employeeName", "projectName", "supervisorName"];
  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSearchCategories(value);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const constructSearchArgs = () => {
    const searchArgs = {};
    if (searchQuery) {
      if (searchCategories.includes("ALL")) {
        // If "ALL" is selected, include all categories except "ALL"
        availableCategories
          .filter((category) => category !== "ALL")
          .forEach((category) => {
            searchArgs[category] = searchQuery;
          });
      } else {
        // Include only the selected categories
        searchCategories.forEach((category) => {
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
      pageNumber: props.data.page_number || 1, // Use current page number from props
      pageSize: props.data.page_size || 10, // Use current page size from props
    };

    try {
      // Dispatch the filter action and wait for the response
      const response = await dispatch(filterDepartment(payload));
      console.log("Search Response:", response); // Log the response for debugging

      // Call the onSearch function (if provided) to update the parent component's state
      if (typeof props.onSearch === "function") {
        props.onSearch(payload); // Pass the payload to the parent component
      }
    } catch (error) {
      console.error("Search Error:", error);
      Swal.fire({
        icon: "error",
        title: "Search Failed",
        text: "An error occurred while performing the search.",
      });
    }
  };

  const handleSelectAll = (event) => {
    setSelected(event.target.checked ? props.data.departments.map((row) => row.dnum) : []);
  };

  const handleSelect = (id) => {
    const isSelected = selected.includes(id);
    setSelected((prevSelected) =>
      isSelected ? prevSelected.filter((item) => item !== id) : [...prevSelected, id]
    );
  };

  const handleOpenModal = (department = null) => {
    if (department) {
      setNewDepartment({
        dnum: department.dnum,
        dname: department.dname,
        mgsStartDate: department.mgsStartDate,
        supervisorSsn: department.supervisorSsn,
      });
      setIsEditMode(true);
    } else {
      setNewDepartment({
        dnum: "",
        dname: "",
        mgsStartDate: "",
        supervisorSsn: "",
      });
      setIsEditMode(false);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewDepartment({ dnum: "", dname: "", mgsStartDate: "", supervisorSsn: "" });
    setIsEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restrict dnum and supervisorSsn to numeric values
    if (name === "dnum" || name === "supervisorSsn") {
      if (!/^\d*$/.test(value)) return; // Only allow digits
    }

    setNewDepartment((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Convert dnum and supervisorSsn to integers
    const departmentData = {
      ...newDepartment,
      dnum: parseInt(newDepartment.dnum, 10),
      supervisorSsn: parseInt(newDepartment.supervisorSsn, 10),
    };

    // Validate that dnum and supervisorSsn are valid numbers
    if (isNaN(departmentData.dnum) || isNaN(departmentData.supervisorSsn)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Department Number and Supervisor SSN must be valid numbers.",
        confirmButtonText: "OK",
      });
      return;
    }

    if (isEditMode) {
      dispatch(updateDepartment(departmentData))
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Department Updated!",
            text: "The department has been successfully updated.",
            confirmButtonText: "OK",
          });
          handleCloseModal();

          // Call the onUpdateDepartments function to update the parent component's state
          if (typeof props.onUpdateDepartments === "function") {
            props.onUpdateDepartments(departmentData, true); // Pass true for edit mode
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Failed to update department. Error: ${error.message}`,
            confirmButtonText: "Try Again",
          });
        });
    } else {
      dispatch(addNewDepartment(departmentData))
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Department Added!",
            text: "The department has been successfully added.",
            confirmButtonText: "OK",
          });
          handleCloseModal();

          // Call the onUpdateDepartments function to update the parent component's state
          if (typeof props.onUpdateDepartments === "function") {
            props.onUpdateDepartments(departmentData, false); // Pass false for add mode
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `Failed to add department. Error: ${error.message}`,
            confirmButtonText: "Try Again",
          });
        });
    }
  };

  const filteredRows = props.data.departments.filter((row) =>
    Object.entries(constructSearchArgs()).every(([key, value]) =>
      String(row[key]).toLowerCase().includes(value.toLowerCase())
    )
  );
  const handleDelete = (dnum) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Dispatch the delete department action
        dispatch(deleteDepartment(dnum))
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "The department has been deleted.",
              confirmButtonText: "OK",
            });
  
            // Call the onDeleteDepartment function to update the parent component's state
            if (typeof props.onDeleteDepartment === "function") {
              props.onDeleteDepartment(dnum);
            }
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `Failed to delete department. Error: ${error.message}`,
              confirmButtonText: "Try Again",
            });
          });
      }
    });
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
          Add Department
        </Button>

        <TextField
  size="small"
  placeholder="Search..."
  variant="outlined"
  fullWidth
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon sx={{ color: "#388e3c" }} /> {/* Modern green color */}
      </InputAdornment>
    ),
    sx: {
      borderRadius: "25px", // Rounded corners
      backgroundColor: "#ffffff", // White background
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow
      transition: "box-shadow 0.3s ease", // Smooth transition
      "&:hover": {
        boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.15)", // Hover effect
      },
      "&.Mui-focused": {
        boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.15)", // Focus effect
      },
    },
  }}
  InputLabelProps={{
    shrink: true, // Floating label
  }}
  value={searchQuery}
  onChange={handleSearch}
  sx={{
    maxWidth: "400px", // Limit width for better aesthetics
    "& .MuiOutlinedInput-root": {
      borderRadius: "25px", // Rounded corners
    },
  }}
/>

 {/* Search Category Dropdown */}
<Button
  variant="outlined"
  onClick={handleOpenDropdown}
  sx={{
    color: "#2e7d32",
    fontWeight: "bold",
    borderRadius: "12px",
    textTransform: "none",
    padding: "10px 20px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  }}
>
  Select Search Categories
</Button>

{/* Dropdown Menu */}
<Menu
  anchorEl={anchorEl}
  open={open}
  onClose={handleCloseDropdown}
  PaperProps={{
    sx: {
      borderRadius: "12px",
      marginTop: "8px",
      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
      minWidth: "250px",
    },
  }}
>
  <FormControl sx={{ width: "100%", padding: "1rem" }}>
    <InputLabel sx={{ fontWeight: "bold", color: "#388e3c" }}>Categories</InputLabel>
    <Select
      multiple
      value={searchCategories}
      onChange={handleCategoryChange}
      renderValue={(selected) => selected.join(", ")}
      sx={{
        borderRadius: "8px",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#388e3c",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#2e7d32",
        },
      }}
    >
      {availableCategories.map((category) => (
        <MenuItem key={category} value={category} sx={{ padding: "8px 16px" }}>
          <Checkbox
            checked={searchCategories.indexOf(category) > -1}
            sx={{ color: "#388e3c", "&.Mui-checked": { color: "#2e7d32" } }}
          />
          <ListItemText primary={category} sx={{ color: "#333" }} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Menu>

        {/* Search Button */}
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
      </Toolbar>

      <TableContainer component={Paper} sx={{ borderRadius: "12px", mt: 2, boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#388e3c" }}>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < props.data.departments.length}
                  checked={selected.length === props.data.departments.length}
                  onChange={handleSelectAll}
                  sx={{ color: "#fff" }}
                />
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Department Number</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Department Name</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Supervisor SSN</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow key={row.dnum} hover sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(row.dnum)}
                    onChange={() => handleSelect(row.dnum)}
                    sx={{ color: "#388e3c" }}
                  />
                </TableCell>
                <TableCell>{row.dnum}</TableCell>
                <TableCell>{row.dname || "No Name"}</TableCell>
                <TableCell>{row.supervisorSsn || "No Supervisor"}</TableCell>
                <TableCell>
                <Box sx={{ display: "flex", gap: "8px" }}>
  <Tooltip title="Edit">
    <IconButton onClick={() => handleOpenModal(row)} sx={{ color: '#388e3c' }}>
      <EditIcon sx={{ color: '#388e3c' }} />
    </IconButton>
  </Tooltip>
  <Tooltip title="Delete">
    <IconButton onClick={() => handleDelete(row.dnum)} sx={{ color: '#d32f2f' }}>
      <DeleteIcon sx={{ color: '#d32f2f' }} />
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
      count={props.data.totalPages * (props.data.page_size || 10)} // Fallback to 10 if page_size is undefined
      rowsPerPage={props.data.page_size || 10} // Fallback to 10 if page_size is undefined
      page={props.data.page_number || 0} // Fallback to 0 if page_number is undefined
      onPageChange={(event, newPage) => props.onPageChange(newPage)}
      onRowsPerPageChange={(event) => props.onRowsPerPageChange(parseInt(event.target.value, 10))}
      sx={{ mt: 2 }}
    />

      {/* Add/Edit Department Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            minWidth: "450px",
            backgroundColor: "#ffffff",
            boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.1)",
            padding: "1.5rem",
          },
        }}
      >
        <DialogTitle sx={{
          fontWeight: "600",
          textAlign: "center",
          fontSize: "1.25rem",
          color: "#333",
          paddingBottom: "1rem",
        }}>
          {isEditMode ? "Edit Department" : "Add New Department"}
        </DialogTitle>

        <DialogContent sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "0",
        }}>
          <TextField
            fullWidth
            label="Department Number"
            name="dnum"
            variant="outlined"
            size="small"
            value={newDepartment.dnum}
            onChange={handleChange}
            inputProps={{
              inputMode: "numeric", // Restrict input to numeric values
              pattern: "[0-9]*", // Only allow digits
            }}
            sx={{
              marginBottom: "0.5rem",
            }}
          />

          <TextField
            fullWidth
            label="Department Name"
            name="dname"
            variant="outlined"
            size="small"
            value={newDepartment.dname}
            onChange={handleChange}
            sx={{
              marginBottom: "0.5rem",
              borderRadius: "12px",
            }}
          />

          <TextField
            fullWidth
            label="Supervisor SSN"
            name="supervisorSsn"
            variant="outlined"
            size="small"
            value={newDepartment.supervisorSsn}
            onChange={handleChange}
            inputProps={{
              inputMode: "numeric", // Restrict input to numeric values
              pattern: "[0-9]*", // Only allow digits
            }}
            sx={{
              marginBottom: "0.5rem",
              borderRadius: "12px",
            }}
          />

          <TextField
            fullWidth
            label="Start Date"
            name="mgsStartDate"
            type="datetime-local"
            value={newDepartment.mgsStartDate}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              marginBottom: "0.5rem",
              borderRadius: "12px",
            }}
          />
        </DialogContent>

        <DialogActions sx={{
          padding: "0.75rem",
          display: "flex",
          justifyContent: "flex-end",
          gap: "1rem",
        }}>
          <Button
            onClick={handleCloseModal}
            color="secondary"
            sx={{
              borderRadius: "8px",
              padding: "0.5rem 1.25rem",
              textTransform: "none",
              backgroundColor: "#f5f5f5",
              "&:hover": { backgroundColor: "#e0e0e0" },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            color="success"
            sx={{
              borderRadius: "8px",
              padding: "0.5rem 1.25rem",
              textTransform: "none",
              backgroundColor: "#e8f3e9",
              "&:hover": { backgroundColor: "#e0e0e0" },
            }}
          >
            {isEditMode ? "Update" : "Add"} Department
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default MultiSelectTable;