import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa"; // Importing icons
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../../../feathers/Auth/AuthActions";

const MySwal = withReactContent(Swal);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const loading = useSelector((state) => state.auth.loading);
  const success = useSelector((state) => state.auth.success);
  const error = useSelector((state) => state.auth.error);

  // Handle login success and error messages
  useEffect(() => {
    if (success) {
      MySwal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `Welcome back, ${email.split("@")[0]}!`,
      }).then(() => {
        navigate("/departments"); // Navigate to "/departments" after successful login
      });
    }

    if (error) {
      MySwal.fire({
        icon: "error",
        title: "Login Failed",
        text:"Invalid email or password.",
      });
    }
  }, [success, error, navigate, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form (example logic)
    if (!email || !password) {
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all fields!",
      });
      return;
    }

    // Dispatch the checkAuth action
    dispatch(checkAuth({ email, password }));
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Login</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <div className={styles.inputWrapper}>
              <FaEnvelope className={styles.icon} />
              <input
                type="email"
                id="email"
                className={styles.input}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrapper}>
              <FaLock className={styles.icon} />
              <input
                type="password"
                id="password"
                className={styles.input}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <FaSpinner className={styles.spinner} /> // Show spinner while loading
            ) : (
              "Login" // Show "Login" text when not loading
            )}
          </button>
          <a href="/forgot-password" className={styles.forgotPassword}>
            Forgot Password?
          </a>
        </form>
      </div>
    </div>
  );
};

export default Login;