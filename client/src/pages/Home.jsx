import { useLoaderData, useNavigate, Link } from "react-router-dom";
import { useState, useRef } from "react";

import { createRequest, loadManyPost, createPost } from "../api/operations"
import { PostSection } from "./components/Section"
import PostDialog from "./components/PostDialog";
import { FULFILLED } from "../utils/utils";

import './styles/home.css'



export async function loader() {
  const _posts = loadManyPost({ myPosts: true })

  //TAKE NOTE: CHANGING Promise.allSettled to Promise.all changes the shape of the response obj.
  const [posts] = await Promise.allSettled([_posts])

  return { posts }
}

function Home() {
  const nav = useNavigate();
  const dialogRef = useRef()

  if (!localStorage.getItem("token")) {
    location.replace('/signin')
  }

  const { posts: u_posts } = useLoaderData();

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (!localStorage.getItem('token')) {
      nav('/signin')

      // Reload to clear request cache and allow signin in again
      // Do not put above nav('/signin) as this refreshes the /home page
      // after token removal, which causes unauthorized error
      return window.location.reload()
    }
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
        <Link to={'/home/profile'} style={{ minWidth: 'fit-content' }} ><button>Visit Profile</button></Link>
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