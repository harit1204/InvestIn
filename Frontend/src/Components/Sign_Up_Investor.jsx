import axios from "axios";
import React, { useContext, useState } from "react";
import { Data_context } from "../App";
import "../Elements/Sign_Up_Business.css";
import Input_Field from "./Input_Field";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Sign_Up_Investor = () => {

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
  const {investor_data} = useContext(Data_context)
  const handle_investor_submit = async () => {

    try{
      const response = await axios.post("http://127.0.0.1:5000/register_investor", investor_data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    // window.location.href='/dashboard'
    if(response.data){
      localStorage.removeItem('access_token')
      handleSnackbarOpen("Signup successful!", "success");
      window.location.href= '/'
    }
    else {
      handleSnackbarOpen("Signup failed. Please try again.", "error");
    }
    }
    catch (error) {
      handleSnackbarOpen("An error occurred. Please try again later.", "error");
      console.error(error);
    }
  }

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
  
    setOpenSnackbar(false);
  };  

  return (
    <>
      <div className="form-wrapper">
        <div className="form-title">
          <span>Sign Up as Investor </span>
        </div>
        <div className="form-subtitle">
          <span></span>
        </div>
        <div className="form">
          <div className="about">
            <div className="about-heading">
              <span className="about-title">About</span>
              <span className="about-subtitle">
                This will help startups hone in on your strengths.
              </span>
            </div>
            <div className="about-details">
              <Input_Field
                field_classname="investor_username"
                field_type="text"
                field_id="investor_username"
                field_name="investor_username"
                field_label="Your Username"
                page_type="investor"
              />
              <Input_Field
                field_classname="investor_password"
                field_type="password"
                field_id="investor_password"
                field_name="investor_password"
                field_label="Password"
                page_type="investor"
              />
              <Input_Field
                field_classname="investor_name"
                field_type="text"
                field_id="investor_name"
                field_name="investor_name"
                field_label="Name"
                page_type="investor"
              />
              <Input_Field
                field_classname="investor_email"
                field_type="email"
                field_id="investor_email"
                field_name="investor_email"
                field_label="Email"
                page_type="investor"
              />
              <Input_Field
                field_classname="investor_location"
                field_type="text"
                field_id="investor_location"
                field_name="investor_location"
                field_label="Location"
                page_type="investor"
              />
              <Input_Field
                field_classname="investor_phone"
                field_type="phone"
                field_id="investor_phone_no"
                field_name="investor_phone"
                field_label="Phone Number"
                page_type="investor"
              />
              <Input_Field
                field_classname="investor_adhaar-no"
                field_type="text"
                field_id="investor_adhaar_no"
                field_name="investor_name"
                field_label="Adhaar Number"
                page_type="investor"
              />
              <Input_Field
                field_classname="investor_income"
                field_type="text"
                field_id="investor_income"
                field_name="investor_income"
                field_label="Investor Income"
                page_type="investor"
              />
              {/* <Input_Field  field_classname ="investor-username" field_type="text"  field_id ="investor-username"  field_name="investor-name"  field_label="Your Username"  /> */}
              {/* <div className="investor-password"></div>
                <div className="investor-name"></div>
                <div className="investor-email"></div>
                <div className="investor-location"></div>
                <div className="investor-phone"></div> */}
            </div>
          </div>
          <div className="social-profiles">
            <div className="social-heading">
              <span className="social-title">Social Profiles</span>
              <span className="social-subtitle">
                Where can people find you online?
              </span>
            </div>
            <div className="social-details">
              <Input_Field
                field_classname="website"
                field_id="investor_website"
                field_type="text"
                field_label="Website"
                field_name="website"
                page_type="investor"
              />
              <Input_Field
                field_classname="LinkedIn"
                field_id="investor_linkedIn"
                field_type="text"
                field_label="LinkedIn"
                field_name="linkedIn"
                page_type="investor"
              />
              <Input_Field
                field_classname="Twitter"
                field_id="investor_twitter"
                field_type="text"
                field_label="Twitter"
                field_name="twitter"
                page_type="investor"
              />
              <Input_Field
                field_classname="Instagram"
                field_id="investor_instagram"
                field_type="text"
                field_label="Instagram"
                field_name="instagram"
                page_type="investor"
              />
            </div>
          </div>
          <div className="investor-submit-btn">
            <button
              type="submit"
              onClick={()=>handle_investor_submit()}
              // onClick={() => (window.location.href = "/dashboard")}
            >
              Submit
            </button>
          </div>
          <Snackbar
              open={openSnackbar}
              autoHideDuration={6000} // Adjust the duration as needed
              onClose={handleSnackbarClose}
          >
              <Alert severity={snackbarSeverity} variant="filled">
                {snackbarMessage}
              </Alert>
          </Snackbar>
        </div>
      </div>
    </>
  );
};

export default Sign_Up_Investor;