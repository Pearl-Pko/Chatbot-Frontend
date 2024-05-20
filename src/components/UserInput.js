import React, {useEffect, useLayoutEffect, useState, useRef} from "react";
import SendIcon from "@mui/icons-material/Send";
import {Icon, IconButton} from "@mui/material";
import "./UserInput.css";
import clsx from "clsx";

export default function UserInput({onSendMessage, canSend, forwardedRef}) {
    const [message, setMessage] = useState("");
    const [sendButtonDisabled, setSendButtonDisabled] = useState(canSend);
    const textAreaRef = useRef(null);

    useEffect(() => {
        setSendButtonDisabled(!canSend || message.length === 0);
    }, [canSend, message]);

    const handleInputChange = (event) => {
        setMessage(event.target.value);
    };

    useLayoutEffect(() => {
        const currentHeight = textAreaRef.current.clientHeight;

        textAreaRef.current.style.height = "auto";
        const newHeight = Math.min(textAreaRef.current.scrollHeight, 150);

        textAreaRef.current.style.height = `${Math.max(
            currentHeight,
            newHeight
        )}px`;
    }, [message]);

    // const handleChange = (event) => {
    //     setValue(event.target.value);
    //     // Auto-expand textarea by setting its height to its scroll height
    //     event.target.style.height = 'auto';
    //     event.target.style.height = event.target.scrollHeight + 'px';
    //   };

    const sendMessage = (ev) => {
        onSendMessage(message);
        setMessage("");
    };

    return (
        <div className="flex w-full justify-center gap-2 my-5 px-6 h-130">
            {/* <div className="fixed bottom-5 w-full flex justify-center gap-2"> */}
            {/* Input field */}
            <textarea
                ref={textAreaRef}
                className="bg-transparent border rounded-xl flex-1 px-3 py-2 resize-none outline-none border-gray-500 text-white focus:border-white"
                type="text"
                style={{overflow: "hidden", resize: "none"}}
                value={message}
                onChange={handleInputChange} // Handling input changes
                placeholder="Enter text..." // Placeholder text
            />
            {/* <IconButton className='bg-white'> */}
            <button
                ref={forwardedRef}
                onClick={() => sendMessage()}
                className={clsx(
                    "send-button self-end bg-accent",
                    sendButtonDisabled && "opacity-15"
                )}
                disabled={sendButtonDisabled}
            >
                <SendIcon className="text-primary-100" />
            </button>

            {/* </IconButton> */}
            {/* <button>Send</button> */}
        </div>
    );
}
