import React, {useEffect, useState, useRef, useLayoutEffect} from "react";
import UserInput from "../components/UserInput";
import ChatHistory from "../components/ChatHistory";
import {Chat, MessageStatus, Speaker} from "../chat";
import {IconButton} from "@mui/material";
import "./Home.css";
import IonIcon from "@reacticons/ionicons";
import AppNavigation from "../components/AppNavigation";
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
import useIntersectionObserver from "../hooks/useInteractionObserver";
import ScrollToBottom from "../components/ScrollToBottom";
const messageRef = collection(db, "messages");
const conversationRef = collection(db, "conversation");

export default function Home() {
    const {state, updateConversationId} = useUser();
    const [messages, setMessages] = useState([]);
    const [canSend, setCanSend] = useState(true);
    const [loadingChatHistory, setLoadingChatHistory] = useState(true);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const [isVisible] = useIntersectionObserver(bottomRef, {
        root: null,
        rootMargin: "5px",
    });

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
        if (!state.user) return;

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
            .then(async (collectionId) => {
                if (collectionId) return collectionId;

                return addDoc(conversationRef, {
                    user_id: state.user,
                }).then((doc) => {
                    collectionId = doc.id;
                    setLoadingChatHistory(false);
                    return collectionId;
                });
            })
            .then((collectionId) => {
                updateConversationId(collectionId);
            });
    }, [state.user]);

    // this code loads the chat history
    useEffect(() => {
        if (!state.conversationId) return;

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
            setLoadingChatHistory(false);
        });
    }, [state.conversationId]);

    const scrollToBottom = () => {
        // Scroll to the element
        // console.log("scroll");
        bottomRef?.current?.scrollIntoView({behavior: "smooth"});
    };

    useLayoutEffect(() => {
        // console.log("message sent")
        scrollToBottom();
    }, [messages]);

    const onSendMessage = (message) => {
        // console.log(state.conversationId);
        setCanSend(false);

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
                setMessages((prevMessages) => [aiMessage, ...prevMessages]);

                fetch("/api/reply", {
                    method: "POST", // or 'PUT'
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({message: message}),
                })
                    .then((res) => {
                        // console.log(res);
                        return res.json();
                    })
                    .then((data) => {
                        const firestoreAIMessage = {
                            conversationId: state.conversationId,
                            content: data.message,
                            sentAt: serverTimestamp(),
                            sender: Speaker.AI,
                        };
                        addDoc(messageRef, firestoreAIMessage).then(
                            async (docRef) => {
                                const docSnapshot = await getDoc(docRef);
                                const data = docSnapshot.data();

                                setMessages((prevMessages) =>
                                    prevMessages.map((item) =>
                                        item.id === aiMessage.id
                                            ? {
                                                  ...data,
                                                  status: MessageStatus.SENT,
                                                  id: data.id,
                                              }
                                            : item
                                    )
                                );
                                setCanSend(true);
                            }
                        );
                    })
                    .catch((error) => {});
            })
            .catch((error) => {
                setMessages((prevMessages) =>
                    prevMessages.map((item) =>
                        item.id === userMessage.id
                            ? {...item, status: MessageStatus.ERROR}
                            : item
                    )
                );
                setCanSend(true);
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
    };

    return (
        <>
            {loadingChatHistory ? (
                <div className="mx-auto my-auto">
                    <p className="text-primary-100">Loading chat history....</p>
                </div>
            ) : (
                <div className="overflow-auto px-6 w-full">
                    <ChatHistory messages={messages} />
                    <div ref={bottomRef} className="scroll"></div>
                </div>
            )}
            {/* <ScrollToBottom scrollToBottom={scrollToBottom} inputElement={inputRef}/> */}
            <UserInput
                forwardedRef={inputRef}
                acs={true}
                onSendMessage={onSendMessage}
                canSend={canSend}
            />
        </>
    );
}
