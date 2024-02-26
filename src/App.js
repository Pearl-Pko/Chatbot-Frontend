import React, {useState} from "react";
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
        setMessages([
            new Chat("Goo", Speaker.AI),
            new Chat(message, Speaker.User),
            ...messages,
           
        ]);
    };

    return (
        <div className="flex bg-background w-screen h-screen justify-center px-6 ">
            <div className="flex flex-col justify-end flex-1 max-w-screen-md">
                <ChatHistory messages={messages} />
                <UserInput onSendMessage={onSendMessage} />
            </div>
        </div>
    );
}
