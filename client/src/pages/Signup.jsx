import Input from "./components/Input";
import './styles/signin.css'
import lockIcon from '../assets/lock.svg'
import personIcon from '../assets/person.svg'

import { CustomForm } from "./components/Form";
import { Link, redirectDocument } from "react-router-dom";
import { useRef, useState } from "react";

import { signup, authMe, authGitHub } from "../api/operations";

function Signup() {
  const handleGithubAuth = async () => {
    try {
      // cannot use AXIOS or any fetch API as those don't respect CORS headers on redirects
      window.location.href = import.meta.env.VITE_BASE_SERVER_URL + '/auth/github'

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="body_container flex flex-center">
      <div className="flex flex-center flex-col">
        <SignUpForm></SignUpForm>
        <h2>Already have an account? <Link to={"/signin"}>Login here</Link></h2>
        <span className="flex flex-center continue">
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
    </div>
  )
}

function SignUpForm() {
  const [password, setPassword] = useState('');
  const btnRef = useRef()

  const confirmPassword = (e) => {
    let value = e.currentTarget.value;
    let parent = e.currentTarget.parentElement;

    if (value === password) {
      parent.style['border-bottom'] = '1px solid green'
      btnRef.current.disabled = false
    } else {
      parent.style['border-bottom'] = '1px solid red'
      btnRef.current.disabled = true
    }
  }


  return (
    <CustomForm classname={"signup"} url={'/signup'} page={"Signup"} ref={btnRef} disabled={true}>
      <h1>Sign In</h1>
      <h2>Welcome to this App</h2>

      <Input autofocus={true} type={"text"} identifier={"username"} placeholder={"Enter your username / email"} img={{ src: personIcon, alt: "#" }}></Input>
      {/* <Input type={"text"} identifier={"firstName"} placeholder={"Enter your firstName"} img={{ src: rightArrowIcon, alt: "#" }}></Input>
      <Input type={"text"} identifier={"lastName"} placeholder={"Enter your lastname"} img={{ src: rightArrowIcon, alt: "#" }}></Input> */}

      <Input
        value={password}
        type={"password"}
        identifier={"password"}
        img={{ src: lockIcon, alt: "#" }}
        placeholder={"Enter your password"}
        handleChange={e => setPassword(e.currentTarget.value)}>
      </Input>

      <Input
        type={"password"}
        handleChange={confirmPassword}
        identifier={"cfm-password"}
        placeholder={"Confirm password"}
        img={{ src: lockIcon, alt: "#" }}>
      </Input>
    </CustomForm>
  )
}

export async function loader() {
  const status = await authMe();

  if (status.data.authenticated) return redirectDocument("/home")
}

export async function action({ request }) {

  const formData = await request.formData()
  const username = formData.get('username')
  const password = formData.get('password')
  const cfm_password = formData.get('cfm_password')

  if (cfm_password !== password) {
    redirectDocument("/signup");
  }

  const input = {
    username,
    password,
    cfm_password
  }

  const response = await signup(input);
  if (!response) return redirectDocument("/signup")

  return redirectDocument('/signin')
}

export default Signup