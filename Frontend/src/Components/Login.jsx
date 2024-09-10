import axios from "axios";
import { React, useContext, useRef, useEffect, useState } from "react";
import { Access_token, Login_context } from "../App";
import "../Elements/Login.css";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Alert from "@mui/material/Alert";




const Login = () => {
  const [open,setOpen] = useState(false)
  const { isLoggedIn, setIsLoggedIn } = useContext(Access_token);
  const [login_data, setLoginData] = useState({
    username: "",
    password: "",


  });

  

  const { isLoginClicked, setIsLoginClicked } = useContext(Login_context);
  const loginForm = useRef();

  const handleLoginForm = (e) => {
    if (e.target.classList.value === "login-form-popup") {
      setIsLoginClicked(false);
    } else {
      setIsLoginClicked(true);
    }
  };

  const handleLoginInput = (e) => {
    const new_login_data = { ...login_data };
    new_login_data[e.target.id] = e.target.value;
    setLoginData(new_login_data);
  };

  const handleClick =  ()=>{
    setOpen(true)
  }

  const handleClose = (event,reason) => {
    if (reason === 'clickaway')
    {
      return;
    }

    setOpen(false)
  } 

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://127.0.0.1:5000/login", login_data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.data.access_token) {
          localStorage.setItem("access_token", response.data.access_token);
          setIsLoggedIn(true);
          console.log(response.data.access_token);
          window.location.href = '/dashboard'
        }else if(response.data.message){
          console.log(response.data.message);
          handleClick()

        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div
        className="login-form-popup"
        ref={loginForm}
        onClick={handleLoginForm}
      >
        <div className="login-box">
          <form noValidate autoComplete="off">
            <div className="login-title">
              <div className="login">Login</div>
            </div>
            <div className="form-fields">
              <div className="username">
                <input
                  type="text"
                  name="username"
                  id="username"
                  onChange={handleLoginInput}
                  placeholder=""
                />
                <label htmlFor="username">Username</label>
              </div>
              <div className="password">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder=""
                  onChange={handleLoginInput}
                />
                <label htmlFor="password">Password</label>
              </div>
            </div>
            <div className="submit-btn">
              <button onClick={handleLoginSubmit}>Submit</button> 
            </div>
          </form>
        </div>
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Login Failed! Please Check Username and Password!
        </Alert>
      </Snackbar>

      
    </>
  );
};

export default Login;
