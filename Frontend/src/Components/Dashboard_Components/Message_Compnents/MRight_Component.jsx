import React, { useContext, useEffect } from "react";
import "../../../Elements/Message.css";
import { AiOutlineSend } from "react-icons/ai";
import { Active_ChatID, Messages } from "../Message";
import { Connect_Request_Data } from "../../Dashboard";
import { useState } from "react";
import io from "socket.io-client";
import { User_data } from "../../../App";
import axios from "axios";

const MRight_Component = () => {
  const [msgdata, setMsgData] = useState("");
  const { fetchedMessages, setFetchedMessages } = useContext(Messages);
  const [user_id_, setUser_id_] = useState("");
  const [specificdata, setSpecificData] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [Active_data, setActiveData] = useState([]);
  const { id } = useContext(Active_ChatID);
  const { friends } = useContext(Connect_Request_Data);
  const socket = io("http://127.0.0.1:5000/");
  const { user_data } = useContext(User_data);

  useEffect(() => {
    const filtered_data = friends.filter((friend) => {
      return friend.receiver_id == id;
    });

    setActiveData(filtered_data);
  }, [id]);



  useEffect(() => {
    const user_id = `${
      Object.keys(user_data).length >= 17
        ? user_data.business_id
        : user_data.investor_id
    }`;
    setUser_id_(user_id);

    
  }, []);

  useEffect(()=>{
    setMessages(fetchedMessages)
  },[fetchedMessages])




  const handleSendMessage = () => {
    socket.emit("send_message", {
      sender_id: `${
        Object.keys(user_data).length >= 17
          ? user_data.business_id
          : user_data.investor_id
      }`,
      receiver_id: id,
      message_text: message,
    });
    setMessage("");

    const timer = setInterval(() => {
      const access_token = localStorage.getItem("access_token");
      axios
        .get("http://127.0.0.1:5000/get-chat-history", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then((response) => setMessages(response.data.data))
        .catch((err) => console.log(err));
    }, 4000);
  };

  // useEffect(()=>{
  //   setMessages(fetchedMessages)
  // },[fetchedMessages])

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("hi this is data = ", data);
      setMessages([...messages,data])
    });
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  }, [socket]);

  console.log('Messages ', messages);



  useEffect(() => {
    const specific_data = messages.filter((message) => {
      return (
        (message.receiver_id === id && message.sender_id === user_id_) ||
        (message.receiver_id === user_id_ && message.sender_id === id)
      );
    });

    console.log('specific ',specific_data);
    setSpecificData(specific_data);
  }, [messages, id]);

  return (
    <div className="right-wrapper">
      <div className="right-top">
        <div className="name-section">
          <div className="name">
            {Active_data.length > 0 && Active_data[0].name}
          </div>
          <div className="username">
            @{Active_data.length > 0 && Active_data[0].username}
          </div>
        </div>
        <div className="">i</div>
      </div>
      <div className="right-messages">
        {specificdata.length > 0 &&
          specificdata.map((msg, index) => {
            // console.log('inside map');
            return (
              <div key={index}>
                {msg.sender_id === user_id_ || msg.receiver_id !== user_id_ ? (
                  <>
                    <div className="sender-msg">
                      <span>{msg.message_text}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="receiver-msg">
                      <span>{msg.message_text}</span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
      </div>
      <div className="right-bottom">
        <input
          type="text"
          placeholder="Start a new Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="send-icon">
          <AiOutlineSend onClick={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default MRight_Component;
