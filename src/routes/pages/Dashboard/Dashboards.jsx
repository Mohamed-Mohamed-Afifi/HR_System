import React from "react";
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
  IconButton
} from "@mui/material";
import {
  Groups,
  Work,
  Apartment,
  FamilyRestroom,
  Mail,
  TrendingUp,
  MoreVert
} from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

// Simplified Color Palette
const colors = {
  primary: '#3aed96', // Blue
  secondary: '#4caf50', // Green
  accent: '#ff9800', // Orange
  background: '#f5f5f5', // Light grey
  text: '#333333', // Dark grey
  white: '#ffffff',
  spcial:"rgba(58, 237, 150, 0.3)"
};

// Simplified Typography
const typography = {
  h1: { fontSize: '2.5rem', fontWeight: 700 },
  h2: { fontSize: '2rem', fontWeight: 600 },
  h3: { fontSize: '1.75rem', fontWeight: 600 },
  h4: { fontSize: '1.5rem', fontWeight: 600 },
  h5: { fontSize: '1.25rem', fontWeight: 600 },
  h6: { fontSize: '1rem', fontWeight: 600 },
  body1: { fontSize: '1rem', fontWeight: 400 },
  body2: { fontSize: '0.875rem', fontWeight: 400 },
};

// Animation configurations
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 20
    }
  }
};

const DashboardCard = ({ title, value, icon, color }) => (
  <motion.div variants={cardVariants}>
    <Card sx={{ 
      p: 3, 
      borderRadius: 2,
      backgroundColor: colors.white,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)'
      }
    }}>
      <Stack direction="row" justifyContent="space-between">
        <div>
          <Typography variant="body2" sx={{ color: colors.text, opacity: 0.8 }}>
            {title}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, color: colors.text }}>
            {value}
          </Typography>
        </div>
        <Avatar sx={{ 
          bgcolor: `${color}20`, 
          width: 56, 
          height: 56 
        }}>
          {React.cloneElement(icon, { sx: { fontSize: 28, color: color } })}
        </Avatar>
      </Stack>
    </Card>
  </motion.div>
);

const AnalyticsChart = () => (
  <motion.div variants={cardVariants}>
    <Card sx={{ 
      p: 3, 
      borderRadius: 2,
      backgroundColor: colors.white,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      height: '100%'
    }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text }}>
          Employee Distribution
        </Typography>
        <IconButton>
          <MoreVert />
        </IconButton>
      </Stack>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={employeesData}>
          <XAxis dataKey="department" />
          <YAxis />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: colors.white,
              borderRadius: 2,
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
          <Bar 
            dataKey="count" 
            fill={colors.spcial}
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  </motion.div>
);

const ProgressItem = ({ title, progress, color }) => (
  <motion.div whileHover={{ x: 5 }}>
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" justifyContent="space-between" mb={1}>
        <Typography variant="body1" sx={{ color: colors.text }}>
          {title}
        </Typography>
        <Typography variant="body1" fontWeight={600} sx={{ color: colors.text }}>
          {progress}%
        </Typography>
      </Stack>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ 
          height: 8,
          borderRadius: 4,
          backgroundColor: `${color}20`,
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            backgroundColor: color
          }
        }}
      />
    </Box>
  </motion.div>
);

