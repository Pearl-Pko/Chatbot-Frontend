import React, {useEffect, useState} from "react";
import SendIcon from "@mui/icons-material/Send";
import {Icon, IconButton} from "@mui/material";
import "./UserInput.css";
import clsx from "clsx";

export default function UserInput({onSendMessage, canSend}) {
    const [message, setMessage] = useState("");
    const [sendButtonDisabled, setSendButtonDisabled] = useState(canSend);

    useEffect(() => {
        setSendButtonDisabled(!canSend || message.length === 0)
    }, [canSend, message])


    const handleInputChange = (event) => {
        setMessage(event.target.value);
    };

	const sendMessage = (ev) => {
        ev.preventDefault();
		onSendMessage(message);
		setMessage("");
	}

    return (
        <form className="flex justify-center gap-2 my-5" onSubmit={(ev) => sendMessage(ev)}>
            {/* <div className="fixed bottom-5 w-full flex justify-center gap-2"> */}
            {/* Input field */}
            <input
                className="bg-transparent border rounded-full flex-1 px-3 py-2 outline-none border-gray-500 text-white focus:border-white"
                type="text"
                value={message}
                onChange={handleInputChange} // Handling input changes
                placeholder="Enter text..." // Placeholder text
            />
            {/* <IconButton className='bg-white'> */}
            <button
                type="submit"
                className={clsx("send-button bg-accent", sendButtonDisabled && "opacity-15")}
                disabled={sendButtonDisabled}
            >
                <SendIcon className="text-primary-100"/>
            </button>

            {/* </IconButton> */}
            {/* <button>Send</button> */}
        </form>
    );
}
