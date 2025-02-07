import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Paper, InputAdornment } from "@mui/material";
import { Edit, Lock, Save, Cancel } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { editSingleUser } from "../../../feathers/Users/UserActions";
import { changePasswordHandler } from "../../../feathers/ChangePassword/ChangePassActions";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading: passwordLoading, error: passwordError } = useSelector((state) => state.changePassword);
  const { loading: userLoading, error: userError } = useSelector((state) => state.users);
  
  // User state initialization
  const getUserFromStorage = () => ({
    fullName: localStorage.getItem("fullName") || "",
    email: localStorage.getItem("email") || "",
    role: localStorage.getItem("role") || "",
    id: localStorage.getItem("userId") || ""
  });

  const [user, setUser] = useState(getUserFromStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await dispatch(editSingleUser(user)).unwrap();
      
      // Update localStorage
      Object.entries(user).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });
      
      setIsEditing(false);
      showSuccessAlert("Profile Updated!", "Your profile has been successfully updated.");
    } catch (error) {
      showErrorAlert("Update Failed", error.message || "Failed to update profile");
    }
  };

  const handlePasswordSubmit = async () => {
    if (passwords.new !== passwords.confirm) {
      showErrorAlert("Password Mismatch", "New password and confirmation do not match");
      return;
    }

    if (!validatePassword(passwords.new)) {
      showErrorAlert("Weak Password", "Must be 8+ characters with a special character");
      return;
    }

    try {
      await dispatch(changePasswordHandler({
        oldPassword: passwords.old,
        newPassword: passwords.new,
        confirmPassword: passwords.confirm
      })).unwrap();

      resetPasswordState();
      showSuccessAlert("Password Changed!", "Your password has been updated successfully");
      navigate("/profile");
    } catch (error) {
      showErrorAlert("Password Change Failed", error.message || "Failed to change password");
    }
  };

  // Helper functions
  const validatePassword = (password) => 
    password.length >= 8 && /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const resetPasswordState = () => {
    setShowChangePassword(false);
    setPasswords({ old: "", new: "", confirm: "" });
  };

  const showSuccessAlert = (title, text) => {
    Swal.fire({ 
      icon: "success", 
      title, 
      text,
      confirmButtonColor: "#4caf50",
    });
  };

  const showErrorAlert = (title, text) => {
    Swal.fire({ 
      icon: "error", 
      title, 
      text,
      confirmButtonColor: "#ff5722",
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#4caf50" }}>
          Profile
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {["fullName", "email", "role"].map((field) => (
            <TextField
              key={field}
              label={field === "fullName" ? "Full Name" : field}
              name={field}
              value={user[field]}
              onChange={handleInputChange}
              disabled={!isEditing || field === "role"}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Edit />
                  </InputAdornment>
                ),
              }}
            />
          ))}

          {showChangePassword && (
            <>
              {["old", "new", "confirm"].map((type) => (
                <TextField
                  key={type}
                  label={`${type.charAt(0).toUpperCase() + type.slice(1)} Password`}
                  type="password"
                  name={type}
                  value={passwords[type]}
                  onChange={handlePasswordChange}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                />
              ))}
            </>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          {!isEditing ? (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setIsEditing(true)}
              sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={userLoading}
              sx={{ bgcolor: "#2196f3", "&:hover": { bgcolor: "#1976d2" } }}
            >
              {userLoading ? "Saving..." : "Save Changes"}
            </Button>
          )}

          <Button
            variant="contained"
            startIcon={showChangePassword ? <Cancel /> : <Lock />}
            onClick={() => setShowChangePassword(!showChangePassword)}
            sx={{ bgcolor: "#ff9800", "&:hover": { bgcolor: "#f57c00" } }}
          >
            {showChangePassword ? "Cancel" : "Change Password"}
          </Button>

          {showChangePassword && (
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handlePasswordSubmit}
              disabled={passwordLoading}
              sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#388e3c" } }}
            >
              {passwordLoading ? "Updating..." : "Save Password"}
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;