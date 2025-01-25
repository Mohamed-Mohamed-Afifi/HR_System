import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { FaHome, FaUsers, FaProjectDiagram, FaBuilding } from "react-icons/fa";
import { MdChildCare } from "react-icons/md";
import { FaComments } from "react-icons/fa"; // Import chat icon
import theme from "./theme";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // Manage sidebar open/close state
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false); // Manage hamburger open/close state
  const isMobile = useMediaQuery("(max-width:768px)"); // Detect screen size

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    setIsHamburgerOpen(!isHamburgerOpen); // Toggle hamburger state on drawer open/close
  };

  const menuItems = [
    { text: "Dashboard", icon: <FaHome />, path: "/" },
    { text: "Departments", icon: <FaBuilding />, path: "/departments" },
    { text: "Employees", icon: <FaUsers />, path: "/employees" },
    { text: "Projects", icon: <FaProjectDiagram />, path: "/projects" },
    { text: "Dependents", icon: <MdChildCare />, path: "/dependents" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        {/* Sidebar Drawer */}
        <Drawer
          variant={isMobile ? "temporary" : "persistent"}
          anchor="left"
          open={isMobile ? isOpen : true} // Always open in desktop mode
          onClose={isMobile ? toggleDrawer : undefined} // Close drawer only in mobile
          sx={{
            width: isOpen ? 250 : 60,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: isOpen ? 250 : 60,
              backgroundColor: "#388e3c",
              color: "#ffffff",
              borderRight: "none",
              overflowX: "hidden", // Prevent content overflow
              transition: "width 0.3s ease",
            },
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: isOpen ? "space-between" : "center",
              padding: "1rem",
              borderBottom: "1px solid rgb(246, 246, 246)",
            }}
          >
            {isOpen && (
              <Typography
                variant="h5"
                sx={{
                  color: "#ffffff",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  fontSize: "1.2rem",
                }}
              >
                AwesomeApp
              </Typography>
            )}

            {/* Custom Hamburger Icon */}
            <IconButton
              onClick={toggleDrawer}
              sx={{
                color: "#ffffff",
                backgroundColor: "#388e3c", // Background color for button
                borderRadius: "50%", // Circular shape for the button
                padding: "0.5rem",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)", // Shadow for depth
                "&:hover": {
                  backgroundColor: "#1e7c1e", // Darker shade on hover
                },
                transition: "all 0.3s ease", // Smooth transition for the button
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: "20px", // Adjust height for bars
                  width: "20px", // Adjust width for button
                }}
              >
                <Box
                  sx={{
                    height: "4px", // Thickness of the first bar
                    width: "16px", // Width of the first bar
                    backgroundColor: "#ffffff", // White color for bars
                    borderRadius: "2px", // Rounded edges for bars
                    transition: "all 0.3s ease", // Smooth transition
                    transform: isHamburgerOpen ? "rotate(45deg) translateY(8px)" : "none", // Transition to an "X"
                  }}
                />
                <Box
                  sx={{
                    height: "4px", // Thickness of the second bar
                    width: "12px", // Width of the second bar (smaller)
                    backgroundColor: "#ffffff", // White color for bars
                    borderRadius: "2px", // Rounded edges for bars
                    transition: "all 0.3s ease", // Smooth transition
                    opacity: isHamburgerOpen ? 0 : 1, // Fade out when the hamburger is open
                  }}
                />
                <Box
                  sx={{
                    height: "4px", // Thickness of the third bar
                    width: "18px", // Width of the third bar (larger)
                    backgroundColor: "#ffffff", // White color for bars
                    borderRadius: "2px", // Rounded edges for bars
                    transition: "all 0.3s ease", // Smooth transition
                    transform: isHamburgerOpen ? "rotate(-45deg) translateY(-8px)" : "none", // Transition to an "X"
                  }}
                />
              </Box>
            </IconButton>
          </Box>

          {/* Sidebar Menu Items */}
          <List>
            {menuItems.map((item, index) => (
              <ListItem
                button
                component={NavLink}
                to={item.path}
                key={index}
                activeClassName="active" // Apply active class when active
                sx={{
                  display: "flex",
                  justifyContent: isOpen ? "flex-start" : "center",
                  alignItems: "center",
                  padding: "0.5rem",
                  gap: isOpen ? "10px" : "0",
                  backgroundColor: "transparent", // Default background
                  position: "relative", // For positioning the triangle
                  "&.active": {
                    backgroundColor: "#1e7c1e", // Active link background
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      right: "-10px",
                      top: "50%",
                      transform: "translateY(-50%) rotate(90deg)", // Center and rotate triangle
                      width: 0,
                      height: 0,
                      borderLeft: "20px solid transparent",
                      borderRight: "20px solid transparent",
                      borderTop: "20px solid #ffffff", // White triangle
                      transition: "all 0.3s ease", // Smooth transition
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: "40px",
                    justifyContent: "center",
                    color: "#ffffff",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {isOpen && <ListItemText primary={item.text} />}
              </ListItem>
            ))}
          </List>

          {/* Chat Icon at the bottom */}
          <Box
            sx={{
              position: "absolute",
              bottom: "20px", // Add space from the bottom
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <IconButton
              sx={{
                color: "#ffffff",
                backgroundColor: "#388e3c", // Same background as sidebar
                padding: "0.8rem",
                borderRadius: "50%",
                boxShadow: "0px 4px 6px rgba(193, 193, 193, 0.2)",
                "&:hover": {
                  backgroundColor: "#1e7c1e",
                },
              }}
            >
              <FaComments size={24} />
            </IconButton>
          </Box>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
};

export default Sidebar;
