import React, { useContext, useEffect } from "react";
import "../Elements/Card.css";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { BsCalendar4 } from "react-icons/bs";
import { useState } from "react";
import { Business_clicked, Business_ClickedId, Connect_Request_Data, User_data } from "./Dashboard";
import axios from "axios";

const Business_Card = ({ business }) => {
  const {setBusinessClickedId} = useContext(Business_ClickedId)
  const {setClickedItem} = useContext(Business_clicked)
  const [idArray, setIdArray] = useState([]);
  const [idArray_pending, setIdArray_pending] = useState([]);
  const [filtered_data, setFilteredData] = useState([]);
  const {pending_data} = useContext(Connect_Request_Data)
  const [filtered_data_pending, setFilteredData_pending] = useState([]);
  const { friends, setFriends } = useContext(Connect_Request_Data);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [isConnectClicked, setIsConnectClicked] = useState(false);
  const { user_data } = useContext(User_data);
  const reqData = {
    sender_id: "",
    receiver_id: "",
    req_status: "pending",
  };

  useEffect(() => {
    const filter_data = () => {
      const new_data = friends.filter((item) => {
        return item.receiver_id[0] != "I";
      });

      setFilteredData(new_data);
    };

    if (friends) {
        filter_data();
    }
    const filter_data_pending = () => {
      const new_data = pending_data.filter((item) => {
        return item.receiver_id[0] == "I" || item.receiver_id[0] == "B";
      });

      setFilteredData_pending(new_data);
    };

    if (pending_data) {
        filter_data_pending();
    }
  }, []);

  useEffect(() => {
    const business_id_array = () => {
      let new_id_array = [];
      filtered_data.map((item) => {
        new_id_array.push(item.receiver_id);
      });
      setIdArray(new_id_array);
    };

    const business_id_array_pending = () => {
      let new_id_array_pending = [];
      filtered_data_pending.map((item) => {
        new_id_array_pending.push(item.receiver_id);
      });
      setIdArray_pending(new_id_array_pending);
    };

    business_id_array();
    business_id_array_pending();
  }, [filtered_data,pending_data,isConnectClicked,buttonClicked]);



  const handleClickBusiness = (id) => {
    console.log(id);
    if (Object.keys(user_data).length >= 17) {
      reqData.sender_id = user_data.business_id;
    } else {
      reqData.sender_id = user_data.investor_id;
    }
    reqData.receiver_id = id;
    setButtonClicked(true);
    const access_token = localStorage.getItem("access_token");
    axios
      .post("http://127.0.0.1:5000/connect-request", reqData, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((response) => console.log(response.data))
      .catch((err) => console.log(err));
  };

  const handleBusinessClicked = (e,id) => {
    console.log(e.target.classList);
    if(e.target.classList.value !== 'connect'){
      setClickedItem('Business Graphs')
      setBusinessClickedId(business.business_id)
      
      
    }
  }

  return (
    <>
      <div className="card" id={business.business_id} onClick={handleBusinessClicked}>
        <div className="upper-card">
          <div className="name-wrapper">
            <div className="name">{business.business_name}</div>
          </div>
          <div className="location-wrapper">
            <div className="location">{business.business_location}</div>
          </div>
          <div className="description">
            <span>{business.business_desc}</span>
          </div>
          <div className="details-wrapper">
            <div className="revenue">
              <LiaRupeeSignSolid size={20} /> {business.business_revenue}
            </div>
            <div className="year">
              <BsCalendar4 size={18} />
              5-7 years
            </div>
          </div>
          <div className="view-btn">
            

            {idArray.includes(business.business_id) ? (
              <button
                className="connect friends"
                onClick={() => handleClickBusiness(business.business_id)}
                disabled
              >
                Friends
                {/* {buttonClicked ? `${isFriend ? "Friends" : "Sent"}` : "Connect"} */}
              </button>
            ) : (
              <button
                className={idArray_pending.includes(business.business_id) || buttonClicked? "sent" : "connect"}
                onClick={() => handleClickBusiness(business.business_id)}
                disabled={idArray_pending.includes(business.business_id)}
              >
                {idArray_pending.includes(business.business_id) || buttonClicked ? "Sent" : "Connect"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Business_Card;