const Dashboards = () => {
  return (
    <Box sx={{ 
      p: 3, 
      minHeight: '100vh',
      backgroundColor: colors.background
    }}>
      <Grid container spacing={3}>
        {/* Key Metrics */}
        <Grid item xs={12} md={6} lg={3}>
          <DashboardCard
            title="Total Employees"
            value="1.2K"
            icon={<Groups />}
            color={colors.primary}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <DashboardCard
            title="Active Projects"
            value="24"
            icon={<Work />}
            color={colors.secondary}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <DashboardCard
            title="Departments"
            value="12"
            icon={<Apartment />}
            color={colors.accent}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <DashboardCard
            title="Dependents"
            value="356"
            icon={<FamilyRestroom />}
            color={colors.primary}
          />
        </Grid>

        {/* Main Chart */}
        <Grid item xs={12} lg={8}>
          <AnalyticsChart />
        </Grid>

        {/* Progress Section */}
        <Grid item xs={12} lg={4}>
          <motion.div variants={cardVariants}>
            <Card sx={{ 
              p: 3, 
              borderRadius: 2,
              backgroundColor: colors.white,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              height: '100%'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: colors.text }}>
                Project Progress
              </Typography>
              <ProgressItem 
                title="Platform Migration" 
                progress={75} 
                color={colors.primary}
              />
              <ProgressItem 
                title="Mobile App" 
                progress={45} 
                color={colors.secondary}
              />
              <ProgressItem 
                title="API Integration" 
                progress={90} 
                color={colors.accent}
              />
            </Card>
          </motion.div>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={4}>
          <motion.div variants={cardVariants}>
            <Card sx={{ 
              p: 3, 
              borderRadius: 2,
              backgroundColor: colors.white,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <Stack direction="row" justifyContent="space-between" mb={3}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text }}>
                  Recent Activity
                </Typography>
                <Chip 
                  label="View All" 
                  size="small" 
                  sx={{ 
                    bgcolor: `${colors.primary}20`, 
                    fontWeight: 600,
                    color: colors.primary
                  }}
                />
              </Stack>
              {activities.map((activity, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.02 }}
                >
                  <Stack 
                    direction="row" 
                    spacing={2} 
                    sx={{ 
                      p: 2, 
                      mb: 2, 
                      borderRadius: 2,
                      backgroundColor: `${colors.background}`
                    }}
                  >
                    <Avatar sx={{ bgcolor: `${activity.color}20` }}>
                      {activity.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600} sx={{ color: colors.text }}>
                        {activity.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.text, opacity: 0.7 }}>
                        {activity.time}
                      </Typography>
                    </Box>
                  </Stack>
                </motion.div>
              ))}
            </Card>
          </motion.div>
        </Grid>

        {/* Team Members */}
        <Grid item xs={12} lg={8}>
          <motion.div variants={cardVariants}>
            <Card sx={{ 
              p: 3, 
              borderRadius: 2,
              backgroundColor: colors.white,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: colors.text }}>
                Team Members
              </Typography>
              <Grid container spacing={3}>
                {teamMembers.map((member, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <motion.div whileHover={{ y: -5 }}>
                      <Stack 
                        direction="row" 
                        spacing={2} 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          backgroundColor: `${colors.background}`
                        }}
                      >
                        <Avatar 
                          src={member.avatar} 
                          sx={{ width: 48, height: 48 }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight={600} sx={{ color: colors.text }}>
                            {member.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.text, opacity: 0.7 }}>
                            {member.role}
                          </Typography>
                        </Box>
                      </Stack>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <motion.div 
        style={{ position: 'fixed', bottom: 32, right: 32 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Fab
          sx={{
            backgroundColor: colors.primary,
            color: colors.white,
            '&:hover': {
              backgroundColor: colors.primary
            }
          }}
        >
          <Mail />
        </Fab>
      </motion.div>
    </Box>
  );
};

// Mock Data
const employeesData = [
  { department: 'Engineering', count: 45 },
  { department: 'Marketing', count: 22 },
  { department: 'HR', count: 12 },
  { department: 'Finance', count: 18 },
];

const activities = [
  { 
    icon: <TrendingUp sx={{ color: colors.primary }} />,
    title: "Project Milestone Reached",
    time: "2h ago",
    color: colors.primary
  },
  { 
    icon: <Work sx={{ color: colors.secondary }} />,
    title: "New Project Created",
    time: "1d ago",
    color: colors.secondary
  },
  { 
    icon: <Groups sx={{ color: colors.accent }} />,
    title: "Team Member Added",
    time: "3d ago",
    color: colors.accent
  },
];

const teamMembers = [
  { name: 'Alex Johnson', role: 'Lead Developer', avatar: '...' },
  { name: 'Sarah Miller', role: 'UX Designer', avatar: '...' },
  { name: 'Mike Chen', role: 'Project Manager', avatar: '...' },
  { name: 'Emma Wilson', role: 'QA Engineer', avatar: '...' },
];

export default Dashboards;