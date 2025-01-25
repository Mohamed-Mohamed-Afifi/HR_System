import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#388e3c", // Bright accent color (Orange)
    },
    background: {
      default: "#4caf50", // Dark background for overall app
      paper: "#121212", // Sidebar background darker than the body
    },
    text: {
      primary: "#ffffff", // White text for contrast
      secondary: "#b0bec5", // Soft gray for inactive text
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif", // Changed to Poppins font
    fontSize: 14,
    button: {
      textTransform: "none", // Avoid uppercase on buttons
    },
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#1e1e1e", // Darker sidebar background
          color: "#ffffff", // Text color
          width: "250px", // Fixed width
          borderRight: "none", // Remove border
          overflowX: "hidden", // Prevent horizontal scroll
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: "0.5rem 1rem", // Small padding for compact design
          width: "100%", // Links span full width
          display: "block", // Block-level display
          "&:hover": {
            backgroundColor: "#4b9738", // Shaded hover effect
            transition: "background-color 0.3s ease", // Smooth transition
          },
          "&.Mui-selected": {
            backgroundColor: "#ff5722", // Active link color (primary color)
            color: "#ffffff", // Text color for active link
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "#ffffff", // White icons for contrast
          minWidth: "40px", // Adjust icon spacing
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: "1rem", // Modern, readable font size
          fontWeight: 500,
          color: "#ffffff", // White text color for links
          "&.Mui-selected": {
            color: "#ffffff", // Ensure selected link text stays white
          },
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e", // Dark background for toolbar
          color: "#ffffff", // White text for toolbar
          padding: "0.5rem 1rem",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent", // Transparent background for inputs
          borderRadius: "12px",
          "& .MuiOutlinedInput-root": {
            borderColor: "#b0bec5", // Soft gray border for inputs
          },
          "& .MuiInputAdornment-root": {
            color: "#b0bec5", // Light gray icon color
          },
        },
      },
    },
  },
});

export default theme;