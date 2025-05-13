// controllers/blogs.js
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
// const jwt = require('jsonwebtoken')
// const config = require('../utils/config')
const { userExtractor } = require('../utils/middleware')


// @@@@@ GET ALL BLOGS @@@@@
blogsRouter.get('/', async (request, response, next) => {
  const blog = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blog)
})

// @@@@@ GET ONE BLOG @@@@@
blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// @@@@@ POST a new blog @@@@@
blogsRouter.post('/', userExtractor, async (request, response, next) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }


  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

// @@@@@ DELETE a blog @@@@@
blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'authentication failed' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  if (blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: 'only the creator can delete a blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  
  user.blogs = user.blogs.filter(blogId => blogId.toString() !== request.params.id)
  await user.save()
  response.status(204).end()
   
})

// @@@@@ UPDATE A BLOG @@@@@
blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const newBlog = await Blog.findById(request.params.id)
    if (!newBlog) {
      return response.status(404).json({ error: 'blog not found' })
    }
    if (body.hasOwnProperty('title')) {
      newBlog.title = body.title
    }
    if (body.hasOwnProperty('author')) {
      newBlog.author = body.author
    }
    if (body.hasOwnProperty('url')) {
      newBlog.url = body.url
    }
    if (body.hasOwnProperty('likes')) {
      newBlog.likes = body.likes
    }
    await newBlog.save()
    response.json(newBlog)
})

module.exports = blogsRouter