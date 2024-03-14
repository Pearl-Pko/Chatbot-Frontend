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
    getDoc,
} from "firebase/firestore";
import {auth, db} from "../firebase";
import {useUser, runQueryWithTimeout} from "../context/UserContext";
import {Message} from "@mui/icons-material";

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

        getDocs(conversationQuery)
            .then((querySnapshot) => {
                let collectionId;
                querySnapshot.forEach((doc) => {
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
            setMessages(previousMessages);
        });
    }, [state.conversationId]);

    const onSendMessage = async (message) => {
        console.log(state.conversationId);

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
            .then(async (docRef) => {
                const docSnapshot = await getDoc(docRef);
                const data = docSnapshot.data();

                setMessages((prevMessages) =>
                    prevMessages.map((item) =>
                        item.id === userMessage.id
                            ? {...data, status: MessageStatus.SENT, id: data.id}
                            : item
                    )
                );
            })
            .then(() => {
                const aiMessage = {
                    status: MessageStatus.PENDING,
                    id: messages.length,
                    sender: Speaker.AI,
                };
                setMessages((prevMessages) => [
                    aiMessage,
                    ...prevMessages,
                ]);

                fetch("http://localhost:5000/get-response", {
                    method: "POST", // or 'PUT'
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({message: message}),
                })
                    .then((res) => {
                       
                        return res.json();
                    })
                    .then((data) => {
                        const firestoreAIMessage = {
                            conversationId: state.conversationId,
                            content: data.response,
                            sentAt: serverTimestamp(),
                            sender: Speaker.AI,
                        };
                        addDoc(messageRef, firestoreAIMessage).then(
                            async (docRef) => {
                                const docSnapshot = await getDoc(docRef);
                                const data = docSnapshot.data();

                                // setMessages((prevMessages) =>
                                //     prevMessages.map((item) =>
                                //         item.id === aiMessage.id
                                //             ? {
                                //                   ...data,
                                //                   status: MessageStatus.SENT,
                                //                   id: data.id,
                                //               }
                                //             : item
                                //     )
                                // );
                                console.log("data", data);
                            }
                        );
                    }).catch((error) => {});
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
