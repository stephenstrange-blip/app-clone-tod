import { useLoaderData, Form, Link, redirectDocument } from "react-router-dom";
import { createComment, createReply, loadPost, removeComment, authMe } from "../api/operations";
import { formatDate, REGEX } from "../utils/utils";

import './styles/post.css'
import Reaction from "./components/Reaction";
import CommentItem from "./components/CommentItem";
import { CreateCommentForm } from './components/Form';

function PostPage() {
  const { post } = useLoaderData() || { posts: {} };

  if (!post || typeof post !== 'object') return <></>

  const post_date = formatDate(post.updatedAt)

  return (
    <div className="body_container">
      <h1>PostPage</h1>
      <Link to={"/home"}>
        <button>Home</button>
      </Link>
      <div>
        <span className='flex flex-start flex-col post_item' key={post.id} data-post={post.id}>
          <span className='flex flex-row'>
            <h3>{post.title}</h3>
            <Reaction id_react={post.reactions[0]?.id} reactId={post.reactions[0]?.reactId} postId={post.id} reactorId={post.reactions[0]?.reactorId} />
          </span>
          <p>{`${post_date} - ${post.author?.firstName || 'Anonymous'} ${post.author?.lastName || ''}`}</p>
        </span>
      </div>
      <div className="comment_input">
        <CreateCommentForm postId={post.id} />
      </div>
      <ul>
        <p style={{ fontSize: '14px', opacity: '.6', margin: '1rem', marginInlineStart: 'revert' }}>Comments</p>
        {post.comments?.map(comment =>
          <CommentItem key={comment?.id} postId={post.id} comment={comment} />
        )}
      </ul>
    </div>
  )
}

export async function loader({ params }) {
  const status = await authMe();

  if (!status.data.authenticated) return redirectDocument("/signin")

  const { postId } = params;

  // deter invalid params (i.e. /home/123-abc)
  if (!REGEX.POSTID.test(postId)) {
    return redirectDocument('/home')
  }

  const response = await loadPost(Number(postId));
  return { post: response?.data?.post }
}

export async function action({ request }) {
  const formData = await request.formData();
  const intent = formData.get('intent')

  if (intent === 'createComment')
    await createComment({
      postId: formData.get('postId'),
      message: formData.get('comment')
    });

  if (intent === 'removeComment')
    await removeComment({
      postId: formData.get('postId'),
      commentId: formData.get('commentId')
    })

  if (intent === 'createReply')
    await createReply({
      message: formData.get('reply'),
      postId: formData.get('postId'),
      commentId: formData.get('commentId')
    })

  return location.reload()
}

export default PostPage;

