import React from "react";
import {Speaker} from "./App";
import clsx from "clsx";

export default function ChatMessage({message}) {
    console.log(
        clsx(
            "bg-messageBubble",
            message.speaker == Speaker.User ? "self-end" : "self-start"
        )
    );
    return (
        <div
            className={clsx(
                "px-3 py-2 rounded-lg max whitespace-normal w-3/4 text-wrap break-all",
                message.speaker == Speaker.User
                    ? "bg-aiMessageBubble text-white self-end pl-5"
                    : "bg-aiMessageBubble self-start text-white pr-5 "
            )}
        >
            {message.message}
        </div>
    );
}
