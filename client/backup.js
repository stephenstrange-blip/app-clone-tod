export function FollowerSection({ fwer }) {
  return (
    <section className="followers_section">
      <h1>Followers</h1>
      <ul>
        {fwer.map((item) => {
          return (
            <li
              key={item.follower.userId}
              data-followerid={item.follower.userId}
            >
              <p>{`${item.follower.firstName} ${item.follower.lastName}`}</p>
              <button>Follow Back</button>
              <button>Remove</button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function FollowingSection({ fwing }) {
  return (
    <section className="following_section">
      <h1>Following</h1>
      <ul>
        {fwing.map((item) => {
          return (
            <li
              key={item.following.userId}
              data-followingid={item.following.userId}
            >
              <p>{`${item.following.firstName} ${item.following.lastName}`}</p>
              <button>Follow Back</button>
              <button>Remove</button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function ToRequestSection({ reqTo, acceptRequest, rejectRequest }) {
  return (
    <section className="followrequest_section">
      <h1>Follow Requests</h1>
      <ul>
        {reqTo.map((item) => {
          return (
            <li
              key={item.target ? item.target.userId : item.requester.userId}
              data-requesterid={
                item.target ? item.requesterId : item.requester.userId
              }
              data-targetid={item.target ? item.target.userId : item.targetId}
            >
              <p>{`${item.target ? item.target.firstName : item.requester.firstName} ${item.target ? item.target.lastName : item.requester.lastName}`}</p>
              <button onClick={acceptRequest}>Accept</button>
              <button onClick={rejectRequest}>Reject</button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function FromRequestSection({ reqFrom, rejectRequest }) {
  return (
    <section className="myrequest_section">
      <h1>My Requests</h1>
      <ul>
        {reqFrom.map((item) => {
          return (
            <li
              key={item.target ? item.target.userId : item.requester.userId}
              data-requesterid={
                item.target ? item.requesterId : item.requester.userId
              }
              data-targetid={item.target ? item.target.userId : item.targetId}
            >
              <p>{`${item.target ? item.target.firstName : item.requester.firstName} ${item.target ? item.target.lastName : item.requester.lastName}`}</p>
              <button onClick={rejectRequest}>Cancel Request</button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/*
  const _requestsFrom = loadRequest({ fromRequests: true });
  const _requestsTo = loadRequest({ fromRequests: false });
  const _followers = loadNetwork({ myFollowers: true });
  const _following = loadNetwork({ myFollowers: false });


  const [reqTo, setReqTo] = useState(FULFILLED.includes(rTo.status) ? rTo.value?.data : rTo.reason)
  const [reqFrom, setReqFrom] = useState(FULFILLED.includes(rFrom.status) ? rFrom.value?.data : rFrom.reason);
  const [fwer, setFwer] = useState(FULFILLED.includes(followers.status) ? followers.value?.data : followers.reason);
  const [fwing, setFwing] = useState(FULFILLED.includes(following.status) ? following.value?.data : following.reason);

<RequestSection className="followrequest_section" header={'Follow Requests'} requests={reqTo}>
     <button onClick={acceptRequest}>Accept</button>
     <button onClick={rejectRequest}>Reject</button>
   </RequestSection>
   <RequestSection className="myrequest_section" header={'My Requests'} requests={reqFrom}>
     <button onClick={rejectRequest}>Cancel Request</button>
   </RequestSection>
   <FollowSection follows={fwer} header={'My Followers'}>
     <button>Follow Back</button>
     <button>Remove</button>
   </FollowSection>

   <FollowSection follows={fwing} header={'Following'}>
     <button>Unfollow</button>
   </FollowSection>
*/
