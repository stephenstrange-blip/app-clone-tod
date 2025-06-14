import { isEmpty as _isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import Reaction from './Reaction';
import { formatDate } from '../../utils/utils';

export function RequestSection({ className, header, requests, children }) {
  if (!(Array.isArray(requests))) return;

  return (
    <section className={className}>
      <h1>{header}</h1>
      <ul>
        {
          requests.map(item => {
            return (
              <li key={item.target ? item.target.userId : item.requester.userId} data-requesterid={item.target ? item.requesterId : item.requester.userId} data-targetid={item.target ? item.target.userId : item.targetId} >
                <p>{`${item.target ? item.target.firstName : item.requester.firstName} ${item.target ? item.target.lastName : item.requester.lastName}`}</p>
                {children}
              </li>
            )
          })
        }
      </ul>
    </section>
  )
}

export function FollowSection({ follows, header, children }) {
  if (!(Array.isArray(follows))) return;
  return (
    <section className="followers_section">
      <h1>{header}</h1>
      <ul>
        {
          follows.map(item => {
            const id = item.follower?.userId || item.following.userId
            return (
              <li key={id} data-followerid={id}>
                <p>{`${item.follower?.firstName || item.following?.firstName} ${item.follower?.lastName || item.following.lastName}`}</p>
                {children}
              </li>
            )
          })
        }
      </ul>
    </section>
  )
}

export function PostSection({ posts }) {
  if (!(Array.isArray(posts))) return;
  
  return (
    <section className='post_section'>
      <h1>Posts</h1>
      <ul>
        {
          posts.map(post => {
            const date = formatDate(post.updatedAt);
            const myReaction = post.reactions ? post.reactions[0] : null;
            return (
              <li className='flex flex-start flex-col post_item' key={post.id} data-post={post.id}>
                <Link to={`/home/${post.id}`}>
                  <span className='flex flex-row'>
                    <h3>{post.title}</h3>
                    <Reaction id_react={myReaction?.id} reactId={myReaction?.reactId} postId={post.id} reactorId={myReaction?.reactorId} />
                  </span>
                  <p>{`${date} - ${post.author?.firstName || 'Anonymous'} ${post.author?.lastName || ''}`}</p>
                  <span className='flex flex-start flex-row'>
                    <i>{post._count.comments} Comments</i>
                    <i>{post._count.reactions} Reactions</i>
                  </span>
                </Link>
              </li>
            )
          })
        }
      </ul>
    </section>
  )

}

function Info({ _key, value }) {
  return (
    <p>
      <i>{`${_key}: `}</i>
      <i>{value}</i>
    </p>
  )
}

