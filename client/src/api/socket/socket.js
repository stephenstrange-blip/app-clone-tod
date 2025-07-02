import { io } from "socket.io-client";
const NAMESPACES = {
  chatroom: "chats",
};

// main namespace
export const socket = io(import.meta.env.VITE_BASE_SERVER_URL, {
  autoConnect: false,
  withCredentials: true,
  path: "/chatroom/",
  auth: {
    serverOffset: 0,
  },
  retries: 5,
  ackTimeout: 8000,
});

export const chatSocket = io(
  `${import.meta.env.VITE_BASE_SERVER_URL}/${NAMESPACES.chatroom}`,
  {
    autoConnect: false,
    withCredentials: true,
    path: "/chatroom/",
    auth: {
      serverOffset: 0,
    },
    retries: 5,
    ackTimeout: 8000,
  }
);
