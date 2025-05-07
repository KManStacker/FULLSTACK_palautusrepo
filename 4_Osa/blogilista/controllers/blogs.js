const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

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

blogsRouter.post('/', (request, response, next) => {
    const body = request.body

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0
    })

    blog.save()
        .then(savedBlog => {
            response.status(201).json(savedBlog)
        })
        .catch(error => next(error))
})

blogsRouter.delete('/:id', async (request, response, next) => {
    //try {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    //} catch (error) {
    //  next(error)
    //}
})

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