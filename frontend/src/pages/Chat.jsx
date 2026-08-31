import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, Trash2 } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";
import { useSocket } from "../utils/socketContext";

const Chat = () => {
    const { id: receiverId } = useParams();
    const { user } = useSelector((store) => store.auth);
    const socket = useSocket();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [receiver, setReceiver] = useState(null);
    const bottomRef = useRef(null);

    const formatTime = (t) => new Date(t).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });

    useEffect(() => {
        (async () => {
            try {
                const res = await axiosInstance.get(`/message/get/${receiverId}`);
                if (res.data.success) setMessages(res.data.messages);
                await axiosInstance.patch(`/message/seen/${receiverId}`);

                const convRes = await axiosInstance.get("/message/conversations");
                const conv = convRes.data.conversations?.find(c => c.participants.some(p => p._id === receiverId));
                setReceiver(conv?.participants.find(p => p._id === receiverId));
            } catch (e) { console.log(e); }
        })();
    }, [receiverId]);

    useEffect(() => {
        if (!socket) return;
        const onMsg = (m) => m.sender === receiverId && setMessages(prev => [...prev, m]);
        const onDelete = (id) => setMessages(prev => prev.filter(m => m._id !== id));
        socket.on("newMessage", onMsg);
        socket.on("messageDeleted", onDelete);
        return () => { socket.off("newMessage", onMsg); socket.off("messageDeleted", onDelete); };
    }, [socket, receiverId]);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const sendHandler = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        try {
            const res = await axiosInstance.post(`/message/send/${receiverId}`, { text });
            if (res.data.success) { setMessages(prev => [...prev, res.data.newMessage]); setText(""); }
        } catch (e) { console.log(e); }
    };

    const deleteHandler = async (id) => {
        if (!window.confirm("Delete this message?")) return;
        try {
            const res = await axiosInstance.delete(`/message/delete/${id}`);
            if (res.data.success) setMessages(prev => prev.filter(m => m._id !== id));
        } catch (e) { alert(e.response?.data?.message || "Could not delete message"); }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-73px)] bg-white dark:bg-[#121214] dark:text-white">
            <div className="p-4 border-b dark:border-gray-700 font-semibold flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="text-gray-500 dark:text-gray-400"><ArrowLeft className="w-5 h-5" /></button>
                {receiver?.fullname || "Chat"}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                    const isOwn = msg.sender === user._id;
                    return (
                        <div key={msg._id} className={`group flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                            <span className="text-[10px] text-gray-400 px-1">{isOwn ? user.fullname : receiver?.fullname || "User"}</span>
                            <div className={`flex items-center gap-2 ${isOwn ? "flex-row-reverse" : ""}`}>
                                <div className={`max-w-xs px-4 py-2 rounded-lg ${isOwn ? "bg-[#8B5CF6] text-white" : "bg-[#F4F4F5] dark:bg-gray-700 dark:text-white"}`}>
                                    {msg.text}
                                </div>
                                {isOwn && (
                                    <button onClick={() => deleteHandler(msg._id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1 px-1">{formatTime(msg.createdAt)}</span>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={sendHandler} className="p-4 border-t dark:border-gray-700 flex gap-3">
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." className="flex-1 border p-2 rounded dark:bg-[#1a1a1d] dark:border-gray-700" />
                <button type="submit" className="bg-[#8B5CF6] text-white px-6 py-2 rounded">Send</button>
            </form>
        </div>
    );
};

export default Chat;