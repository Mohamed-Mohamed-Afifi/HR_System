// import React, { useState, useEffect } from "react";
// import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import styles from "./Login.module.css";
// import { checkAuth } from "../../../feathers/Auth/AuthActions";

// const MySwal = withReactContent(Swal);

// const Login = () => {
//   const [credentials, setCredentials] = useState({ email: "", password: "" });
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
  
//   const { loading, success, error, user } = useSelector((state) => ({
//     loading: state.auth.loading,
//     success: state.auth.success,
//     error: state.auth.error,
//     user: state.auth.userInfo
//   }));

//   const showAlert = (icon, title, text) => {
//     MySwal.fire({
//       icon,
//       title,
//       text,
//       showConfirmButton: icon === "success",
//       timer: icon === "success" ? 1500 : undefined
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setCredentials(prev => ({ ...prev, [name]: value }));
//   };

//   const validateForm = () => {
//     const { email, password } = credentials;
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!email || !password) {
//       showAlert("error", "Missing Fields", "Please fill in all required fields");
//       return false;
//     }

//     if (!emailRegex.test(email)) {
//       showAlert("error", "Invalid Email", "Please enter a valid email address");
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     MySwal.fire({
//       title: "Authenticating...",
//       html: "Please wait while we verify your credentials",
//       allowOutsideClick: false,
//       didOpen: () => MySwal.showLoading()
//     });

//     try {
//       await dispatch(checkAuth(credentials)).unwrap();
//     } catch (error) {
//       showAlert("error", "Login Failed", "Invalid credentials");
//     }
//   };

//   useEffect(() => {
//     if (success && user) {
//       showAlert("success", "Login Successful", `Welcome back, ${user.name || user.email.split("@")[0]}!`);
//       navigate("/departments");
//     }
//   }, [success, user, navigate]);

//   return (
//     <div className={styles.loginContainer}>
//       <div className={styles.loginBox}>
//         <h2 className={styles.title}>System Access</h2>
//         <form className={styles.form} onSubmit={handleSubmit}>
//           <div className={styles.inputGroup}>
//             <div className={styles.inputWrapper}>
//               <FaEnvelope className={styles.icon} />
//               <input
//                 type="email"
//                 name="email"
//                 className={styles.input}
//                 placeholder="Enter your email"
//                 value={credentials.email}
//                 onChange={handleInputChange}
//                 autoComplete="username"
//               />
//             </div>
//           </div>

//           <div className={styles.inputGroup}>
//             <div className={styles.inputWrapper}>
//               <FaLock className={styles.icon} />
//               <input
//                 type="password"
//                 name="password"
//                 className={styles.input}
//                 placeholder="Enter your password"
//                 value={credentials.password}
//                 onChange={handleInputChange}
//                 autoComplete="current-password"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className={styles.loginButton}
//             disabled={loading}
//           >
//             {loading ? (
//               <FaSpinner className={styles.spinner} />
//             ) : (
//               "Sign In"
//             )}
//           </button>

//           <div className={styles.secondaryActions}>
//             <a href="/forgot-password" className={styles.forgotPassword}>
//               Forgot your password?
//             </a>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { checkAuth } from "../../../feathers/Auth/AuthActions";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

function Login() {
  const [credentials, setCredentials] = React.useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, success, user } = useSelector((state) => ({
    loading: state.auth.loading,
    success: state.auth.success,
    user: state.auth.userInfo
  }));

  const showAlert = (icon, title, text) => {
    MySwal.fire({
      icon,
      title,
      text,
      showConfirmButton: icon === "success",
      timer: icon === "success" ? 1500 : undefined
    });
  };

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { email, password } = credentials;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      showAlert("error", "Missing Fields", "Please fill in all required fields");
      return false;
    }

    if (!emailRegex.test(email)) {
      showAlert("error", "Invalid Email", "Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!validateForm()) return;

    MySwal.fire({
      title: "Authenticating...",
      html: "Please wait while we verify your credentials",
      allowOutsideClick: false,
      didOpen: () => MySwal.showLoading()
    });

    try {
      await dispatch(checkAuth(credentials)).unwrap();
    } catch (error) {
      showAlert("error", "Login Failed", "Invalid credentials");
    }
  };

  React.useEffect(() => {
    if (success && user) {
      showAlert("success", "Login Successful", `Welcome back, ${user.name || user.email.split("@")[0]}!`);
      // Add your navigation logic here
      navigate("/departments");
    }
  }, [success, user]);

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleSubmit}>
        <h1 className="sign__header">Sign in</h1>
        <div className="social-container">
          <a href="#" className="social">
            <i className="fab fa-facebook-f" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-google-plus-g" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-linkedin-in" />
          </a>
        </div>
        <span>or use your account</span>
        
        <div className="input-wrapper">
          <FaEnvelope className="icon" />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="input-wrapper">
          <FaLock className="icon" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleInputChange}
          />
        </div>

        <a href="#">Forgot your password?</a>
        <button disabled={loading} className="sign__btn">
          {loading ? <FaSpinner className="spinner" /> : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default Login;