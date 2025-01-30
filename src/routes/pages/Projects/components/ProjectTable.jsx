import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  Chip,
  Checkbox
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { 
  addNewProject, 
  deleteProject, 
  filterProject, 
  updateProject 
} from "../../../../feathers/Project/ProjectActions";
import Swal from "sweetalert2";

const ProjectTable = (props) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategories, setSearchCategories] = useState(["ALL"]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const loading=useSelector((state)=>state.project.loading);
const error=useSelector((state)=>state.project.error);

  const [newProject, setNewProject] = useState({
    projectId: "",
    projectName: "",
    location: "",
    city: "",
    departmentNumber: "",
    employees: []
  });

  const availableCategories = ["ALL", "projectId", "projectName", "location", "city", "departmentNumber"];

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleCategoryChange = (event) => {
    setSearchCategories(event.target.value);
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
      pageNumber: props.data?.page_number || 0,
      pageSize: props.data?.page_size || 10,
    };

    try {
      await dispatch(filterProject(payload));
      props.onPageChange(0);
    } catch (error) {
      Swal.fire("Error", "Search failed", "error");
    }
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setNewProject({
        ...project,
        employees: project.employees?.map(e => e.ssn) || []
      });
      setIsEditMode(true);
    } else {
      setNewProject({
        projectId: "",
        projectName: "",
        location: "",
        city: "",
        departmentNumber: "",
        employees: []
      });
      setIsEditMode(false);
    }
    setOpenModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (["projectId", "departmentNumber"].includes(name)) {
      if (!/^\d*$/.test(value)) return;
    }

    setNewProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

//   const validateProject = () => {
//     const errors = [];
//     if (!newProject.projectId) errors.push("Project ID is required");
//     if (!newProject.projectName) errors.push("Project name is required");
//     if (!newProject.departmentNumber) errors.push("Department number is required");
//     return errors;
//   };

  const handleSubmit = () => {
    // const errors = validateProject();
    // if (errors.length > 0) {
    //   Swal.fire("Validation Error", errors.join("\n"), "error");
    //   return;
    // }

    const projectData = {
      ...newProject,
      projectId: parseInt(newProject.projectId, 10),
      departmentNumber: parseInt(newProject.departmentNumber, 10),
      employees: (newProject.employees || []).map(ssn => ({ ssn: parseInt(ssn, 10) }))
    };

    const action = isEditMode ? updateProject : addNewProject;
    dispatch(action(projectData))
      .then((result) => {
        // if (!result?.payload?.projectId) throw new Error("Invalid project data");
        
        Swal.fire("Success", `Project ${isEditMode ? 'updated' : 'added'}!`, "success");
        handleCloseModal();
        props.onUpdateProjects();
        props.onPageChange(0);
      })
      .catch(error => {
        Swal.fire("Error", error.message || "Operation failed", "error");
      });
  };

  const handleDelete = (projectId) => {
    Swal.fire({
      title: "Delete Project?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProject(projectId))
          .then(() => {
            props.onDeleteProject();
            props.onPageChange(0);
          })
          .catch(error => Swal.fire("Error", error.message, "error"));
      }
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewProject({
      projectId: "",
      projectName: "",
      location: "",
      city: "",
      departmentNumber: "",
      employees: []
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
          Add Project
        </Button>

        <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, maxWidth: '800px', ml: 2 }}>
          <TextField
            size="small"
            placeholder="Search projects..."
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
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Project ID</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Project Name</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Location</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>City</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Department</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Employees</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(props.data?.projects || []).map((project) => (
              <TableRow key={project?.projectId || Math.random()} hover sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                <TableCell>{project?.projectId || 'N/A'}</TableCell>
                <TableCell>{project?.projectName || 'N/A'}</TableCell>
                <TableCell>{project?.location || 'N/A'}</TableCell>
                <TableCell>{project?.city || 'N/A'}</TableCell>
                <TableCell>{project?.departmentNumber || 'N/A'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {(project?.employees || []).map((employee, index) => (
                      <Chip
                        key={index}
                        label={employee?.ssn || 'Unknown'}
                        size="small"
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: "8px" }}>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleOpenModal(project)} sx={{ color: '#388e3c' }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(project?.projectId)} sx={{ color: '#d32f2f' }}>
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
        count={(props.data?.totalPages || 0) * (props.data?.page_size || 10)}
        rowsPerPage={props.data?.page_size || 10}
        page={props.data?.page_number || 0}
        onPageChange={(e, newPage) => props.onPageChange(newPage)}
        onRowsPerPageChange={(e) => props.onRowsPerPageChange(parseInt(e.target.value, 10))}
        sx={{ mt: 2 }}
      />

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, textAlign: 'center' }}>
          {isEditMode ? 'Edit Project' : 'New Project'}
        </DialogTitle>
        <DialogContent sx={{ pt: '1rem!important' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Project ID"
                name="projectId"
                value={newProject.projectId}
                onChange={handleChange}
                margin="dense"
                disabled={isEditMode}
                inputProps={{ inputMode: 'numeric' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Project Name"
                name="projectName"
                value={newProject.projectName}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={newProject.location}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={newProject.city}
                onChange={handleChange}
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department Number"
                name="departmentNumber"
                value={newProject.departmentNumber}
                onChange={handleChange}
                margin="dense"
                inputProps={{ inputMode: 'numeric' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employee SSNs (comma separated)"
                name="employees"
                value={newProject.employees.join(',')}
                onChange={(e) => setNewProject(prev => ({
                  ...prev,
                  employees: e.target.value.split(',').map(s => s.trim())
                }))}
                margin="dense"
                placeholder="e.g., 1001, 1002"
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

export default ProjectTable;