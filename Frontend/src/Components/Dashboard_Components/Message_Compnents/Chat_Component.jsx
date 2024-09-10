import axios from 'axios'
import React, { useContext } from 'react'
import '../../../Elements/Chat_Component.css'
import { Active_ChatID, Messages } from '../Message'

const Chat_Component = ({friend}) => {
  const {setFetchedMessages}=useContext(Messages)
  const {setId} = useContext(Active_ChatID)

  const handleId = (id) => {
    setId(id)
    const access_token = localStorage.getItem('access_token')
    axios.get('http://127.0.0.1:5000/get-chat-history',{headers : {
      Authorization : `Bearer ${access_token}`
    }}) 
    .then(response=>{setFetchedMessages(response.data.data)
      console.log(response.data.data);
    }).catch((err)=>console.log(err))
  }
  return (
    <div className='chat-wrapper' onClick={()=>handleId(friend.receiver_id)}>
        <div className='img-wrapper'>
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAG1BMVEX///8AAABKSkpPT09jY2NTU1Px8fFHR0cXFxeR8c79AAABKklEQVR4nO3dy40CQQBDQXo+DPlHvDfuYLUH9VYFYOlF4McDAAAAAAAAAACANT2Pa/sF1/GcVHiMX3FMKrzuDnu7JhVuY7zO/W7na4xtXuE5afoT59TCfdL0J3aF31NYojCgsERhQGGJwoDCEoUBhSUKAwpLFAYUligMKCxRGFBYojCgsERhQGGJwoDCEoUBhSUKAwpLFAYUligMKCxRGFBYojCgsERhQGGJwoDCEoUBhSUKAwpLFAYUligMKCxRGFBYojCgsERhQGGJwoDCEoUBhSUKAwpLFAYUligMKCxRGFBYojCgsERhQGGJwoDCEoUBhSUKAwpLFAYUligMKCxRGFBYojCgsERh4F8Urv9hufgP6fpfsuv/Aa//6QwAAAAAAAAAAMDd/gDVJg8l3o03KQAAAABJRU5ErkJggg==" alt="" />
        </div>
        <div className='chat-title'>
            <div className='name-section'>
            <div className='name'>{friend.name}</div>
            <div className='username'>@{friend.username}</div>
            </div>
            <div className='sub-title'>Tap to Chat</div>
        </div>
    </div>
  )
}

export default Chat_Component