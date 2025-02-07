import React, { useState } from 'react'
import "./logStyle.css"
import SignUpForm from './SignUp';
import Login from './Login';

export const Log = () => {
    const [type, setType] = useState("signIn");
    const handleOnClick = text => {
      if (text !== type) {
        setType(text);
        return;
      }
    };
    const containerClass =
      "container " + (type === "signUp" ? "right-panel-active" : "");
    return (
      <div className="All__App">
        <h2 className="signinup__header">Authentication to our System!</h2>
        <div className={containerClass} id="container">
          <SignUpForm />
          <Login />
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <p className="sub__header">
                  To keep connected with us please login with your personal info
                </p>
                <button
                  className="ghost"
                  id="signIn"
                  onClick={() => handleOnClick("signIn")}
                >
                  Sign In
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Hello, Friend!</h1>
                <p>Enter your personal details and start journey with us</p>
                <button
                  className="ghost "
                  id="signUp"
                  onClick={() => handleOnClick("signUp")}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
