import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";

const Conversations = () => {
    const { user } = useSelector((store) => store.auth);
    const [conversations, setConversations] = useState([]);

    const fetchConversations = async () => {
        try {
            const res = await axiosInstance.get("/message/conversations");
            if (res.data.success) {
                setConversations(res.data.conversations);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    return (
        <div className="p-8 min-h-screen bg-white dark:bg-[#121214] dark:text-white">
            <h1 className="text-2xl font-bold mb-6">Messages</h1>

            <div className="space-y-3">
                {conversations.length === 0 ? (
                    <p>No conversations yet.</p>
                ) : (
                    conversations.map((conv) => {
                        const otherUser = conv.participants.find((p) => p._id !== user._id);
                        return (
                            <Link
                                key={conv._id}
                                to={`/chat/${otherUser?._id}`}
                                className="flex items-center gap-4 border p-4 rounded dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#1a1a1d]"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center">
                                    {otherUser?.fullname?.[0]}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{otherUser?.fullname}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{otherUser?.role}</p>
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Conversations;