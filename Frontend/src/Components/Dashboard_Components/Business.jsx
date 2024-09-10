import React, { useContext } from "react";
import { All_Data } from "../../App";
import Business_Card from "../Business_Card";

const Business = () => {
  const {all_business} = useContext(All_Data)
  console.log(all_business);
  return (
    <div>
      <div className="card-wrapper">
    {all_business.data && all_business.data.map((business,index)=>{return(
        <Business_Card business={business} key={index} />
    )
    })}
     
      </div>
    </div>
  );
};

export default Business;
