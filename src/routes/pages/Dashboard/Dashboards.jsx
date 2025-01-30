import React, { useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Stack,
  Avatar,
  LinearProgress,
  Chip,
  Fab,
  useTheme,
} from "@mui/material";
import {
  Groups,
  Work,
  Apartment,
  FamilyRestroom,
  ArrowUpward,
  Mail,
} from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getAllEmployees } from "../../../feathers/Employee/EmployeeActions";
import { getAllDepartments } from "../../../feathers/Departments/DepartmentActions";
import { getAllDependents } from "../../../feathers/Dependents/DependentActions";
import { getAllProjects } from "../../../feathers/Project/ProjectActions";

const StatsCard = ({ icon, title, value, trend }) => (
  <motion.div whileHover={{ scale: 1.03 }}>
    <Card sx={{ 
      p: 3, 
      borderRadius: 4, 
      boxShadow: '0px 10px 20px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease',
      '&:hover': { boxShadow: '0px 15px 25px rgba(0,0,0,0.1)' }
    }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar sx={{ bgcolor: '#4caf5020', width: 56, height: 56 }}>
          {React.cloneElement(icon, { sx: { color: '#4caf50', fontSize: 28 } })}
        </Avatar>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
          <Typography variant="h4" fontWeight="700">{value}</Typography>
          <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
            <ArrowUpward sx={{ color: '#4caf50', fontSize: 16 }} />
            <Typography variant="body2" color="#4caf50">{trend}</Typography>
          </Stack>
        </Box>
      </Stack>
    </Card>
  </motion.div>
);

const ProjectProgress = ({ project }) => (
  <motion.div whileHover={{ x: 5 }}>
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography variant="body1">{project?.name || 'Project'}</Typography>
        <Typography variant="body1" fontWeight="500">
          {project?.progress || 0}%
        </Typography>
      </Stack>
      <LinearProgress 
        variant="determinate" 
        value={project?.progress || 0} 
        sx={{ 
          height: 8, 
          borderRadius: 4,
          backgroundColor: '#f0f0f0',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            backgroundColor: '#4caf50'
          }
        }} 
      />
      <Stack direction="row" spacing={1} mt={1.5}>
        {(project?.team || []).map((member, index) => (
          <Chip
            key={index}
            label={member}
            size="small"
            sx={{ 
              backgroundColor: '#4caf5010',
              color: '#4caf50',
              fontWeight: 500 
            }}
          />
        ))}
      </Stack>
    </Box>
  </motion.div>
);

const Dashboards = () => {
  // Redux state selectors
  const { empPaged: employeesData } = useSelector((state) => state.emp);
  const { deptPaged: departmentsData } = useSelector((state) => state.dept);
  const { depPaged: dependentsData } = useSelector((state) => state.dependent);
  const { projPaged: projectsData } = useSelector((state) => state.project);
  
  const dispatch = useDispatch();
  const theme = useTheme();

  // Fetch all data on mount
  useEffect(() => {
    const pageParams = { pageNum: 0, pageSize: 100 };
    dispatch(getAllEmployees(pageParams));
    dispatch(getAllDepartments(pageParams));
    dispatch(getAllDependents(pageParams));
    dispatch(getAllProjects(pageParams));
  }, [dispatch]);

  // Data processing functions
  const getDepartmentDistribution = () => {
    if (!employeesData?.employees) return [];
    return employeesData.employees.reduce((acc, employee) => {
      const department = employee.department || 'Unknown';
      acc[department] = (acc[department] || 0) + 1;
      return acc;
    }, {});
  };

  const getRecentDependents = () => {
    if (!dependentsData?.dependents || !employeesData?.employees) return [];
    return dependentsData.dependents.slice(0, 5).map(dependent => {
      const employee = employeesData.employees.find(e => e.id === dependent.employeeId);
      return {
        employeeName: employee?.name || 'Unknown',
        dependentName: dependent.name,
        relation: dependent.relationship
      };
    });
  };

  // Processed data
  const departmentDistribution = Object.entries(getDepartmentDistribution())
    .map(([name, count]) => ({ name, count }));
  
  const recentDependents = getRecentDependents();

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <StatsCard
            icon={<Groups />}
            title="Total Employees"
            value={employeesData?.total || 0}
            trend={`+${Math.round((employeesData?.total || 0) / 100 * 5)}% this quarter`}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatsCard
            icon={<Work />}
            title="Active Projects"
            value={projectsData?.total || 0}
            trend={`${projectsData?.projects?.filter(p => p.progress < 100).length || 0} ongoing`}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatsCard
            icon={<Apartment />}
            title="Departments"
            value={departmentsData?.total || 0}
            trend={`${departmentsData?.departments?.length || 0} active teams`}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatsCard
            icon={<FamilyRestroom />}
            title="Dependents"
            value={dependentsData?.total || 0}
            trend={`+${Math.round((dependentsData?.total || 0) / 100 * 8)}% this year`}
          />
        </Grid>

        {/* Employees by Department Chart */}
        <Grid item xs={12} lg={8}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
              <Typography variant="h6" mb={3}>Employees by Department</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="count" 
                    fill="#4caf50"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Grid>

        {/* Active Projects */}
        <Grid item xs={12} lg={4}>
          <motion.div initial={{ y: 20 }} animate={{ y: 0 }}>
            <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
              <Typography variant="h6" mb={3}>Active Projects</Typography>
              {(projectsData?.projects || []).map((project, index) => (
                <ProjectProgress key={index} project={project} />
              ))}
            </Card>
          </motion.div>
        </Grid>

        {/* Departments Overview */}
        <Grid item xs={12} lg={6}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
              <Typography variant="h6" mb={3}>Departments</Typography>
              <Stack spacing={2}>
                {(departmentsData?.departments || []).map((dept, index) => {
                  const memberCount = employeesData?.employees?.filter(
                    e => e.department === dept.name
                  ).length || 0;
                  
                  return (
                    <Stack
                      key={index}
                      direction="row"
                      alignItems="center"
                      spacing={2}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        backgroundColor: '#fafafa',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                          transform: 'translateX(5px)'
                        }
                      }}
                    >
                      <Avatar sx={{ 
                        bgcolor: '#4caf5020', 
                        width: 48, 
                        height: 48 
                      }}>
                        <Apartment sx={{ color: '#4caf50' }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="500">
                          {dept.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {memberCount} members • Manager: {dept.manager}
                        </Typography>
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            </Card>
          </motion.div>
        </Grid>

        {/* Dependents Overview */}
        <Grid item xs={12}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Recent Dependents</Typography>
                <Chip label="View All" clickable sx={{ bgcolor: '#4caf5010', color: '#4caf50' }} />
              </Stack>
              <Box sx={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Employee</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Dependent</th>
                      <th style={{ textAlign: 'left', padding: '12px', color: '#666' }}>Relationship</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDependents.map((dependent, index) => (
                      <tr key={index} style={{ borderTop: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>{dependent.employeeName}</td>
                        <td style={{ padding: '12px' }}>{dependent.dependentName}</td>
                        <td style={{ padding: '12px' }}>
                          <Chip 
                            label={dependent.relation} 
                            size="small" 
                            sx={{ bgcolor: '#4caf5010', color: '#4caf50' }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          bgcolor: '#4caf50',
          '&:hover': { bgcolor: '#388e3c' },
          transition: 'all 0.3s ease'
        }}
      >
        <Mail />
      </Fab>
    </Box>
  );
};

export default Dashboards;