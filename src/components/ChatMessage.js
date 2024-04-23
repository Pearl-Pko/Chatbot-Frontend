import React, {useEffect} from "react";
import clsx from "clsx";
import {Speaker} from "../chat";
import {ReactComponent as Time} from "./time.svg";
import IonIcon from "@reacticons/ionicons";
import {MessageStatus} from "../chat";
import "./Bubble.css";

function MessageBubble({sender, message, key}) {
    const user = message.sender === Speaker.User;

    return (
        <div
            className={clsx(
                "min-w-28 flex flex-col bubble-text",
                user ? "self-end" : "self-start"
            )}
        >
            <div
                className={clsx(
                    "px-3 py-2 rounded-lg whitespace-pre text-wrap break-words  text-primary-100 pl-5",
                    user ? "bg-accent" : "bg-secondary-100"
                )}
            >
                {!user && message.status == MessageStatus.PENDING ? (
                    <ChatBubbleLoading />
                ) : (
                    <p>{message.content}</p>
                )}
            </div>
            <div
                className={clsx(
                    "text-primary-100",
                    user ? "self-end" : "self-start"
                )}
            >
                {user && message.status === MessageStatus.PENDING ? (
                    <IonIcon name="time-outline" />
                ) : user && message.status === MessageStatus.ERROR ? (
                    <div className="text-red-400">
                        <IonIcon name="alert" />
                    </div>
                ) : (
                    <div className="hidden"></div>
                )}
            </div>

            {/* <Time/> */}
            {/* <div className="text-white self-end">{message.status}</div> */}
        </div>
    );
}

function ChatBubbleLoading() {
    return (
        <div className="flex gap-2 bubble-container">
            <div className="bubble delay-1000 bg-secondary-300"></div>
            <div className="bubble bg-secondary-300"></div>
            <div className="bubble bg-secondary-300 bubble2"></div>
        </div>
    );
}

export default function ChatMessage({message, key}) {
    // console.log(message);
    return <MessageBubble message={message} key={key} />;
}
