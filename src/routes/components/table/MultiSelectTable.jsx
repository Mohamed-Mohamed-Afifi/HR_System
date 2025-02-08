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
  Tooltip,
  Menu,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  ListItemText,
  Card,
} from "@mui/material";
import { Delete, Edit, Search, Add, CheckBox } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { addNewDepartment, deleteDepartment, filterDepartment, updateDepartment } from "../../../feathers/Departments/DepartmentActions";
import Swal from "sweetalert2";
import { format } from 'date-fns';
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
  
  const availableCategories = ['ALL',"dnum", "dname", "supervisorSsn", "employeeName", "projectName", "supervisorName"];
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
      // Refresh data after successful operation
      if (typeof props.onRefresh === "function") {
        props.onRefresh();
      }
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
          if (typeof props.onRefresh === "function") {
            props.onRefresh();
          }
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
// Format date display
const formatDate = (dateString) => {
  if (!dateString) return "—";
  try {
    return format(new Date(dateString), 'PPpp');
  } catch {
    return "—";
  }
};

// Format SSN display
const formatSSN = (ssn) => {
  if (!ssn) return "—";
  const ssnString = String(ssn);
  return `***-**-${ssnString.slice(-4)}`;
};

  return (
    <Card elevation={0} sx={{
      borderRadius: "12px",
      padding: 3,
      backgroundColor: "white",
      boxShadow: "0px 8px 24px -12px rgba(0, 0, 0, 0.1)",
      overflowX: 'auto'
    }}>
      {/* Toolbar Section */}
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
          onClick={handleOpenDropdown}
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
          open={open}
          onClose={handleCloseDropdown}
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
              sx={{ "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" } }}
            >
              {availableCategories.map((category) => (
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

      {/* Table Section */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          minWidth: 1200,
          '& .MuiTable-root': { minWidth: 1200 }
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
                  indeterminate={selected.length > 0 && selected.length < props.data.departments.length}
                  checked={selected.length === props.data.departments.length}
                  onChange={handleSelectAll}
                  color="primary"
                />
              </TableCell>
              {['Department #', 'Department Name', 'Supervisor SSN', 'Supervisor', 'Created At', 'Created By', 'Last Modified', 'Modified By', 'Actions'].map((header) => (
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
            {filteredRows.map((row) => (
              <TableRow 
                key={row.dnum} 
                hover 
                sx={{ 
                  '&:nth-of-type(even)': { backgroundColor: '#FAFAFA' },
                  '&:hover': { backgroundColor: '#F5F5F5' }
                }}
              >
                <TableCell padding="checkbox" sx={{ py: 1.5 }}>
                  <Checkbox
                    checked={selected.includes(row.dnum)}
                    onChange={() => handleSelect(row.dnum)}
                    color="primary"
                  />
                </TableCell>
                <TableCell sx={{ py: 1.5, fontWeight: 500 }}>{row.dnum}</TableCell>
                <TableCell sx={{ py: 1.5 }}>{row.dname || "—"}</TableCell>
                <TableCell sx={{ py: 1.5, color: 'text.secondary' }}>
                  {formatSSN(row.supervisorSsn)}
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>{row.supervisorName || "—"}</TableCell>
                <TableCell sx={{ py: 1.5, color: 'text.secondary' }}>
                  {formatDate(row.created_at)}
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>{row.created_by || "—"}</TableCell>
                <TableCell sx={{ py: 1.5, color: 'text.secondary' }}>
                  {formatDate(row.lastModified)}
                </TableCell>
                <TableCell sx={{ py: 1.5 }}>{row.lastModified_by || "—"}</TableCell>
                <TableCell sx={{ py: 1.5 }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton 
                      onClick={() => handleOpenModal(row)}
                      sx={{ 
                        color: '#4CAF50',
                        '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.1)' }
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(row.dnum)}
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
        count={props.data.totalPages * (props.data.page_size || 10)}
        rowsPerPage={props.data.page_size || 10}
        page={props.data.page_number || 0}
        onPageChange={(event, newPage) => props.onPageChange(newPage)}
        onRowsPerPageChange={(event) => props.onRowsPerPageChange(parseInt(event.target.value, 10))}
        sx={{
          mt: 2,
          '& .MuiTablePagination-toolbar': { px: 0 },
          '& .MuiTablePagination-actions': { ml: 2 }
        }}
      />

      {/* Modal Dialog */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            width: "100%",
            maxWidth: "500px",
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
          {isEditMode ? "Edit Department" : "New Department"}
        </DialogTitle>

        <DialogContent sx={{ px: 0, py: 1 }}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              fullWidth
              label="Department Number"
              name="dnum"
              variant="outlined"
              size="small"
              value={newDepartment.dnum}
              onChange={handleChange}
              inputProps={{ pattern: "[0-9]*" }}
            />

            <TextField
              fullWidth
              label="Department Name"
              name="dname"
              variant="outlined"
              size="small"
              value={newDepartment.dname}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Supervisor SSN"
              name="supervisorSsn"
              variant="outlined"
              size="small"
              value={newDepartment.supervisorSsn}
              onChange={handleChange}
              inputProps={{ pattern: "[0-9]*" }}
            />

            <TextField
              fullWidth
              label="Start Date"
              name="mgsStartDate"
              type="datetime-local"
              value={newDepartment.mgsStartDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
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

export default MultiSelectTable;