import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, Alert, Box } from "@mui/material";
import { getAllProjects } from "../../../feathers/Project/ProjectActions";
import ProjectTable from "./components/ProjectTable";

const Project = () => {
  const dispatch = useDispatch();
  const { loading, error, projPaged } = useSelector((state) => state.project);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const fetchProjects = () => {
    dispatch(getAllProjects({ pageNum: page, pageSize }));
  };

  useEffect(() => {
    fetchProjects();
  }, [page, pageSize]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(0);
  };

  const handleUpdateProjects = () => {
    fetchProjects();
  };

  const handleDeleteProject = () => {
    fetchProjects();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div>
      <ProjectTable
        data={{
          projects: projPaged?.projects || [],
          page_number: page,
          page_size: pageSize,
          totalPages: projPaged?.totalPages || 0
        }}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onUpdateProjects={handleUpdateProjects}
        onDeleteProject={handleDeleteProject}
      />
    </div>
  );
};

export default Project;