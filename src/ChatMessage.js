import React, { useEffect } from "react";
import {Speaker} from "./App";
import clsx from "clsx";

export default function ChatMessage({message, key}) {
    // console.log(message);
    useEffect(()=> {
        console.log("rerender")
    })

    return (
        <div
            key = {key}
            className={clsx(
                "px-3 py-2 rounded-lg max whitespace-pre w-3/4 text-wrap break-words",
                message.speaker == Speaker.User
                    ? "bg-aiMessageBubble text-white self-end pl-5"
                    : "bg-aiMessageBubble self-start text-white pr-5 "
            )}
        >
            {message.message}
        </div>
    );
}
