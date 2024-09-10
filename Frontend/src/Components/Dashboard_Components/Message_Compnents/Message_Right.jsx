import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import io from 'socket.io-client';
import { User_data } from '../../../App';
import { Active_ChatID } from '../Message';
import { AiOutlineSend } from 'react-icons/ai';
import { Connect_Request_Data } from '../../Dashboard';

const Message_Right = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const { friends } = useContext(Connect_Request_Data);

  const [Active_data, setActiveData] = useState([]);
  const { user_data } = useContext(User_data);
  const [userId, setUserId] = useState('');
  const { id } = useContext(Active_ChatID);
  const socket = io('http://127.0.0.1:5000');

  useEffect(() => {
    const filtered_data = friends.filter((friend) => {
      return friend.receiver_id === id;
    });

    setActiveData(filtered_data);
  }, [id]);

  useEffect(() => {
    if (id !== 0) {
      socket.emit('start_chat', { sender_id: userId, receiver_id: id });
    }
  }, [id]);

  const handleSendMessage = () => {
    const data = {
      sender_id: `${
        Object.keys(user_data).length >= 17
          ? user_data.business_id
          : user_data.investor_id
      }`,
      receiver_id: id,
      message_text: message,
    };

    socket.emit('send_message', data);
    setMessage('');
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log('received data', data);

      setMessages([...messages, data]);
      // if (data.sender_id !== userId) {
      //   // Only add the received message to the state if it's not sent by the user
      // }
    });

    console.log(messages);

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }, [socket, userId, messages]);

  useEffect(() => {
    const user_id = `${
      Object.keys(user_data).length >= 17
        ? user_data.business_id
        : user_data.investor_id
    }`;
    setUserId(user_id);
  }, []);

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
        <ul>
          {messages.map((msg, index) => (
            <div key={index}>
            
            
                  <>
                    <div className="sender-msg">
                      <span>{msg.message_text}</span>
                    </div>
                  </>
               
                
          </div>
          ))}
        </ul>
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

export default Message_Right;
