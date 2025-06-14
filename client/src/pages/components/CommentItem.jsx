import { formatDate, showBtns, hideBtns } from "../../utils/utils";
import { loadComment } from "../../api/operations";
import { Form, useSubmit } from "react-router-dom";
import { useRef, useState } from "react";

import deleteIcon from '../../assets/delete.svg'
import replyIcon from '../../assets/reply.svg'
import { RemoveCommentForm, ReplyForm } from "./Form";

function CommentItem({ comment, postId }) {
  if (!comment) return;

  const [replies, setReplies] = useState(null)
  const submit = useSubmit();
  const deleteForm = useRef();
  const replyForm = useRef();

  const comment_date = formatDate(comment.updatedAt)

  const showReplyForm = () =>
    replyForm.current.style['display'] = 'revert'

  const hideReplyForm = () =>
    replyForm.current.style['display'] = 'none'

  const showReplies = async () => {
    const input = {
      postId,
      getReplies: true,
      commentId: comment.id
    }

    const result = await loadComment(input);

    if (Array.isArray(result.data.replies)) {
      console.log("updating replies")
      return setReplies(result.data.replies);
    } else
      return location.reload();
  }

  return (
    <>
      <li key={comment.id} data-comment={comment.id} className="comment_item" style={{ paddingLeft: `${Number(comment.depth) - .5}rem` }}>
        <div className="flex flex-row flex-center delete_comment">
          <h1>{comment.message}</h1>
          <p onClick={showReplyForm}>
            <img src={replyIcon} alt="Del" />
          </p>
          <p onClick={() => submit(deleteForm.current)}>
            <img src={deleteIcon} alt="Del" />
          </p>
        </div>
        <p>{`${comment.author?.firstName || 'Anonymous'} ${comment.author?.lastName || ''}`}</p>
        <p>{`${comment_date}`}</p>

        <RemoveCommentForm deleteForm={deleteForm} postId={postId} commentId={comment.id} />
        <ReplyForm replyForm={replyForm} postId={postId} commentId={comment.id} hideReplyForm={hideReplyForm} />

        <p onClick={showReplies} >{comment.numchild > 0 ? `Show ${comment.numchild} replies` : ''}</p>
      </li >
      <ul>
        {replies?.map(reply =>
          <CommentItem key={reply?.id} postId={postId} comment={reply} />
        )}
      </ul>
    </>
  )
}



export default CommentItem;