import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Business_ClickedId } from "./Dashboard";

const BusinessGraphs = () => {
  const { business_clickedId } = useContext(Business_ClickedId);
  const [link, setLink] = useState("");

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    axios
      .get("http://127.0.0.1:5000/business_graph", {
        params: { card_id: business_clickedId },
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((response) => {
        // Set the 'link' state with the received Base64 image data
        setLink(response.data);
        console.log(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="graphs">
      {link && (
        <>
          <div className="line">
            <img
              src={`data:image/png;base64,${link.base64_image_line}`}
              alt="Business Graph"
            />
          </div>
          <div className="pie">
            <img
              src={`data:image/png;base64,${link.base64_image_pie}`}
              alt="Business Graph"
            />
          </div>
          <div className="bar">
            <img
              src={`data:image/png;base64,${link.base64_image_bar}`}
              alt="Business Graph"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BusinessGraphs;
