import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useSelector((store) => store.auth);

    useEffect(() => {
        if (user) {
            const newSocket = io("http://localhost:8000", {
                query: { userId: user._id }
            });
            setSocket(newSocket);

            return () => newSocket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);