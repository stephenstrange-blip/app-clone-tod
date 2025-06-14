import { Form, useLoaderData } from "react-router-dom";
import { loadProfile } from "../api/operations";
import { ProfileSection } from "./components/Section";
import { FULFILLED } from "../utils/utils";

import testIcon from '../assets/react.svg'
import './styles/profile.css'

export async function loader() {
  const profile = await loadProfile();

  return { profile }
}


function Profile() {
  // const windowHeight = document.documentElement.clientHeight;
  const windowHeight = window.innerHeight

  if (!localStorage.getItem("token")) {
    location.replace('/signin')
  }

  const data = useLoaderData();
  const profile = FULFILLED.includes(data?.profile?.status) ? data?.profile?.data?.profile : (data?.profile?.reason || data?.profile)

  return (
    <div className="body_container" style={{height: `${windowHeight}px`}}>
      <section className="flex flex-center flex-col profile_page" >
        <header className="profile_header flex flex-row">
          <p>
            <img src={testIcon} alt="#" />
          </p>
          <div className="flex flex-center flex-col">
            <p>{`${profile.firstName} ${profile.lastName}`}</p>
            <p>email@email.com</p>
          </div>
        </header>
        <main className="profile_main">
          {/* TODO: Make an operation for updating profile */}
          <Form action="" method="post">
            <div className="flex flex-col">
              <span className="flex flex-col">
                <label htmlFor="firstName">First Name</label>
                <input type="text" name="firstName" id="firstName" defaultValue={profile.firstName} />
              </span>
              <span className="flex flex-col">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" name="lastName" id="lastName" defaultValue={profile.lastName} />
              </span>
              <span className="flex flex-col">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" defaultValue={profile.title} />
              </span>
            </div>
            <div className="flex flex-col">
              <label htmlFor="bio">Bio</label>
              <textarea type="text" name="bio" id="bio" defaultValue={profile.bio} />
            </div>
            <div>
              <button>Reset</button>
              <button type="submit">Save Changes</button>
            </div>
          </Form>
        </main>
      </section>
    </div>
  )

}

export default Profile;