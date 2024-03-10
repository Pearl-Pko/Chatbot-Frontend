import React, {useEffect, useState} from "react";
import UserInput from "../components/UserInput";
import ChatHistory from "../components/ChatHistory";
import {Chat, Speaker} from "../chat";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import Drawer from "../components/Drawer";

export default function Home() {
    const [messages, setMessages] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const onSendMessage = (message) => {
        setMessages((prevMessages) => [
            new Chat(message, Speaker.User),
            ...prevMessages,
        ]);

        fetch("http://localhost:5000/get-response", {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({message: message}),
        })
            .then((res) => res.json())
            .then((res) => {
                console.log("yes");
                setMessages((prevMessages) => [
                    new Chat(res.response, Speaker.AI),
                    ...prevMessages,
                ]);
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        // console.log("rerender");
    });

    return (
        <div className="flex bg-secondary-200 w-screen h-screen justify-center px-6 ">
            <div className="fixed h-12 w-full bg-secondary-100 flex justify-center items-center text-lg text-white">
                <button className="absolute left-3" onClick={() => setDrawerOpen(true)}>
                    <MenuIcon/>
                </button>

                <p>KoFIBot</p>
            </div>

            <Drawer isOpen={drawerOpen} setDrawerOpen={setDrawerOpen}/>
            <div className="flex flex-col justify-end flex-1 max-w-screen-md">
                <ChatHistory messages={messages} />
                <UserInput onSendMessage={onSendMessage} />
            </div>
        </div>
    );
}
