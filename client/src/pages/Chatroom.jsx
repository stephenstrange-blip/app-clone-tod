import { useEffect, useState } from "react"
import addReactionIcon from '../assets/add_reaction.svg'
import { socket } from "../api/socket/socket";
import './styles/chat.css'
import { useLoaderData, Form, redirectDocument } from "react-router-dom";
import { authMe } from "../api/operations";

const windowHeight = window.innerHeight;

export async function loader() {
  const status = await authMe();
  if (!status.data.authenticated) return redirectDocument("/signin")

  const data = []
  return { data }
}

function Chatroom() {
  const [connected, setConnected] = useState(socket.connected);
  const [reconnected, setReconnected] = useState(socket.active);
  const [events, setEvents] = useState(['server', 'client'])
  const [messages, setMessages] = useState(useLoaderData().data || []);

  useEffect(() => {
    function onConnect() {
      setConnected(true);
      setReconnected(socket.active);
    }

    function onDisconnect(reason) {
      if (reason === "io server disconnect")
        // console.log(socket.active); // false
        console.warn("the disconnection was initiated by the server, you need to manually reconnect")

      // else the socket will automatically try to reconnect
      // console.log(socket.active); // true
      setConnected(false);
      setReconnected(socket.active);
    }

    function onChat(newMessage, offSet) {
      let newData = { id: offSet, content: newMessage }
      socket.auth.serverOffset = offSet;
      setMessages(previous => [...previous, newData])
    }

    function onEvent(newEvent) {
      setEvents(previous => [...previous, newEvent]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chat', onChat);
    socket.on('fireEvent', onEvent);


    return () => {
      socket.off('connect', onConnect);
      socket.off('fireEvent', onEvent);
      socket.off('chat', onChat);
      socket.off('disconnect', onDisconnect)
    }
  }, [])

  function handleSubmit(e) {
    e.preventDefault();
    let input = e.currentTarget.lastElementChild;

    if (input.value) {
      socket.timeout(5000).emit('chat', input.value)
      input.value = '';
    }
  }

  return (
    <div className="background_container" style={{ minHeight: `${windowHeight}px`, position: 'relative' }}>
      <div className="flex flex-center flex-col">
        <header className="chat-header flex">
          <h1>Chatroom</h1>
          <p>{connected ? 'Online' : 'Offline'}</p>
          <p>{reconnected ? "Reconnecting" : "Cannot reconnect"}</p>
        </header>
        <div className="events">
          <ConnectionManager />
          <Events events={events} />
        </div>
        <main className="chat-main flex flex-center flex-col">
          <section className="chat-section flex ">
            <ul className="flex flex-col">
              <Messages messages={messages} />
            </ul>
          </section>
          <span className="flex flex-row">
            <p className="chat-reaction ">
              <img src={addReactionIcon} alt="" />
            </p>
            <Form onSubmit={handleSubmit}>
              <label htmlFor="message"></label>
              <input id="message" name="message" type="text" placeholder="Input your message here" />
            </Form>
          </span>
        </main>
      </div>
    </div>
  )
}



function Messages({ messages }) {
  if (!messages || (Array.isArray(messages) && messages.length === 0)) return;

  return (
    messages.map(message => {
      console.log(message);
      return <li key={message.id}>{message.content}</li>
    }
    
    )
  )
}

function Events({ events }) {
  if (!events || events.length === 0) return;

  return (
    <ul className="fit-parent">
      {events.map((event, index) => <li key={index}>{event}</li>)}
    </ul>
  )
}

export function ConnectionManager() {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <div>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}

export default Chatroom;