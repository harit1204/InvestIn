import React, { useState } from "react";
import { useContext } from "react";
import { Connect_Request_Data } from "../../Dashboard";
import { Active_ChatID } from "../Message";
import Chat_Component from "./Chat_Component";

const MLeft_Component = () => {
    const {id,setId} = useContext(Active_ChatID)
  const { friends } = useContext(Connect_Request_Data);
  console.log(friends);

  

  return (
    <>
      <div className="left-wrapper">
        <div className="left-top">
          <div className="message-title">Messages</div>
          <div className="message-icon">X</div>
        </div>
        <div className="search-bar">
          {/* Search Icon */}
          <input type="text" placeholder="Search your Friend" />
        </div>
        <div className="chats">
          {friends.map((friend,index) => {return (
            <Chat_Component friend={friend} key={index} />
          )})}
        </div>
      </div>
    </>
  );
};

export default MLeft_Component;
