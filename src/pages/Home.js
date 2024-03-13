import React, {useEffect, useState} from "react";
import UserInput from "../components/UserInput";
import ChatHistory from "../components/ChatHistory";
import {Chat, MessageStatus, Speaker} from "../chat";
import MenuIcon from "@mui/icons-material/Menu";
import {IconButton} from "@mui/material";
import Drawer from "../components/Drawer";
import {
    addDoc,
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";
import {auth, db} from "../firebase";
import {useUser, runQueryWithTimeout} from "../context/UserContext";

const messageRef = collection(db, "messages");
const conversationRef = collection(db, "conversation");

export default function Home() {
    const {state, updateConversationId} = useUser();
    const [messages, setMessages] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // const onSendMessage = (message) => {
    //     setMessages((prevMessages) => [
    //         new Chat(message, Speaker.User),
    //         ...prevMessages,
    //     ]);

    //     fetch("http://localhost:5000/get-response", {
    //         method: "POST", // or 'PUT'
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({message: message}),
    //     })
    //         .then((res) => res.json())
    //         .then((res) => {
    //             console.log("yes");
    //             setMessages((prevMessages) => [
    //                 new Chat(res.response, Speaker.AI),
    //                 ...prevMessages,
    //             ]);
    //         })
    //         .catch((error) => console.log(error));
    // };

    // conversation
    // user_id
    // id
    // created-At
    // context
    // lastMessage At

    // messages
    // conversation_id
    // id
    // content
    // timestamp
    // sender

    // tries to get the conversation ID and creates one if does not already exist
    // const getCo?

    /// this tries to create a conversation document for the user or retrieves the already created conversation document
    useEffect(() => {
        const conversationQuery = query(
            conversationRef,
            where("user_id", "==", state.user),
            limit(1)
        );

        console.log("how many");

        getDocs(conversationQuery)
            .then((querySnapshot) => {
                let collectionId;
                querySnapshot.forEach((doc) => {
                    console.log("nooo");
                    collectionId = doc.id;
                });
                return collectionId;
            })
            .then((collectionId) => {
                if (!collectionId) {
                    console.log("zaza");
                    addDoc(conversationRef, {
                        user_id: state.user,
                    }).then((doc) => {
                        collectionId = doc.id;
                    });
                }
                return collectionId;
            })
            .then((collectionId) => {
                updateConversationId(collectionId);
            });
    }, [state.user]);

    useEffect(() => {
        console.log("state converastion if", state.conversationId);
        const allMessagesQuery = query(
            messageRef,
            where("conversationId", "==", state.conversationId),
            orderBy("sentAt", "desc")
        );
        getDocs(allMessagesQuery).then((querySnapshot) => {
            const previousMessages = [];
            querySnapshot.forEach((doc) => {
                previousMessages.push({
                    ...doc.data(),
                    id: doc.id,
                    status: MessageStatus.SENT,
                });
            });
            console.log("previous", previousMessages);
            setMessages(previousMessages);
            console.log("messages set");
        });
    }, [state.conversationId]);

    const onSendMessage = async (message) => {
        console.log(state.conversationId);

        // addDoc(messageRef, {
        //     conversationId: state.conversationId,
        //     sentAt: serverTimestamp(),
        //     content: message,
        //     sender: Speaker.User,
        // })
        //     .then(() => {
        //         setMessages((prevMessages) => [
        //             new Chat(message, Speaker.User),
        //             ...prevMessages,
        //         ]);
        //         console.log("yeah damn");

        //         fetch("http://localhost:5000/get-response", {
        //             method: "POST", // or 'PUT'
        //             headers: {
        //                 "Content-Type": "application/json",
        //             },
        //             body: JSON.stringify({message: message}),
        //         })
        //             .then((res) => res.json())
        //             .then((res) => {
        //                 setMessages((prevMessages) => [
        //                     new Chat(res.response, Speaker.AI),
        //                     ...prevMessages,
        //                 ]);
        //                 addDoc(messageRef, {
        //                     conversationId: state.conversationId,
        //                     sentAt: serverTimestamp(),
        //                     content: res.response,
        //                     sender: Speaker.AI,
        //                 });
        //             })
        //             .catch((error) => console.log(error));
        //     })
        //     .catch(() => {
        //         console.log("error");
        //     });

        console.log("server timestamp", serverTimestamp());

        const firestoreUserMessage = {
            conversationId: state.conversationId,
            content: message,
            sentAt: serverTimestamp(),
            sender: Speaker.User,
        };
        const userMessage = {
            ...firestoreUserMessage,
            status: MessageStatus.PENDING,
            id: messages.length,
        };
        setMessages([userMessage, ...messages]);

        runQueryWithTimeout(addDoc(messageRef, firestoreUserMessage), 6000)
            .then((doc) => {
                setMessages(prevMessages => 
                    prevMessages.map((item) =>
                        item.id === userMessage.id
                            ? {...item, status: MessageStatus.SENT, id: doc.id}
                            : item
                    )
                );
            })
            .catch((error) => {
                setMessages((prevMessages) => 
                    prevMessages.map((item) =>
                        item.id === userMessage.id
                            ? {...item, status: MessageStatus.ERROR}
                            : item
                    )
                );
            });

        // try {
        //     setTimeout(() => {throw new Error()}, 500)
        //     await addDoc(messageRef, firestoreUserMessage);
        //     setMessages(messages.map((item) => item.id === userMessage.id ? {...item, status: MessageStatus.SENT} : item));
        // }
        // catch(error) {
        //     console.log("error");
        //     setMessages(messages.map((item) => item.id === userMessage.id ? {...item, status: MessageStatus.ERROR} : item));
        //     // console.log(error);
        // }

        console.log("ue");

        // const res = await fetch("http://localhost:5000/get-response", {
        //     method: "POST", // or 'PUT'
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({message: message}),
        // });
        // const data = await res.json();
    };

    useEffect(() => {
        console.log(messages);
        // console.log("rerender");
    });

    return (
        <div className="flex bg-secondary-200 w-screen h-screen justify-center px-6 ">
            <div className="fixed h-12 w-full bg-secondary-100 flex justify-center items-center text-lg text-white">
                <button
                    className="absolute left-3"
                    onClick={() => setDrawerOpen(true)}
                >
                    <MenuIcon />
                </button>

                <p>KoFIBot</p>
            </div>

            <Drawer isOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
            <div className="flex flex-col justify-end flex-1 max-w-screen-md">
                <ChatHistory messages={messages} />
                <UserInput onSendMessage={onSendMessage} />
            </div>
        </div>
    );
}
