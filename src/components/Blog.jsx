// BLOG-KOMPONENTTI: Näyttää yksittäisen blogin tiedot
// Tämä komponentti osaa näyttää/piilottaa blogin yksityiskohdat ja käsitellä like/remove-toiminnot

import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, onLike, onRemove, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    onLike(blog.id)
  }

  const handleRemove = () => {
    onRemove(blog.id)
  }

  // Tarkista onko tämä blogi kirjautuneen käyttäjän oma
  const isOwnBlog = currentUser && (
    (blog.user && (
      (blog.user.id && currentUser.id && blog.user.id === currentUser.id) ||
      (blog.user.username && currentUser.username && blog.user.username === currentUser.username)
    )) ||
    (typeof blog.user === 'string' && blog.user === currentUser.username) ||
    (!blog.user && blog.author && currentUser.username && blog.author === currentUser.username)
  )

  return (
    <li className="blog">
      <div className="blog-title">
        {blog.title}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div className="blog-details">
          {blog.url && (
            <div className="blog-url">
              URL: <a href={blog.url} target="_blank" rel="noopener noreferrer">
                {blog.url}
              </a>

              <div className="blog-likes">
                Likes: {blog.likes || 0}
                <button className="like-button" onClick={handleLike}>
                  Like
                </button>
              </div>

              <div>Author: {blog.author}</div>

              {isOwnBlog && (
                <button
                  className="remove-button"
                  onClick={handleRemove}
                  style={{ backgroundColor: '#dc3545', color: 'white' }}
                >
                  Remove
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </li>
  )
}

// PropTypes-määrittelyt komponentin odottamille propseille
Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string,
    id: PropTypes.string.isRequired,
    likes: PropTypes.number,
    user: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string
    ])
  }).isRequired,
  onLike: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  currentUser: PropTypes.object
}

export default Blog