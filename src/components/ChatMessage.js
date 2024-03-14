import React, {useEffect} from "react";
import clsx from "clsx";
import {Speaker} from "../chat";
import {ReactComponent as Time} from "./time.svg";
import IonIcon from "@reacticons/ionicons";
import {MessageStatus} from "../chat";
import "./Bubble.css";

function UserMessageBubble({message, key}) {
    console.log(message)
    return (
        <div className="max-w-3/4 min-w-28 flex flex-col self-end">
            <div className="px-3 py-2 rounded-lg whitespace-pre text-wrap break-words bg-accent text-primary-100 pl-5">
                <p>{message.content}</p>
            </div>
            <div className="text-primary-100 self-end">
                {/* <Time width="20"/> */}
                {message.status == MessageStatus.PENDING ? (
                    <IonIcon name="time-outline" />
                ) : message.status == MessageStatus.SENT ? (
                    <div className="flex items-center gap-2">
                        {/* <IonIcon name="checkmark-done" /> */}
                        <p className="text-sm">
                            {message.sentAt
                                ?.toDate()
                                .toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                })}
                        </p>
                    </div>
                ) : (
                    <div className="text-red-400">
                        <IonIcon name="alert" />
                    </div>
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


function AIMessageBubble({message, key}) {
    return (
        <div className="max-w-3/4 flex flex-col self-start">
            <div className="px-3 py-2 rounded-lg whitespace-pre text-wrap break-words bg-secondary-100 text-white pr-5 ">
                {message.status == MessageStatus.PENDING ? (
                    <ChatBubbleLoading />
                ) : (
                    <p>{message.content}</p>
                )}
            </div>
            <div className="text-primary-100 self-start">
                {/* <Time width="20"/> */}
                { message.status == MessageStatus.SENT && (
                    <div className="flex items-center gap-2">
                        {/* <IonIcon name="checkmark-done" /> */}
                        <p className="text-sm">
                            {message.sentAt
                                ?.toDate()
                                .toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                })}
                        </p>
                    </div>
                
                )}
            </div>

            {/* <Time/> */}
            {/* <div className="text-white self-end">{message.status}</div> */}
        </div>
    );
}

export default function ChatMessage({message, key}) {
    // console.log(message);
    console.log("message", message);
    return message.sender == Speaker.User ? (
        <UserMessageBubble message={message} key={key} />
    ) : (
        <AIMessageBubble message={message} key={key} />
    );
}
