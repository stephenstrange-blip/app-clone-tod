import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BASE_SERVER_URL, {
  autoConnect: false,
  withCredentials: true,
  path: "/chatroom/",
  auth: {
    serverOffset: 0,
  },
});
