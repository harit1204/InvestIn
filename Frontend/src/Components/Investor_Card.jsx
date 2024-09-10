import React, { useState, useContext, useEffect } from "react";
import "../Elements/Card.css";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { BsCalendar4 } from "react-icons/bs";
import axios from "axios";
import { Connect_Request_Data, User_data } from "./Dashboard";

const Investor_Card = ({ investor }) => {
  const [id_Array, setId_Array] = useState([]);
  const [id_Array_pending, setId_Array_pending] = useState([]);
  const [filteredData, setFiltered_Data] = useState([]);
  const [filteredData_pending, setFiltered_Data_pending] = useState([]);
  const { pending_data } = useContext(Connect_Request_Data);
  const { friends, setFriends } = useContext(Connect_Request_Data);
  const { user_data } = useContext(User_data);
  const req_data = {
    sender_id: "",
    receiver_id: "",
    req_status: "pending",
  };

  console.log(pending_data);
  const [isConnectClicked, setIsConnectClicked] = useState(false);
  const handleInvestorCard = (id) => {
    console.log(id);
    if (Object.keys(user_data).length >= 17) {
      req_data.sender_id = user_data.business_id;
    } else {
      req_data.sender_id = user_data.investor_id;
    }
    req_data.receiver_id = id;
    setIsConnectClicked(true);
    const access_token = localStorage.getItem("access_token");
    axios
      .post("http://127.0.0.1:5000/connect-request", req_data, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    const filter_data1 = () => {
      const new_data = friends.filter((item) => {
        return item.receiver_id[0] != "B";
      });
      setFiltered_Data(new_data);
    };
    if (friends) {
        filter_data1();
    }
    const filter_data1_pending = () => {
      const new_data = pending_data.filter((item) => {
        return item.receiver_id[0] == "B" || item.receiver_id[0] == "I";
      });
      setFiltered_Data_pending(new_data);
    };
    if (pending_data) {
        filter_data1_pending();
    }
  }, []);

  useEffect(() => {
    const business_id_array1 = () => {
      let new_id_array = [];
      filteredData.map((item) => {
        new_id_array.push(item.receiver_id);
      });
      console.log("id array", new_id_array);
      setId_Array(new_id_array);
    };
    const business_id_array1_pending = () => {
      let new_id_array_pending = [];
      filteredData_pending.map((item) => {
        new_id_array_pending.push(item.receiver_id);
      });
      console.log("pending", new_id_array_pending);
      setId_Array_pending(new_id_array_pending);
    };

    business_id_array1();
    business_id_array1_pending();
  }, [filteredData, pending_data, isConnectClicked]);
  
  return (
    <>
      <div className="card">
        <div className="upper-card">
          <div className="name-wrapper">
            <div className="name">{investor.investor_name}</div>
          </div>
          <div className="location-wrapper">
            <div className="location">{investor.investor_location}</div>
          </div>
          <div className="description">
            <span>{investor.investor_desc}</span>
          </div>
          <div className="details-wrapper">
            <div className="revenue">
              <LiaRupeeSignSolid size={20} /> {investor.investor_income}
            </div>
            <div className="year">
              <BsCalendar4 size={18} />
              5-7 years
            </div>
          </div>
          <div className="view-btn">
            {id_Array.includes(investor.investor_id) ? (
              <button
                className="connect friends"
                onClick={() => handleInvestorCard(investor.investor_id)}
                disabled
              >
                Friends
              </button>
            ) : (
              <button
                className={
                  id_Array_pending.includes(investor.investor_id) ||
                  isConnectClicked
                    ? "sent"
                    : "connect"
                }
                onClick={() => handleInvestorCard(investor.investor_id)}
                disabled={id_Array_pending.includes(investor.investor_id)}
              >
                {id_Array_pending.includes(investor.investor_id) ||
                isConnectClicked
                  ? "Sent"
                  : "Connect"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Investor_Card;
