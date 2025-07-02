import { useEffect, useState, useRef } from 'react';
import addReactionIcon from '../../assets/add_reaction.svg'
import { useLoaderData, useNavigation } from 'react-router-dom';
import { chatSocket } from '../../api/socket/socket';
import { MessageForm } from './Form';
import { loadManyMessage } from '../../api/operations';

let counter = 0;

export async function loader({ params }) {
  const { chatId } = params;
  const { data } = await loadManyMessage({ chatId })
  return { data, chatId }
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'submit_message') {
    const message = formData.get('message');
    const clientOffset = `${chatSocket.id}-${counter++}`
    console.log('Posting message', message, clientOffset)
    if (chatSocket.id)
      chatSocket.timeout(5000).emit('chat', message, clientOffset, Number(params.chatId) || 1)
    else console.error("Not Connected!")
  }

  // return await new Promise(resolve => setTimeout(resolve, 5000));
  return;
}

export default function ChatRoom({ name }) {
  const nav = useNavigation();
  const { data, chatId } = useLoaderData();
  const [events, setEvents] = useState(['Events']);
  const [messages, setMessages] = useState(data || []);
  const chatRef = useRef(null);

  useEffect(() => {
    function onChat(newMessage) {
      console.log('Updating message array')
      chatSocket.auth.serverOffset = newMessage.id;
      setMessages(previous => [...previous, newMessage])
    }

    function onEvent(newEvent, ...args) {
      console.log('New event: ', args)
      setEvents(previous => [...previous, newEvent]);
    }

    function onError(err) {
      console.log(err instanceof Error); // true
      console.log(err.message); // not authorized
      console.log(err.data); // { content: "Please retry later" }
    }

    chatSocket.on('chat', onChat);
    chatSocket.on("connect_error", onError);
    chatSocket.onAny(onEvent);

    chatSocket.auth.serverOffset = messages[messages.length - 1]?.id || 0;
    chatRef.current.scrollTo({ top: 100, left: 0, behavior: 'smooth'});

    return () => {
      chatSocket.off('chat', onChat);
      chatSocket.off('connect_error', onError)
    }
  }, [])


  return (
    <div className="flex flex-center flex-col" style={{ width: '100%' }}>
      <header className="chat-header flex">
        <h1>{name}</h1>
      </header>
      <div className="events">
        <ConnectionManager chatId={chatId} />
        <Events events={events} />
      </div>
      <main className="chat-main flex flex-center flex-col">
        <section className="chat-section flex ">
          <ul ref={chatRef} className="flex flex-col">
            <Messages messages={messages} />
          </ul>
        </section>
        <span className="flex flex-row">
          <p className="chat-reaction ">
            <img src={addReactionIcon} alt="" />
          </p>
          <MessageForm chatId={chatId} state={nav.state} />
        </span>
      </main>
    </div>
  )
}

function Messages({ messages }) {
  if (!messages || (Array.isArray(messages) && messages.length === 0)) return;
  
  return (
    messages.map(message => {
      return <li className={message.myMessage && 'myMessage'} key={message.id}>{message.content}</li>
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

export function ConnectionManager({ chatId }) {
  function connect() {
    console.log('Connecting to chatsocket')
    chatSocket.connect();
    chatSocket.emit("joinRoom", chatId)
  }

  function disconnect() {
    chatSocket.disconnect();
  }

  return (
    <div className="flex flex-center">
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  );
}