import axios from "axios";
import React,{createContext, useEffect, useState} from "react";
import '../../Elements/Dashboard.css'
import MLeft_Component from "./Message_Compnents/MLeft_Component";
import MRight_Component from "./Message_Compnents/MRight_Component";
import '../../Elements/Message.css'
import Divider from '@mui/joy/Divider';
import Message_Right from "./Message_Compnents/Message_Right";


export const Active_ChatID  = createContext(0)
export const Messages  = createContext("")

const Message = () => {
  const [fetchedMessages,setFetchedMessages] = useState([])
  const [id,setId] = useState(0)

  console.log(id);

  return (
    <>
    <Messages.Provider value={{fetchedMessages,setFetchedMessages}}>
    <Active_ChatID.Provider value={{id,setId}}>
      <div className="message-wrapper">
      {/* <Divider orientation="vertical" /> */}
        <div className="message-left">
          <MLeft_Component />
        </div>
        <Divider orientation="vertical" />
        <div className="message-right">
          <MRight_Component />
        </div>
      </div>
      </Active_ChatID.Provider>
      </Messages.Provider>
    </>
  );
};

export default Message;
