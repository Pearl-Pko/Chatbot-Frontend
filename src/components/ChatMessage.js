import React, {useEffect} from "react";
import clsx from "clsx";
import {Speaker} from "../chat";
import {ReactComponent as Time} from "./time.svg";
import IonIcon from "@reacticons/ionicons";
import {MessageStatus} from "../chat";

export default function ChatMessage({message, key}) {
    // console.log(message);
    useEffect(() => {
        console.log("rerender");
    });
    console.log(message.status, message);

    return (
        <div
            className={clsx(
                "w-3/4 flex flex-col",
                message.sender == Speaker.User ? "self-end" : "self-start"
            )}
        >
            <div
                className={clsx(
                    "px-3 py-2 rounded-lg whitespace-pre text-wrap break-words",
                    message.sender == Speaker.User
                        ? "bg-accent text-primary-100 pl-5"
                        : "bg-secondary-100 text-white pr-5 "
                )}
            >
                <p>{message.content}</p>
            </div>
            <div className="text-primary-100 self-end">
                {/* <Time width="20"/> */}
                {(message.status == MessageStatus.PENDING) ? (
                    <IonIcon name="time-outline" />
                ) : message.status == MessageStatus.SENT ? (
                    <div className="flex items-center gap-2">
                        {/* <IonIcon name="checkmark-done" /> */}
                        <p className="text-sm">{message.sentAt?.toDate().toLocaleTimeString("en-US", {hour: "numeric", minute: "2-digit", hour12: true})}</p>
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
