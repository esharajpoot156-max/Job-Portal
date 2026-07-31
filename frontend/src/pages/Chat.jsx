import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { useSocket } from "../utils/socketContext";

const Chat = () => {
    const { id: receiverId } = useParams();
    const { user } = useSelector((store) => store.auth);
    const socket = useSocket();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [receiver, setReceiver] = useState(null);
    const bottomRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const res = await axiosInstance.get(`/message/get/${receiverId}`);
            if (res.data.success) {
                setMessages(res.data.messages);
            }
            await axiosInstance.patch(`/message/seen/${receiverId}`);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchConversationsForName = async () => {
        try {
            const res = await axiosInstance.get("/message/conversations");
            if (res.data.success) {
                const conv = res.data.conversations.find((c) =>
                    c.participants.some((p) => p._id === receiverId)
                );
                const other = conv?.participants.find((p) => p._id === receiverId);
                setReceiver(other);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchMessages();
        fetchConversationsForName();
    }, [receiverId]);

    useEffect(() => {
        if (!socket) return;

        socket.on("newMessage", (newMsg) => {
            if (newMsg.sender === receiverId) {
                setMessages((prev) => [...prev, newMsg]);
            }
        });

        return () => socket.off("newMessage");
    }, [socket, receiverId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendHandler = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            const res = await axiosInstance.post(`/message/send/${receiverId}`, { text });
            if (res.data.success) {
                setMessages((prev) => [...prev, res.data.newMessage]);
                setText("");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-73px)] bg-white dark:bg-[#121214] dark:text-white">
            <div className="p-4 border-b dark:border-gray-700 font-semibold">
                {receiver?.fullname || "Chat"}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                    <div
                        key={msg._id}
                        className={`flex ${msg.sender === user._id ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                                msg.sender === user._id
                                    ? "bg-[#8B5CF6] text-white"
                                    : "bg-[#F4F4F5] dark:bg-gray-700 dark:text-white"
                            }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={sendHandler} className="p-4 border-t dark:border-gray-700 flex gap-3">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border p-2 rounded dark:bg-[#1a1a1d] dark:border-gray-700"
                />
                <button type="submit" className="bg-[#8B5CF6] text-white px-6 py-2 rounded">
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;