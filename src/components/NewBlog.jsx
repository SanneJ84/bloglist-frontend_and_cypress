// Uuden blogin lisäämislomakkeen komponentti

import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: title,
      url: url,
      author: author,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div className="form-field">
          <label htmlFor="title-input">Title:</label>
          <input
            id="title-input"
            type="text"
            placeholder="Enter blog title"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="url-input">URL:</label>
          <input
            id="url-input"
            type="url"
            placeholder="Enter blog URL"
            value={url}
            onChange={event => setUrl(event.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="author-input">Author:</label>
          <input
            id="author-input"
            type="text"
            placeholder="Enter author name"
            value={author}
            onChange={event => setAuthor(event.target.value)}
          />
        </div>
        <button id="create-button" type="submit">Create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm