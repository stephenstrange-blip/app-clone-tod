import { createRoutesFromElements, redirectDocument, Route } from "react-router-dom";

import Signin, { action as signinAction, loader as signinLoader } from '../pages/Signin'
import Signup, { action as signupAction, loader as signupLoader } from "../pages/Signup";
import ErrorPage from "../pages/Error";
import Home, { loader as homeLoader } from "../pages/Home";
import Root from "../pages/Root";
import PostPage, { loader as postPageLoader, action as postAction } from "../pages/Post";
import Profile, { loader as profileLoader, action as profileAction } from "../pages/Profile";

import ChatPage, { loader as chatPageLoader } from "../pages/ChatPage";
import ChatRoom, { loader as chatRoomLoader, action as chatRoomAction } from "../pages/components/Chatroom";

export const routes = createRoutesFromElements(

  <Route errorElement={<ErrorPage />} element={<Root />} path="/">
    <Route index element={<Signin />} loader={signinLoader} action={async ({ request }) => run({ request, action: signinAction, errorRedirect: '/signin' })} />
    <Route element={<Home />} path={"home"} loader={async ({ params }) => run({ params, routeFunc: homeLoader, errorRedirect: '/signin' })} />
    <Route element={<Signin />} path={"signin"} loader={signinLoader} action={async ({ request }) => run({ request, routeFunc: signinAction, errorRedirect: '/signin' })} />
    <Route element={<Signup />} path={"signup"} loader={signupLoader} action={async ({ request }) => run({ request, routeFunc: signupAction, errorRedirect: '/signup' })} />
    <Route element={<Profile />} path={"home/profile"} loader={async ({ params }) => run({ params, routeFunc: profileLoader, errorRedirect: '/home' })} action={async ({ request }) => run({ request, routeFunc: profileAction, errorRedirect: '/home' })} />
    <Route element={<PostPage />} path={"home/:postId"} loader={async ({ params }) => run({ params, routeFunc: postPageLoader, errorRedirect: '/home' })} action={async ({ request }) => run({ request, routeFunc: postAction, errorRedirect: '/home' })} />
    <Route element={<ChatPage />} path={"chatroom"} loader={async ({ params }) => run({ params, routeFunc: chatPageLoader, errorRedirect: '/home' })}>
      <Route element={<ChatRoom />} path={"/chatroom/:chatId"} loader={async ({ params }) => run({ params, routeFunc: chatRoomLoader, errorRedirect: '/chatroom' })}
        action={async ({request, params}) => {
          return run({ request, params, routeFunc: chatRoomAction, errorRedirect: '/chatroom' })
        }}>
      </Route>
    </Route>
  </Route>
)

async function run({ request, params, routeFunc, errorRedirect }) {
  let result;

  try {
    if (request && params) result = await routeFunc({ request, params })
    else result = await routeFunc(request ? { request } : { params });

    if (result) return result
  } catch (err) {
    console.error(err);
    console.log(`Redirecting to ${errorRedirect}`)

    await new Promise(resolve => setTimeout(resolve, 3000));
    return redirectDocument(errorRedirect)
  }
}

