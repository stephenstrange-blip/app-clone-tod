import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { loadProfile, updateProfile } from "../api/operations";
import { FULFILLED, PROFILE_KEYS } from "../utils/utils";
import { useRef, useState } from "react";

import testIcon from '../assets/react.svg'
import './styles/profile.css'

// const windowHeight = document.documentElement.clientHeight;
const windowHeight = window.innerHeight

export async function loader() {
  const profile = await loadProfile();
  return { profile }
}

export async function action({ request }) {
  let input = {}
  const formData = await request.formData();

  const currentProfile = JSON.parse(formData.get("profile"))

  for (let key of PROFILE_KEYS) {
    let newValue = formData.get(key);

    // Only update new profile values to server
    if (currentProfile[key] !== newValue)
      input[key] = newValue;
  }

  await updateProfile(input);
  return
}

function Profile() {
  if (!localStorage.getItem("token")) {
    location.replace('/signin')
  }

  const fetcher = useFetcher();
  const submitBtnRef = useRef(null);

  const data = useLoaderData();
  const profile = FULFILLED.includes(data?.profile?.status) ? data?.profile?.data?.profile : (data?.profile?.reason || data?.profile)

  const [newProfile, setNewProfile] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    title: profile.title,
    bio: profile.bio
  })

  const handleInput = (e) => {
    let key = e.currentTarget.name,
      value = e.currentTarget.value,
      temp = {
        ...newProfile
      }

    // Check for new inputs
    if (profile[key] !== value)
      submitBtnRef.current.classList.toggle('disabled', false)
    else
      submitBtnRef.current.classList.toggle('disabled', true)

    temp[key] = value;
    setNewProfile(temp);
  }

  const resetInput = (e) => {
    e.preventDefault();

    setNewProfile({
      firstName: profile.firstName,
      lastName: profile.lastName,
      title: profile.title,
      bio: profile.bio
    })
    submitBtnRef.current.classList.toggle('disabled', true)
  }



  return (
    <div className="body_container" style={{ height: `${windowHeight}px` }}>
      <section className="flex flex-center flex-col profile_page" >
        <header className="profile_header flex flex-row">
          <p>
            <img src={testIcon} alt="#" />
          </p>
          <div className="flex flex-center flex-col">
            <p>{`${profile.firstName} ${profile.lastName}`}</p>
            <p>{profile.title}</p>
          </div>
        </header>
        <main className="profile_main">
          {/* TODO: Make an operation for updating profile */}
          <fetcher.Form action="/home/profile" method="post">
            <div className="flex flex-col">
              <span className="flex flex-col">
                <label htmlFor="firstName">First Name</label>
                <input type="text" name="firstName" id="firstName" value={newProfile.firstName} onChange={handleInput} />
              </span>
              <span className="flex flex-col">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" name="lastName" id="lastName" value={newProfile.lastName} onChange={handleInput} />
              </span>
              <span className="flex flex-col">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" value={newProfile.title} onChange={handleInput} />
              </span>
            </div>
            <div className="flex flex-col">
              <label htmlFor="bio">Bio</label>
              <textarea type="text" name="bio" id="bio" value={newProfile.bio} onChange={handleInput} />
            </div>
            <input type="hidden" name="profile" defaultValue={JSON.stringify(profile)} />
            <div>
              <button onClick={resetInput}>Reset</button>
              <button className={'disabled'} ref={submitBtnRef} type="submit" >{fetcher.state !== "idle" ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </fetcher.Form>
        </main>
      </section>
    </div>
  )
}


export default Profile;