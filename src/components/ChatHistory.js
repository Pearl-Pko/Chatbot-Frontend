import React from "react";
import ChatMessage from "./ChatMessage";
import {v4 as uuidv4} from "uuid"
import "./ChatHistory.css"

export default function ChatHistory({messages}) {

    
    return (
        <div className="flex flex-col-reverse overflow-y-auto gap-2 chat-history">
            {messages.map((item, index) => (
                <ChatMessage message={item} key={item.id}/>
            ))}
        </div>
    );
}
