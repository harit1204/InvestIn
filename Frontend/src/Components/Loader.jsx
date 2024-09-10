import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import "../Elements/Loader.css";

const Loader = () => {
  return (
    <>
        <LinearProgress />
        <div className="text-wrapper">
            <div className="text">
          Please wait, We are Calculating your Profile Score.....
          </div>
      </div>
      </>
  );
};

export default Loader;
