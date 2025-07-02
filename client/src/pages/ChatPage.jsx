import { useEffect, useState } from "react"
import addReactionIcon from '../assets/add_reaction.svg'
import { chatSocket } from "../api/socket/socket";
import './styles/chat.css'
import { Outlet, redirectDocument, Link } from "react-router-dom";
import { authMe } from "../api/operations";

let windowHeight = document.documentElement.clientHeight, counter = 0;

export async function loader() {
  const status = await authMe();
  if (!status.data.authenticated) return redirectDocument("/signin")

  const data = []
  return { data }
}

function ChatPage() {
  const [connected, setConnected] = useState(chatSocket.connected);
  const [reconnected, setReconnected] = useState(chatSocket.active);

  useEffect(() => {
    function onConnect() {
      setConnected(true);
      setReconnected(chatSocket.active);
    }

    function onDisconnect(reason) {
      if (reason === "io server disconnect")
        // console.log(socket.active); // false
        console.warn("the disconnection was initiated by the server, you need to manually reconnect")

      // else the socket will automatically try to reconnect
      // console.log(socket.active); // true
      setConnected(false);
      setReconnected(chatSocket.active);
    }

    chatSocket.on('connect', onConnect);
    chatSocket.on('disconnect', onDisconnect);

    return () => {
      chatSocket.off('connect', onConnect);
      chatSocket.off('disconnect', onDisconnect)
    }
  }, [])

  return (
    <div className="background_container" style={{ height: `${windowHeight}px`, position: 'relative' }}>
      <div className="flex flex-row fit-parent">
        <div className="flex flex-col chat-list">
          <div className="flex flex-col">
            <p>Chats</p>
            <p>{connected ? 'Online' : 'Offline'}</p>
            <p>{reconnected ? "Reconnecting" : "Cannot reconnect"}</p>
          </div>
          <ul>
            <Link to={"1"}>
              <li className="flex flex-row">
                <p>
                  <img src={addReactionIcon} alt="" />
                </p>
                <p>PUBLIC</p>
              </li>
            </Link>
          </ul>
        </div>
        <Outlet />
      </div>
    </div>
  )
}





export default ChatPage;