import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/SideBar/SideBar";
import styles from "./DashLayout.module.css";
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, ListItemIcon } from "@mui/material";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa"; // User icon and logout icon

export const DashLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // State to handle dropdown menu

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to open the user menu
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget); // Set the clicked element as the anchor for the menu
  };

  // Function to close the user menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Function to handle logout (you can replace this with your logout logic)
  const handleLogout = () => {
    // Example logout logic (redirect to login page or clear auth data)
    console.log("Logged out");
    handleCloseMenu(); // Close the menu after logout
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`${styles.content} ${
          isSidebarOpen ? styles.sidebarOpen : ""
        }`}
      >
        {/* Header with User Info */}
        <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#ffffff", // Modern white background
        padding: "0.5rem 1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Light shadow for depth
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {/* No text here, as requested */}
        </Typography>

        {/* User Info on the Right */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* User Icon Button */}
          <IconButton sx={{ color: "#4caf50", fontSize: "2rem" }} onClick={handleMenuClick}>
            <FaUserCircle />
          </IconButton>

          {/* User Name with reduced space */}
          <div
            style={{
              marginRight: "1.8rem", // Reduced margin to bring closer to icon
              color: "#4caf50", // Dark gray color for the user name
              cursor: "pointer",
              display: "flex",
              alignItems: "center", // Ensure the icon and text align vertically
            }}
            onClick={handleMenuClick} // Also trigger the menu when clicking on the user name
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              John Doe
            </Typography> {/* User name */}
          </div>
        </div>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)} // Menu will open when anchorEl is not null
          onClose={handleCloseMenu} // Close the menu when clicking outside
          sx={{ mt: "10px" }} // Reduced margin-top to bring the dropdown closer to the icon
          MenuListProps={{
            sx: {
              backgroundColor: "#2c2c2c", // Darker background for the dropdown
              color: "#4caf50", // White text color
              borderRadius: "8px", // Rounded corners for the menu
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // Shadow for a floating effect
              padding: "0", // Remove extra padding
            },
          }}
        >
          {/* Profile Menu Item */}
          <MenuItem
            onClick={handleCloseMenu}
            sx={{
              padding: "0.8rem 1rem", // Adjust padding for better spacing
              "&:hover": {
                backgroundColor: "#ff5722", // Highlight with primary color on hover
                color: "#fff", // Ensure text is white on hover
              },
              borderRadius: "8px", // Rounded corners for menu items
            }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              <FaUserCircle />
            </ListItemIcon>
            Profile
          </MenuItem>
          {/* Logout Menu Item */}
          <MenuItem
            onClick={handleLogout}
            sx={{
              padding: "0.8rem 1rem", // Adjust padding for better spacing
              "&:hover": {
                backgroundColor: "#ff5722", // Highlight with primary color on hover
                color: "#fff", // Ensure text is white on hover
              },
              borderRadius: "8px", // Rounded corners for menu items
            }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>
              <FaSignOutAlt />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>

        {/* Content Area */}
        <div style={{ marginTop: "60px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
