// APP.JSX: Sovelluksen pääkomponentti - sisältää kaiken sovelluksen logiikan

import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/NewBlog'
import LoginForm from './components/Login_form'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import logger from './utils/logger'

const App = () => {
  // Sovelluksen tila
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  const showMessage = (message, duration = 5000) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), duration)
  }

  // Kirjautumislomakkeen käsittelijät
  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault()

    try {
      const loggedInUser = await loginService.login({ username, password })
      
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedInUser))
      blogService.setToken(loggedInUser.token)
      setUser(loggedInUser)
      showMessage(`Welcome ${loggedInUser.name}`)

      setUsername('')
      setPassword('')
    } catch (exception) {
      logger.error('Login failed:', exception)
      const errorMsg = exception.response?.data?.error || exception.message || 'Login failed'
      showMessage(errorMsg)
    }
  }

  // Tarkista onko käyttäjä jo kirjautunut sivun latautuessa
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      
      // Haetaan kaikki blogit uudelleen sen sijaan että lisättäisiin vain yksi
      // Tämä varmistaa että saamme täydet user-tiedot mukaan
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
      
      showMessage(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
      blogFormRef.current.toggleVisibility()
    } catch (exception) {
      logger.error('Error adding blog:', exception)
      const errorMsg = exception.response?.data?.error || exception.message || 'Failed to add blog'
      showMessage(`Error: ${errorMsg}`)
    }
  }

  const likeBlog = async (id) => {
    try {
      const blogToUpdate = blogs.find(blog => blog.id === id)
      if (!blogToUpdate) {
        showMessage('Blog not found!')
        return
      }

      const returnedBlog = await blogService.like(id)
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      showMessage(`Liked "${returnedBlog.title}"!`)
    } catch (exception) {
      logger.error('Error liking blog:', exception)
      const errorMsg = exception.response?.data?.error || exception.message || 'Failed to like blog'
      showMessage(`Error: ${errorMsg}`)
    }
  }

  const removeBlog = async (id) => {
    try {
      const blogToRemove = blogs.find(blog => blog.id === id)
      if (!blogToRemove) {
        showMessage('Blog not found!')
        return
      }

      if (window.confirm(`Remove blog "${blogToRemove.title}" by ${blogToRemove.author}?`)) {
        await blogService.remove(id)
        setBlogs(blogs.filter(blog => blog.id !== id))
        showMessage(`Blog "${blogToRemove.title}" removed successfully!`)
      }
    } catch (exception) {
      logger.error('Error removing blog:', exception)
      const errorMsg = exception.response?.data?.error || exception.message || 'Failed to remove blog'
      showMessage(`Error: ${errorMsg}`)
    }
  }

  // Hakee blogit kun käyttäjä on kirjautunut
  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) => {
        setBlogs(blogs)
      })
    }
  }, [user])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setBlogs([])
    blogService.setToken(null)
  }


  return (
    <div className="container">
      <h1>Blog application</h1>

      <Notification message={errorMessage} />

      {user === null && (
        <Togglable buttonLabel='login'>
          <LoginForm
            handleSubmit={handleLoginSubmit}
            handleUsernameChange={handleUsernameChange}
            handlePasswordChange={handlePasswordChange}
            username={username}
            password={password}
          />
        </Togglable>
      )}

      {user && (
        <div className='loggedIn'>
          <div className="user-header">
            <p>{user.name} logged in</p>
            <button onClick={handleLogout}>log out</button>
          </div>

          <Togglable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>

          <h2>Blogs</h2>
          <ul>
            {blogs
              .sort((a, b) => b.likes - a.likes)
              .map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                onLike={likeBlog}
                onRemove={removeBlog}
                currentUser={user}
              />
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
