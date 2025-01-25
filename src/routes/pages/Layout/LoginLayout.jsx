import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./DashLayout.module.css"
const LoginLayout = () => {
  return (
    <>
    <div className={styles.container}>
        <Outlet />
    </div>
    </>
  );
};


export default LoginLayout;
