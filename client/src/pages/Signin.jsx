import Input from "./components/Input";
import './styles/signin.css'
import lockIcon from '../assets/lock.svg'
import personIcon from '../assets/person.svg'

import { CustomForm } from "./components/Form";
import { Link, redirectDocument, useNavigate } from "react-router-dom";
import { login } from "../api/operations";
import { useEffect } from "react";


function Signin() {
  const nav = useNavigate()

  useEffect(() => {
    if (!!localStorage.getItem("token"))
      nav('/home')
  }, [])

  return (
    <div className="body_container flex flex-center">
      <LoginForm></LoginForm>
    </div>
  )
}

function LoginForm() {

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
        <span>
          <i className="devicon-github-original"></i>
        </span>
        <span>
          <i className="devicon-google-plain"></i>
        </span>
      </div>
    </div>
  )
}

export async function action({ request }) {

  const formData = await request.formData()
  const input = { username: formData.get('username'), password: formData.get('password') }

  const response = await login(input);
  console.log('response', response);

  if (!response) return redirectDocument("/signin")

  if (response?.data?.token) {
    localStorage.setItem('token', response.data.token)
    console.log('redirecting...')
    return redirectDocument('/home')
  }

}

export default Signin;