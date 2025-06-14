import { Form } from "react-router-dom"

function PostDialog({closeDialog, dialogRef, handlePostSubmit}) {
  return (
    <dialog ref={dialogRef}>
      <Form action="/home" onSubmit={handlePostSubmit}>
        <h1>What's currently in your thoughts?</h1>
        <p>
          <label htmlFor="title">Title: </label>
          <input required type="text" name="title" id="title" placeholder="Why are you my remedy?"/>
        </p>
        <p>
          <label htmlFor="message">Message:</label>
          <textarea name="message" id="message" cols="30" rows="10" defaultValue={"Explain what you're feeling right now..."}>
            
          </textarea>
        </p>
        {/* TODO: ADD INPUT FOR CATEGORY */}
        <input hidden type="text" name="intent" defaultValue="create_post" />
        
        <div className="flex flex-center flex-row">
          <button typeof="submit">Submit</button>
          <div onClick={closeDialog} className="button_cancel">Cancel</div>
        </div>
      </Form>
    </dialog>
  )
}

export default PostDialog

// { title, message, categoryId } 