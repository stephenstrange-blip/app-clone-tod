import Input from "./components/Input";
import './styles/signin.css'
import lockIcon from '../assets/lock.svg'
import personIcon from '../assets/person.svg'

import { CustomForm } from "./components/Form";
import { Link, redirectDocument } from "react-router-dom";
import { login, authMe } from "../api/operations";


function Signin() {
  return (
    <div className="body_container flex flex-center">
      <LoginForm></LoginForm>
    </div>
  )
}

function LoginForm() {
  const handleGithubAuth = async () => {
    try {
      // cannot use AXIOS or any fetch API as those don't respect CORS headers on redirects
      window.location.href = import.meta.env.VITE_BASE_SERVER_URL + '/auth/github'
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex flex-center flex-col">
      <CustomForm classname={"signin"} url={'/signin'} page={"Login"} disabled={false}>
        <h1>Welcome Back</h1>
        <h2>Enter your account credentials to access your account</h2>
        <Input autofocus={true} type={"text"} identifier={"username"} placeholder={"Enter your username / email"} img={{ src: personIcon, alt: "#" }}></Input>
        <Input type={"password"} identifier={"password"} placeholder={"Enter your password"} img={{ src: lockIcon, alt: "#" }}></Input>
      </CustomForm>

      <h2>Don't have an account? <Link to={"/signup"}>Register here</Link></h2>
      <span className="flex flex-center">
        <p>Or continue with</p>
      </span>

      <div className="alt-auth flex flex-row">
        <span onClick={handleGithubAuth}>
          <i className="devicon-github-original"></i>
        </span>
        <span>
          <i className="devicon-google-plain"></i>
        </span>
      </div>
    </div>
  )
}

export async function loader() {
  const status = await authMe();

  if (status.data.authenticated) return redirectDocument("/home")
}

export async function action({ request }) {
  const formData = await request.formData()
  const input = { username: formData.get('username'), password: formData.get('password') }

  const response = await login(input);
  
  if (!response) return redirectDocument("/signin")
}

export default Signin;