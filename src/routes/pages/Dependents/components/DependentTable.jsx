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
import { useDispatch, useSelector } from "react-redux";
import { 
  addNewDependent, 
  deleteDependent, 
  filterDependent, 
  updateDependent 
} from "../../../../feathers/Dependents/DependentActions";
import Swal from "sweetalert2";

const DependentTable = (props) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.dependent.loading);
  const error = useSelector((state) => state.dependent.error);
  const success = useSelector((state) => state.dependent.success);
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategories, setSearchCategories] = useState(["ALL"]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newDependent, setNewDependent] = useState({
    employeeSsn: "",
    dependentName: "",
    sex: "F",
    bdate: "",
  });

  const availableCategories = ["ALL", "employeeSsn", "dependentName"];

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
      await dispatch(filterDependent(payload));
      props.onPageChange(0);
    } catch (error) {
      Swal.fire("Error", "Search failed", "error");
    }
  };

  // Dependent CRUD operations
  const handleOpenModal = (dependent = null) => {
    if (dependent) {
      setNewDependent({
        ...dependent,
        bdate: dependent.bdate?.split('T')[0] || ""
      });
      setIsEditMode(true);
    } else {
      setNewDependent({
        employeeSsn: "",
        dependentName: "",
        sex: "F",
        bdate: ""
      });
      setIsEditMode(false);
    }
    setOpenModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "employeeSsn") {
      if (!/^\d*$/.test(value)) return;
    }

    setNewDependent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const dependentData = {
      ...newDependent,
      employeeSsn: parseInt(newDependent.employeeSsn, 10),
      bdate: new Date(newDependent.bdate).toISOString()
    };

    const action = isEditMode ? updateDependent : addNewDependent;
    dispatch(action(dependentData))
      .then(() => {
        Swal.fire("Success", `Dependent ${isEditMode ? 'updated' : 'added'}!`, "success");
        handleCloseModal();
        handleSearchSubmit();
      })
      .catch(error => {
        Swal.fire("Error", error.message || "Operation failed", "error");
      });
  };

  const handleDelete = (employeeSsn, dependentName) => {
    Swal.fire({
      title: "Delete Dependent?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteDependent({ employeeSsn, dependentName }))
          .then(() => handleSearchSubmit())
          .catch(error => Swal.fire("Error", error.message, "error"));
      }
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewDependent({
      employeeSsn: "",
      dependentName: "",
      sex: "F",
      bdate: ""
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
          Add Dependent
        </Button>

        <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, maxWidth: '800px', ml: 2 }}>
          <TextField
            size="small"
            placeholder="Search dependents..."
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
                  indeterminate={selected.length > 0 && selected.length < props.data.dependents.length}
                  checked={selected.length === props.data.dependents.length}
                  sx={{ color: "#fff" }}
                />
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Employee SSN</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Dependent Name</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Gender</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Birthdate</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.dependents.map((dependent) => (
              <TableRow key={`${dependent.employeeSsn}-${dependent.dependentName}`} hover sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(dependent.employeeSsn)}
                    onChange={() => setSelected(prev => 
                      prev.includes(dependent.employeeSsn) 
                        ? prev.filter(id => id !== dependent.employeeSsn) 
                        : [...prev, dependent.employeeSsn]
                    )}
                    sx={{ color: "#388e3c" }}
                  />
                </TableCell>
                <TableCell>{dependent.employeeSsn}</TableCell>
                <TableCell>{dependent.dependentName}</TableCell>
                <TableCell>{dependent.sex}</TableCell>
                <TableCell>{new Date(dependent.bdate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: "8px" }}>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOpenModal(dependent)} sx={{ color: '#388e3c' }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(dependent.employeeSsn, dependent.dependentName)} sx={{ color: '#d32f2f' }}>
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
          {isEditMode ? 'Edit Dependent' : 'New Dependent'}
        </DialogTitle>
        <DialogContent sx={{ pt: '1rem!important' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employee SSN"
                name="employeeSsn"
                value={newDependent.employeeSsn}
                onChange={handleChange}
                margin="dense"
                inputProps={{ inputMode: 'numeric' }}
                disabled={isEditMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dependent Name"
                name="dependentName"
                value={newDependent.dependentName}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Birthdate"
                type="date"
                name="bdate"
                InputLabelProps={{ shrink: true }}
                value={newDependent.bdate}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Gender</InputLabel>
                <Select
                  name="sex"
                  value={newDependent.sex}
                  onChange={handleChange}
                  label="Gender"
                >
                  <MenuItem value="M">Male</MenuItem>
                  <MenuItem value="F">Female</MenuItem>
                </Select>
              </FormControl>
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

export default DependentTable;