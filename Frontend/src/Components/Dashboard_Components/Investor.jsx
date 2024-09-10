import React, { useContext } from "react";
import { All_Data } from "../../App";
import Card from "../Business_Card";
import Investor_Card from "../Investor_Card";

const Investor = () => {
  const {all_investors} = useContext(All_Data)
  console.log(all_investors);
  return (
    <>
      <div>
        <div className="card-wrapper">
           {all_investors.data && all_investors.data.map((investor,index)=>{ return(
            <Investor_Card investor={investor} key={index}/>
          )
          })}
       
        </div>
      </div>
    </>
  );
};

export default Investor;
