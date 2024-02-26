import React, {useState} from 'react'
import SendIcon from '@mui/icons-material/Send';
import { Icon, IconButton } from '@mui/material';
import "./UserInput.css"

export default function UserInput({onSendMessage}) {
    const [message, setMessage] = useState('');

    const handleInputChange = (event) => {
      setMessage(event.target.value);
    };
  
    return (
        <div className='flex justify-center gap-2 my-5'>
       {/* <div className="fixed bottom-5 w-full flex justify-center gap-2"> */}
        {/* Input field */}
        <input
            className='bg-transparent border rounded-full flex-1 px-3 py-2 outline-none border-gray-500 text-white focus:border-white'
          type="text"
          value={message}  
          onChange={handleInputChange}  // Handling input changes
          placeholder="Enter text..." // Placeholder text
        />
        {/* <IconButton className='bg-white'> */}
        <button className='send-button' onClick={() => onSendMessage(message)}>
            <SendIcon/>
        </button>

        {/* </IconButton> */}
        {/* <button>Send</button> */}
      </div>
    );
}
