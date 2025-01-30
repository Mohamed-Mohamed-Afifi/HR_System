  import React, { useState } from "react";
  import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    InputAdornment,
  } from "@mui/material";
  import { Edit, Lock, Save, Cancel } from "@mui/icons-material";
  import Swal from "sweetalert2";
  import styles from "./Profile.module.css"; // Optional for additional custom styles
  import { useDispatch, useSelector } from "react-redux";
  import { changePasswordHandler } from "../../../feathers/ChangePassword/ChangePassActions";
  import { useNavigate } from "react-router-dom";

  const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.changePassword.loading);
    const success = useSelector((state) => state.changePassword.success);
    const error = useSelector((state) => state.changePassword.error);
    // const [userInfo, setUserInfo] = useState(
    //   localStorage.getItem("userInfo")
    //     ? JSON.parse(localStorage.getItem("userInfo"))
    //     : {}
    // );
    const fullName = localStorage.getItem("fullName");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const userInfo ={fullName,email,role};
    const [user, setUser] = useState(userInfo);


    const [isEditing, setIsEditing] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setUser({ ...user, [name]: value });
    };

    const handleSave = () => {
      setIsEditing(false);
      localStorage.setItem("userInfo", JSON.stringify(user)); // Update localStorage
      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your profile has been successfully updated.",
        confirmButtonColor: "#4caf50",
      });
    };

    const handleChangePassword = () => {
      if (showChangePassword) {
        Swal.fire({
          icon: "warning",
          title: "Cancel Password Change?",
          text: "Are you sure you want to cancel changing your password?",
          showCancelButton: true,
          confirmButtonColor: "#4caf50",
          cancelButtonColor: "#ff5722",
          confirmButtonText: "Yes, cancel it!",
        }).then((result) => {
          if (result.isConfirmed) {
            setShowChangePassword(false);
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
          }
        });
      } else {
        setShowChangePassword(true);
      }
    };

    const validatePassword = (password) => {
      const minLength = 8;
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      return password.length >= minLength && hasSpecialChar;
    };

    const handlePasswordChangeSubmit = async () => {
      if (loading) return;

      if (newPassword !== confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Passwords Do Not Match",
          text: "The new password and confirmation password do not match.",
          confirmButtonColor: "#ff5722",
        });
        return;
      }

      if (!validatePassword(newPassword)) {
        Swal.fire({
          icon: "error",
          title: "Weak Password",
          text: "Password must be at least 8 characters long and contain at least one special character.",
          confirmButtonColor: "#ff5722",
        });
        return;
      }

      const payload = {
        oldPassword,
        newPassword,
        confirmPassword,
      };

      Swal.fire({
        title: "Changing Password...",
        text: "Please wait while we update your password.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        await dispatch(changePasswordHandler(payload));
        Swal.fire({
          icon: "success",
          title: "Password Changed!",
          text: "Your password has been successfully updated.",
          confirmButtonColor: "#4caf50",
        });
        setShowChangePassword(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        navigate("/profile"); // Update navigation as needed
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err.message || "An error occurred while changing the password.",
          confirmButtonColor: "#ff5722",
        });
      }
    };

    return (
      <Box className={styles.profileContainer}>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#4caf50" }}>
            Profile
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Full Name"
              name="fullName"
              value={user.fullName}
              onChange={handleInputChange}
              disabled={!isEditing}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Edit />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Edit />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Role"
              value={user.role}
              disabled
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Edit />
                  </InputAdornment>
                ),
              }}
            />

            {showChangePassword && (
              <>
                <TextField
                  label="Old Password"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 2, marginTop: 3 }}>
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setIsEditing(true)}
                sx={{ backgroundColor: "#4caf50", "&:hover": { backgroundColor: "#388e3c" } }}
              >
                Edit Profile
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{ backgroundColor: "#2196f3", "&:hover": { backgroundColor: "#1976d2" } }}
              >
                Save Changes
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={showChangePassword ? <Cancel /> : <Lock />}
              onClick={handleChangePassword}
              sx={{ backgroundColor: "#ff9800", "&:hover": { backgroundColor: "#f57c00" } }}
            >
              {showChangePassword ? "Cancel Change Password" : "Change Password"}
            </Button>
            {showChangePassword && (
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handlePasswordChangeSubmit}
                disabled={loading}
                sx={{ backgroundColor: "#4caf50", "&:hover": { backgroundColor: "#388e3c" } }}
              >
                {loading ? "Saving..." : "Save New Password"}
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    );
  };

  export default Profile;