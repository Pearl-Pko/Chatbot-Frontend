import React, {useEffect, useState} from "react";
import UserInput from "./UserInput";
import ChatHistory from "./ChatHistory";

export const Speaker = {
    AI: "AI",
    User: "USER",
};
class Chat {
    constructor(message, speaker) {
        this.speaker = speaker;
        this.message = message;
        this.timestamp = new Date();
    }
}

export default function App() {
    const [messages, setMessages] = useState([]);

    const onSendMessage = (message) => {
        setMessages((prevMessages) => [new Chat(message, Speaker.User), ...prevMessages]);
        
        fetch("/api/get-response", {
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
