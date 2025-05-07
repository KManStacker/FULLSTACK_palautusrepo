const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')

const api = supertest(app)

// @@@@@ test data -> blogs @@@@@

const listWithNoBlogs = []

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const originalBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

// @@@@@ tests @@@@@

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(originalBlogs)
})

describe('Blog API tests', () => {

  test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  })

  test('getting right amount of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, originalBlogs.length)
  })
  
  test('blogs have an "id"', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    // console.log(response.body)
    // console.log(response.body[0].id)
    assert.ok(response.body[0].id)
    assert. strictEqual(response.body[0]._id, undefined)
  })
})

describe('blog addition', () => {
  
  test('can add blogs with post', async () => {
    const newBlog = {
      title: 'New blog added with post',
      author: 'Horatio Hornsby',
      url: 'https://pavebenedictus.lol/',
      likes: 666
    }
    const beforePost = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(beforePost.body.title, newBlog.title)
    assert.strictEqual(beforePost.body.author, newBlog.author)
    assert.strictEqual(beforePost.body.url, newBlog.url)
    assert.strictEqual(beforePost.body.likes, newBlog.likes)

    const newBlogs = await api.get('/api/blogs')
    assert.strictEqual(newBlogs.body.length, originalBlogs.length + 1)
  })

  test('add blog with no likes', async () => {
    const newBlogNoLikes = {
      title: 'New likeless blog with post',
      author: 'Most Likely',
      url: 'https://thumbsup.like/'
    }
    const beforePost = await api
      .post('/api/blogs')
      .send(newBlogNoLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(beforePost.body.likes, 0)
  })

  test('posting a blog without title or url', async () => {
    const newBlogNoTitleOrUrl = {
      author: 'NoTitle NoUrl',
      likes: 22
    }
    await api
      .post('/api/blogs')
      .send(newBlogNoTitleOrUrl)
      .expect(400)
    
    const newBlogNoTitle = {
      author: 'NoTitle',
      url: 'https://no-title.com',
      likes: 11
    }
    await api
      .post('/api/blogs')
      .send(newBlogNoTitle)
      .expect(400)
    
    const newBlogNoUrl = {
      title: 'NoUrl',
      author: 'Urlessless Less',
      likes: 33
    }
    await api
      .post('/api/blogs')
      .send(newBlogNoUrl)
      .expect(400)
  })
})

describe('blog deletion', () => {
  test('deleting a blog', async () => {
    const beforeBlogs = await api
        .get('/api/blogs/')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const blogToDelete = beforeBlogs.body[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
    const afterBlogs = await api
        .get('/api/blogs/')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(afterBlogs.body.length, beforeBlogs.body.length - 1)
  })
})

describe('blog update', () => {
  test('updating a blog', async () => {
    const beforeBlogs = await api
        .get('/api/blogs/')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const blogToUpdate = beforeBlogs.body[0]
    const likesBeforeUpdate = blogToUpdate.likes
    const newLikes = { likes: likesBeforeUpdate + 9 }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newLikes)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const afterBlogs = await api
      .get('/api/blogs/')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    const updatedBlog = afterBlogs.body[0]
    const likesAfterUpdate = updatedBlog.likes
    assert.strictEqual(likesAfterUpdate, likesBeforeUpdate + 9)
  })
})


after(async () => {
  await mongoose.connection.close()
})