  import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Access_token, Login_context, User_data } from "../App";
import "../Elements/HomePage.css";
import Login from "./Login";

const HomePage = () => {
  const { user_data } = useContext(User_data);

  
  console.log(user_data.owner_name);
  const { isLoggedIn, setIsLoggedIn } = useContext(Access_token);
  const [dummyState, setDummyState] = useState("");

  const { isLoginClicked, setIsLoginClicked } = useContext(Login_context);

  const handleLogin = () => {
    setIsLoginClicked(true);
  };

  const handleLogOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("count");
    setIsLoggedIn(false);
  };
  return (
    <div className="homepage-wrapper">
      <div className="home-left">
        <div className="logo">
          {/* <img src="" alt="" /> */}
          <span>Invest_In</span>
        </div>
      </div>
      <div className="home-right">
        <div className="center-div">
          <div className="home-title">Welcome!</div>
          <div className="sign-up">
            <span className="sign-up-title">Join today</span>
            <div className="buttons">
              <button
                className="business-btn"
                onClick={() => {
                  const timeout = setTimeout(() => {
                    window.location.href = "/sign-up-business";
                  }, 500);
                }}
              >
                Sign Up as Businessman
              </button>
              <span className="line"></span>
              <span className="or">or</span>
              <button
                className="investor-btn"
                onClick={() => {
                  const timeout = setTimeout(() => {
                    window.location.href = "/sign-up-investor";
                  }, 500);
                }}
              >
                Sign Up as Investor
              </button>
            </div>
          </div>
          <div className="login">
            <div className="login-title">
              {isLoggedIn 
                ? `Logged In as ${user_data.length >= 17 ? user_data.owner_name : user_data.investor_name}`
                : "Already have an account ?"}
            </div>
            <div className="login-btn">
              <button
                className="sign-in-btn"
                onClick={isLoggedIn ? handleLogOut : handleLogin}
              >
                {isLoggedIn ? "Log out" : "Log In"}
              </button>
              {isLoggedIn && (
                <button
                  className="sign-in-btn"
                  onClick={() => (window.location.href = "/dashboard")}
                >
                  Go to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {isLoginClicked && <Login />}
    </div>
  );
};

export default HomePage;
