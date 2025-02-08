import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  Chip,
  CircularProgress,
  Checkbox
} from "@mui/material";
import { Delete, Edit, Search, Add } from "@mui/icons-material";
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
  const { loading, error } = useSelector((state) => state.project);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategories, setSearchCategories] = useState(["ALL"]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newProject, setNewProject] = useState({
    projectId: "",
    projectName: "",
    location: "",
    city: "",
    departmentNumber: "",
    employees: []
  });

  const availableCategories = ["projectId", "projectName", "location", "city", "departmentNumber"];

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
      pageSize: props.data?.page_size || 10,
    };

    try {
      await dispatch(filterProject(payload));
      props.onPageChange(0);
    } catch (error) {
      Swal.fire("Error", "Search failed", "error");
    }
  };

  // Project CRUD operations
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

  const validateProject = () => {
    const errors = [];
    if (!/^\d+$/.test(newProject.projectId)) errors.push("Valid Project ID is required");
    if (!newProject.projectName.trim()) errors.push("Project name is required");
    if (!/^\d+$/.test(newProject.departmentNumber)) errors.push("Valid Department number is required");
    return errors;
  };

  const handleSubmit = () => {
    const errors = validateProject();
    if (errors.length > 0) {
      Swal.fire("Validation Error", errors.join("\n"), "error");
      return;
    }

    const projectData = {
      ...newProject,
      projectId: parseInt(newProject.projectId, 10),
      departmentNumber: parseInt(newProject.departmentNumber, 10),
      employees: newProject.employees.map(ssn => ({ ssn: parseInt(ssn, 10) }))
    };

    const action = isEditMode ? updateProject : addNewProject;
    dispatch(action(projectData))
      .then(() => {
        Swal.fire("Success", `Project ${isEditMode ? 'updated' : 'added'}!`, "success");
        handleCloseModal();
        props.onRefresh();
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
      confirmButtonColor: "#d32f2f",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProject(projectId))
          .then(() => props.onRefresh())
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
          variant="contained"
          startIcon={<Add />}
          sx={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            "&:hover": { backgroundColor: "#43A047" },
            borderRadius: "8px",
            px: 3,
            textTransform: 'none',
            fontWeight: 600
          }}
          onClick={() => handleOpenModal()}
        >
          Add Project
        </Button>

        <TextField
          size="small"
          placeholder="Search projects..."
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
          variant="contained"
          onClick={handleSearchSubmit}
          sx={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            "&:hover": { backgroundColor: "#43A047" },
            borderRadius: "8px",
            px: 3,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Search
        </Button>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={40} thickness={4} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        </Box>
      )}

      {/* Table */}
      {!loading && !error && (
        <>
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
                  {['Project ID', 'Project Name', 'Location', 'City', 'Department', 'Employees', 'Actions'].map((header) => (
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
                {(props.data?.projects || []).map((project) => (
                  <TableRow 
                    key={project.projectId} 
                    hover 
                    sx={{ 
                      '&:nth-of-type(even)': { backgroundColor: '#FAFAFA' },
                      '&:hover': { backgroundColor: '#F5F5F5' }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{project.projectId}</TableCell>
                    <TableCell>{project.projectName}</TableCell>
                    <TableCell>{project.location || "—"}</TableCell>
                    <TableCell>{project.city || "—"}</TableCell>
                    <TableCell>{project.departmentNumber || "—"}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {project.employees?.map((employee, index) => (
                          <Chip
                            key={index}
                            label={employee.ssn}
                            size="small"
                            sx={{ borderRadius: 1 }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton 
                          onClick={() => handleOpenModal(project)}
                          sx={{ 
                            color: 'text.secondary',
                            '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.1)' }
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDelete(project.projectId)}
                          sx={{ 
                            color: 'text.secondary',
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
            count={(props.data?.totalPages || 0) * (props.data?.page_size || 10)}
            rowsPerPage={props.data?.page_size || 10}
            page={props.data?.page_number || 0}
            onPageChange={(e, newPage) => props.onPageChange(newPage)}
            onRowsPerPageChange={(e) => props.onRowsPerPageChange(parseInt(e.target.value, 10))}
            sx={{
              mt: 2,
              '& .MuiTablePagination-toolbar': { px: 0 },
              '& .MuiTablePagination-actions': { ml: 2 }
            }}
          />
        </>
      )}

      {/* Project Form Modal */}
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
          {isEditMode ? "Edit Project" : "New Project"}
        </DialogTitle>

        <DialogContent sx={{ px: 0, py: 1 }}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              fullWidth
              label="Project ID"
              name="projectId"
              value={newProject.projectId}
              onChange={handleChange}
              required
              disabled={isEditMode}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />

            <TextField
              fullWidth
              label="Project Name"
              name="projectName"
              value={newProject.projectName}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Location"
              name="location"
              value={newProject.location}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="City"
              name="city"
              value={newProject.city}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Department Number"
              name="departmentNumber"
              value={newProject.departmentNumber}
              onChange={handleChange}
              required
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />

            <TextField
              fullWidth
              label="Employee SSNs (comma separated)"
              name="employees"
              value={newProject.employees.join(', ')}
              onChange={(e) => setNewProject(prev => ({
                ...prev,
                employees: e.target.value.split(',').map(s => s.trim())
              }))}
              placeholder="e.g., 123456789, 987654321"
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

export default ProjectTable;