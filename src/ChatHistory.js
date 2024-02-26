import React from "react";
import ChatMessage from "./ChatMessage";

export default function ChatHistory({messages}) {
    return (
        <div className="flex flex-col-reverse overflow-y-auto gap-2">
            {messages.map((item, index) => (
                <ChatMessage message={item}/>
            ))}
        </div>
    );
}
