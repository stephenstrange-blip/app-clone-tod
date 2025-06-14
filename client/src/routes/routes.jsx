import { createRoutesFromElements, Route } from "react-router-dom";

import Signin, { action as signinAction } from '../pages/Signin'
import Signup, { action as signupAction } from "../pages/Signup";
import ErrorPage from "../pages/Error";
import Home, { loader as homeLoader } from "../pages/Home";
import Root from "../pages/Root";
import PostPage, { loader as postPageLoader, action as postAction } from "../pages/Post";
import Profile, { loader as profileLoader } from "../pages/Profile";


export const routes = createRoutesFromElements(

  <Route errorElement={<ErrorPage />} element={<Root />} path="/">
    {/* TODO: Replace with a welcome page */}
    <Route index element={<Signin />} action={signinAction} />
    <Route element={<Home />} path={"home"} loader={homeLoader} />
    <Route element={<Signin />} path={"signin"} action={signinAction} />
    <Route element={<Signup />} path={"signup"} action={signupAction} />
    <Route element={<Profile />} path={"home/profile"} loader={profileLoader} />
    <Route element={<PostPage />} path={'home/:postId'} loader={postPageLoader} action={postAction} />
  </Route>
)