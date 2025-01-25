import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaEnvelope, FaLock } from "react-icons/fa"; // Importing icons
import styles from "./Login.module.css";
import { Navigate, useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate();
    // const handelLoign=()=>{
    //     Navigate("/dashboard")
    // }
  const handleSubmit = (e) => {
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

    // Simulate successful login
    MySwal.fire({
      icon: "success",
      title: "Login Successful!",
      text: `Welcome back, ${email.split("@")[0]}!`,
    });
    navigate("/")
    // Reset form fields (optional)
    setEmail("");
    setPassword("");
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Login</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
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
            <label htmlFor="password" className={styles.label}>Password</label>
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
          <button type="submit" className={styles.loginButton} onClick={()=>handelLoign()}>Login</button>
          <a href="/forgot-password" className={styles.forgotPassword}>
            Forgot Password?
          </a>
        </form>
      </div>
    </div>
  );
};

export default Login;
