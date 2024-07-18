"use client";

import { stat } from "fs";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
interface SocketProviderProps {
  children?: React.ReactNode;
}

interface SocketContextUtil {
  sendMsg: (msg: string) => any;
  messages: string[];
}

const SocketContext = React.createContext<SocketContextUtil | null>(null);

export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error("State is undefined ");
  return state;
};
const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<string[]>([]);

  const sendMsg: SocketContextUtil["sendMsg"] = useCallback(
    (msg) => {
      if (socket) {
        socket.emit("event:message", msg);
      }
      console.log("s", msg);
    },
    [socket]
  );
  const onMsgRec = useCallback((msg: string) => {
    const msgReceived = JSON.parse(msg);
    console.log("mesRec", msg);
    console.log("mesRec", msgReceived);
    setMessages((prev) => [...prev, msgReceived]);
  }, []);

  useEffect(() => {
    const _socket = io("http://localhost:8000");

    _socket.on("messageRec", onMsgRec);
    setSocket(_socket);
    return () => {
      _socket.off("messageRec", onMsgRec);
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ sendMsg, messages }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
