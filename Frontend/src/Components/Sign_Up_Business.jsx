import axios from "axios";
import React from "react";
import { useContext, useState } from "react";
import { Data_context } from "../App";
import "../Elements/Sign_Up_Business.css";
import Input_Field from "./Input_Field";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Sign_Up_Business = () => {

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
  const { business_data } = useContext(Data_context);
  const handle_business_submit = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/register_business", business_data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.data) {
        localStorage.removeItem('access_token');
        handleSnackbarOpen("Signup successful!", "success");
        window.location.href = '/';
      } else {
        handleSnackbarOpen("Signup failed. Please try again.", "error");
      }
    } catch (error) {
      handleSnackbarOpen("An error occurred. Please try again later.", "error");
      console.error(error);
    }
  };
  

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
          <span>Sign Up as Business Man</span>
        </div>

        <div className="form">
          <div className="about">
            <div className="about-heading">
              <span className="about-title">About</span>
              <span className="about-subtitle">
                Tell us about yourself so startups know who you are.
              </span>
            </div>

            <div className="about-details">
              <Input_Field
                field_classname="owner_username"
                field_type="text"
                field_id="owner_username"
                field_name="owner_username"
                field_label="Your Username"
                page_type="business"
              />
              <Input_Field
                field_classname="owner_password"
                field_type="password"
                field_id="owner_password"
                field_name="owner_password"
                field_label="Password"
                page_type="business"
              />
              <Input_Field
                field_classname="owner_name"
                field_type="text"
                field_id="owner_name"
                field_name="owner_name"
                field_label="Name"
                page_type="business"
              />
              <Input_Field
                field_classname="owner_email"
                field_type="email"
                field_id="owner_email"
                field_name="owner_email"
                field_label="Email"
                page_type="business"
              />
              <Input_Field
                field_classname="owner_location"
                field_type="text"
                field_id="owner_location"
                field_name="owner_location"
                field_label="Location"
                page_type="business"
              />
              <Input_Field
                field_classname="owner_phone"
                field_type="phone"
                field_id="owner_phone_no"
                field_name="owner_phone"
                field_label="Phone Number"
                page_type="business"
              />
              <Input_Field
                field_classname="business_adhaar_no"
                field_type="text"
                field_id="owner_adhaar_no"
                field_name="business_name"
                field_label="Adhaar Number"
                page_type="business"
              />

              {/* <Input_Field  field_classname ="owner-username" field_type="text"  field_id ="owner-username"  field_name="owner-name"  field_label="Your Username"  /> */}
              {/* <div className="owner-password"></div>
                <div className="owner-name"></div>
                <div className="owner-email"></div>
                <div className="owner-location"></div>
                <div className="owner-phone"></div> */}
            </div>
          </div>
          <div className="about-business">
            <div className="business-heading">
              <span className="business-title">Business</span>
              <span className="business-subtitle">
                This will help startups hone in on your strengths.
              </span>
            </div>
            <div className="business-details">
              <Input_Field
                field_classname="business_name"
                field_type="text"
                field_id="business_name"
                field_name="business_name"
                field_label="Business Name"
                page_type="business"
              />
              <Input_Field
                field_classname="business_cat"
                field_type="text"
                field_id="business_category"
                field_name="business_cat"
                field_label="Business Category"
                page_type="business"
              />
              <Input_Field
                field_classname="business_location"
                field_type="text"
                field_id="business_location"
                field_name="business_location"
                field_label="Business Location"
                page_type="business"
              />
              <Input_Field
                field_classname="business_revenue"
                field_type="text"
                field_id="business_revenue_6"
                field_name="business_revenue"
                field_label="Business Revenue"
                page_type="business"
              />
                <Input_Field
                field_classname="business_revenue"
                field_type="text"
                field_id="business_revenue_5"
                field_name="business_revenue"
                field_label="Business Revenue"
                page_type="business"
              />
                <Input_Field
                field_classname="business_revenue"
                field_type="text"
                field_id="business_revenue_4"
                field_name="business_revenue"
                field_label="Business Revenue"
                page_type="business"
              />
                <Input_Field
                field_classname="business_revenue"
                field_type="text"
                field_id="business_revenue_3"
                field_name="business_revenue"
                field_label="Business Revenue"
                page_type="business"
              />
                <Input_Field
                field_classname="business_revenue"
                field_type="text"
                field_id="business_revenue_2"
                field_name="business_revenue"
                field_label="Business Revenue"
                page_type="business"
              />
                <Input_Field
                field_classname="business_revenue"
                field_type="text"
                field_id="business_revenue_1"
                field_name="business_revenue"
                field_label="Business Revenue"
                page_type="business"
              />

              <Input_Field
                field_classname="business_desc"
                field_type="text"
                field_id="business_desc"
                field_name="business_desc"
                field_label="Business Description"
                page_type="business"
              />
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
                field_id="business_website"
                field_type="text"
                field_label="Website"
                field_name="website"
                page_type="business"
              />
              <Input_Field
                field_classname="LinkedIn"
                field_id="business_linkedIn"
                field_type="text"
                field_label="LinkedIn"
                field_name="linkedIn"
                page_type="business"
              />
              <Input_Field
                field_classname="Twitter"
                field_id="business_twitter"
                field_type="text"
                field_label="Twitter"
                field_name="twitter"
                page_type="business"
              />
              <Input_Field
                field_classname="Instagram"
                field_id="business_instagram"
                field_type="text"
                field_label="Instagram"
                field_name="instagram"
                page_type="business"
              />
            </div>
          </div>
          <div className="business-submit-btn">
            <button
              type="submit"
              onClick={() => handle_business_submit()}
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

export default Sign_Up_Business;