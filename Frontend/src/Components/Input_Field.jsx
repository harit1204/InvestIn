import React, { useContext } from "react";
import { Data_context } from "../App";
import "../Elements/Input_Field.css";

const Input_Field = ({
  field_classname,
  field_type,
  field_id,
  field_name,
  field_label,
  page_type,
}) => {
  const { business_data, setBusinessData } = useContext(Data_context);
  const { investor_data, setInvestorData } = useContext(Data_context);

  const handleInput = (e, page_type) => {
    if (page_type === "business") {
      const new_business_data = { ...business_data };
      new_business_data[e.target.id] = e.target.value;
      setBusinessData(new_business_data);
    } else {
      const new_investor_data = { ...investor_data };
      new_investor_data[e.target.id] = e.target.value
      setInvestorData(new_investor_data);
    }
  };

  return (
    <>
      <div className={field_classname} id="field" name={page_type}>
        <label htmlFor="">{field_label}</label>
        <input
          type={field_type}
          id={field_id}
          name={field_name}
          required
          autoComplete="off"
          placeholder={field_label}
          onChange={(e) => handleInput(e,page_type)}
        />
      </div>
    </>
  );
};

export default Input_Field;
