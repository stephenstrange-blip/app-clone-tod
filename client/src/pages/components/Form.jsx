import { Form, useNavigation } from 'react-router-dom'
import { showBtns, hideBtns } from '../../utils/utils';

export function CustomForm({ children, url, page, ref, disabled, classname }) {
  const nav = useNavigation();
  return (
    <Form action={url} method="post" className={`flex flex-col ${classname}`}>

      {children}

      <button disabled={disabled} ref={ref} type="submit">
        {nav.formAction === url
          ? "Loading..."
          : page}
      </button>
    </Form>
  )
}

export function RemoveCommentForm({ deleteForm, postId, commentId }) {
  return (
    <Form ref={deleteForm} hidden aria-hidden action={`/home/${postId}`} method="post">
      <input name="postId" defaultValue={postId} />
      <input name="intent" defaultValue={'removeComment'} />
      <input type="text" defaultValue={commentId} name="commentId" />
    </Form>
  )
}

export function ReplyForm({ replyForm, postId, commentId, hideReplyForm }) {
  return (
    <Form ref={replyForm} action={`/home/${postId}`} method="post" style={{ display: 'none' }}>
      <label htmlFor="reply"></label>

      <input name="postId" defaultValue={postId} hidden />
      <input name="intent" defaultValue={'createReply'} hidden />
      <input name="commentId" defaultValue={commentId} hidden />
      <input name='reply' id="reply" onClick={showBtns} type="text" placeholder="Write your reply..." required />

      <div className="comment_btns flex flex-row" style={{ display: 'none' }}>
        <button onClick={hideReplyForm} type="reset">Cancel</button>
        <button type="submit">Submit</button>
      </div>
    </Form>
  )
}

export function CreateCommentForm({postId}) {
  return (
    <Form action={`/home/${postId}`} method="post">
      <label htmlFor="comment"></label>

      <input name="postId" defaultValue={postId} hidden />
      <input name="intent" defaultValue={'createComment'} hidden />
      <input name='comment' id="comment" onClick={showBtns} type="text" placeholder="Write your comment..." required />

      <div className="comment_btns flex flex-row" style={{ display: 'none' }}>
        <button onClick={hideBtns} type="reset">Cancel</button>
        <button type="submit">Submit</button>
      </div>
    </Form>
  )
}

