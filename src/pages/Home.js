import React, {useEffect, useState} from "react";
import UserInput from "../components/UserInput";
import ChatHistory from "../components/ChatHistory";
import { Chat, Speaker } from "../chat";


export default function Home() {
    const [messages, setMessages] = useState([]);

    const onSendMessage = (message) => {
        setMessages((prevMessages) => [new Chat(message, Speaker.User), ...prevMessages]);
        
        fetch("http://localhost:5000/get-response", {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({message: message}),
        })
            .then((res) => res.json())
            .then((res) => {
                console.log("yes")
                setMessages((prevMessages) => [new Chat(res.response, Speaker.AI), ...prevMessages]);
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        // console.log("rerender");
    })

    return (
        <div className="flex bg-background w-screen h-screen justify-center px-6 ">
            <div className="fixed h-12 w-screen bg-aiMessageBubble flex items-center text-lg justify-center text-white">
                KoFIBot
            </div>
            <div className="flex flex-col justify-end flex-1 max-w-screen-md">
                <ChatHistory messages={messages} />
                <UserInput onSendMessage={onSendMessage} />
            </div>
        </div>
    );
}
