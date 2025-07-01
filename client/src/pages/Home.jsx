import { useLoaderData, Link, redirectDocument } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { socket } from "../api/socket/socket";
import { createRequest, loadManyPost, createPost, authMe, logMeOut } from "../api/operations"
import { PostSection } from "./components/Section"
import PostDialog from "./components/PostDialog";
import { FULFILLED } from "../utils/utils";
import { isEmpty as __isEmpty } from "lodash";
import './styles/home.css'

export async function loader() {
  const status = await authMe();

  if (!status.data.authenticated) return redirectDocument("/signin")

  const _posts = loadManyPost({ myPosts: true })

  //TAKE NOTE: CHANGING Promise.allSettled to Promise.all changes the shape of the response obj.
  const [posts] = await Promise.allSettled([_posts])

  return { posts }
}

function Home() {
  const { posts: u_posts } = useLoaderData() || { posts: {} };
  
  if (__isEmpty(u_posts))
    return location.href = "/signin"
  
  const dialogRef = useRef()
  const [connected, setConnected] = useState(socket.connected);
  const [reconnected, setReconnected] = useState(socket.active);

  useEffect(() => {
    function onConnect() {
      setConnected(socket.connected);
    }

    function onDisconnect(reason) {
      console.log(`Socket disconnected due to: ${reason}`)
      setConnected(socket.connected);
      setReconnected(socket.active);
    }
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    }
  }, [])

  const [posts, setPosts] = useState(FULFILLED.includes(u_posts.status) ? u_posts.value?.data : u_posts.reason);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {

      const formData = new FormData(e.currentTarget);
      // This was meant to run througn an async 'action' function,
      // which a module can only have one of, hence, the use of distinct intent
      // for mulitple forms in a single module
      const intent = formData?.get("intent");

      if (intent === 'create_post') {
        const input = { title: formData.get('title'), message: formData.get('message') };
        const result = await createPost(input);

        if (result.value?.statusText === 'OK') {
          const updatedPosts = await loadManyPost({ myPosts: false })
          setPosts(updatedPosts)
        }
        return location.reload()
      }

    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = async () => {
    console.log('Logging out!')
    socket.disconnect();
    await logMeOut();
    return location.href = "/signin"
  }

  const makeRequest = async (e) => {
    e.preventDefault()
    try {
      let value = new FormData(e.currentTarget).get("targetId");
      const result = await createRequest({ targetId: value })

      if (result.status === 200)
        return window.location.reload()

    } catch (err) {
      console.error(err)
      return e.currentTarget.reset();
    }
  }

  const closeDialog = () => {
    dialogRef.current.firstElementChild?.reset();
    return dialogRef.current.close();
  }

  return (
    <div className="body_container">
      <h1>Home Page</h1>

      <div className="flex flex-center flex-row">
        <button onClick={handleLogout}>Logout</button>
        <button onClick={() => dialogRef.current.showModal()}>Create Post</button>
        <Link to={"/chatroom"} style={{ minWidth: 'fit-content' }}><button>Go to chatroom</button></Link>
        <Link to={'/home/profile'} style={{ minWidth: 'fit-content' }}><button>Visit Profile</button></Link>
        <form onSubmit={makeRequest}>
          <button typeof="submit">Request Follow</button>
          <label htmlFor="makeRequest"></label>
          <input type="text" id="makeRequest" name="targetId" placeholder="Input target userId: " />
        </form>
      </div>

      <div className="flex flex-row info_container">
        <PostSection posts={posts} />
      </div>

      <PostDialog closeDialog={closeDialog} dialogRef={dialogRef} handlePostSubmit={handlePostSubmit} />
    </div>
  )

}
export default Home;