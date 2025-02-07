import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/SideBar/Sidebar";
import styles from "./DashLayout.module.css";
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, ListItemIcon } from "@mui/material";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logoutHandler } from "../../../feathers/Logout/LogoutActions";
import Swal from "sweetalert2";

export const DashLayout = () => {
    // const userInfo= useSelector((state) => state.auth.userInfo);
    // console.log(userInfo,"userInfo");
    const fullName = localStorage.getItem("fullName");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const loading = useSelector((state) => state.logout.loading);
  const success = useSelector((state) => state.logout.success);
  const error = useSelector((state) => state.logout.error);

  // Debugging: Log success and error states
  console.log("Success:", success);
  console.log("Error:", error);

  // Handle successful logout
  useEffect(() => {
    if (success) {
      Swal.fire({
        icon: 'success',
        title: 'Logged Out!',
        text: 'You have been successfully logged out.',
        confirmButtonColor: '#4caf50',
      }).then(() => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("fullName");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        navigate("/user/login");
      });
    }
  }, [success, navigate]);

  // Handle logout error
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: error,
        confirmButtonColor: '#ff5722',
      });
    }
  }, [error]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    // navigate("/profile");
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutHandler());
    handleCloseMenu();
  };

  return (
    <div className={styles.dashboard}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`${styles.content} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: "#ffffff",
            padding: "0.5rem 1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {/* No text here, as requested */}
            </Typography>

            <div style={{ display: "flex", alignItems: "center" }}>
              <IconButton sx={{ color: "#4caf50", fontSize: "2rem" }} onClick={handleMenuClick}>
                <FaUserCircle />
              </IconButton>

              <div
                style={{
                  marginRight: "1.8rem",
                  color: "#4caf50",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={handleMenuClick}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {fullName || "User"}
                </Typography>
              </div>
            </div>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              sx={{ mt: "10px" }}
              MenuListProps={{
                sx: {
                  backgroundColor: "#2c2c2c",
                  color: "#4caf50",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                  padding: "0",
                },
              }}
            >
              <MenuItem
                onClick={handleCloseMenu}
                sx={{
                  padding: "0.8rem 1rem",
                  "&:hover": {
                    backgroundColor: "#ff5722",
                    color: "#fff",
                  },
                  borderRadius: "8px",
                }}
              >
                <ListItemIcon sx={{ color: "#fff" }}>
                  <FaUserCircle />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  padding: "0.8rem 1rem",
                  "&:hover": {
                    backgroundColor: "#ff5722",
                    color: "#fff",
                  },
                  borderRadius: "8px",
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

        <div style={{ marginTop: "60px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};