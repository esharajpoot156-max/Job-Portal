import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShieldOff, Mail, Trash2 } from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

const Conversations = () => {
    const { user } = useSelector((store) => store.auth);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchConversations = async () => {
        try {
            const res = await axiosInstance.get("/message/conversations");
            if (res.data.success) {
                setConversations(res.data.conversations);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    const deleteHandler = async (e, conversationId) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm("Delete this conversation? This can't be undone.")) return;
        try {
            const res = await axiosInstance.delete(`/message/conversation/${conversationId}`);
            if (res.data.success) {
                setConversations((prev) => prev.filter((c) => c._id !== conversationId));
            }
        } catch (error) {
            alert(error.response?.data?.message || "Could not delete conversation");
        }
    };

    return (
        <div className="p-8 min-h-screen bg-white dark:bg-[#121214] dark:text-white">
            <h1 className="text-2xl font-bold mb-6">Messages</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="space-y-3">
                    {conversations.length === 0 ? (
                        <p>No conversations yet.</p>
                    ) : (
                        conversations.map((conv) => {
                            const otherUser = conv.participants.find((p) => p._id !== user._id);
                            const isBlocked = user?.blockedUsers?.includes(otherUser?._id);
                            const isRecruiter = otherUser?.role === "recruiter";
                            const displayName = isRecruiter ? otherUser?.companyName : otherUser?.fullname;
                            const avatarUrl = isRecruiter
                                ? otherUser?.companyLogo
                                : otherUser?.profile?.profilePhoto;

                            return (
                                <Link
                                    key={conv._id}
                                    to={otherUser ? `/chat/${otherUser._id}` : "#"}
                                    onClick={(e) => { if (!otherUser) e.preventDefault(); }}
                                    className={`flex items-center gap-4 border p-4 rounded dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#1a1a1d] ${isBlocked ? "opacity-60" : ""}`}
                                >
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt={displayName || "avatar"}
                                            className={`w-10 h-10 rounded-full object-cover shrink-0 ${isBlocked ? "opacity-60" : ""}`}
                                        />
                                    ) : (
                                        <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center shrink-0 ${isBlocked ? "bg-gray-400 dark:bg-gray-600" : "bg-[#8B5CF6]"}`}>
                                            {displayName?.[0]}
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-semibold">{displayName || "Deleted user"}</h3>
                                            {otherUser?.role && (
                                                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                                    {otherUser.role}
                                                </span>
                                            )}
                                        </div>

                                        {otherUser?.email && (
                                            <p className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                <Mail size={13} />
                                                {otherUser.email}
                                            </p>
                                        )}
                                    </div>

                                    {isBlocked && (
                                        <span className="flex items-center gap-1 text-xs font-medium text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full shrink-0">
                                            <ShieldOff className="w-3 h-3" />
                                            Blocked
                                        </span>
                                    )}

                                    <button
                                        onClick={(e) => deleteHandler(e, conv._id)}
                                        title="Delete conversation"
                                        className="text-gray-400 hover:text-red-500 transition shrink-0 p-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </Link>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default Conversations;