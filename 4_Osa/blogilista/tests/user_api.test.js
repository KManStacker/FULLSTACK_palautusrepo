const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

// @@@@@ test data -> users @@@@@

const originalUsers = [
  {
    username: 'test1',
    name: 'test1',
    password: 'test1'
  },
  {
    username: 'test2',
    name: 'test2',
    password: 'test2'
  },
  {
    username: 'test3',
    name: 'test3',
    password: 'test3'
  }
]

// @@@@@ tests @@@@@

beforeEach(async () => {
  await User.deleteMany({})
  
  const saltRounds = 10
  const usersToPromise = originalUsers.map(async (user) => {
    const passwordHash = await bcrypt.hash(user.password, saltRounds)
    return {
      username: user.username,
      name: user.name,
      passwordHash
    }
  })
  
  const usersToPut = await Promise.all(usersToPromise)
  await User.insertMany(usersToPut)
})


describe('User API tests', () => {
  describe('creation of a new user', () => {
    test('succeeds with a fresh username and valid password', async () => {
      const usersAtStart = await User.find({})
      const userLengthAtStart = usersAtStart.length

      const newUser = {
        username: 'newUser1',
        name: 'New User 1',
        password: 'password1'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await User.find({})
      const userLengthAtEnd = usersAtEnd.length

      assert.strictEqual(userLengthAtEnd, userLengthAtStart + 1)

      const usernames = usersAtEnd.map(user => user.username)
      assert(usernames.includes(newUser.username))
    })
    
    test('fails withstatus code 400 and message if username is too short', async () => {
      const userLengthAtStart = await User.find({}).length

      const newUser = {
        username: 't1',
        name: 'Test User1',
        password: 'password11'
      }
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      assert(result.body.error.includes('is shorter than the minimum allowed length (3)'))

      const userLengthAtEnd = await User.find({}).length
      assert.strictEqual(userLengthAtEnd, userLengthAtStart)
    })

    test('fails withstatus code 400 and message if password is too short', async () => {
      const userLengthAtStart = await User.find({}).length

      const newUser = {
        username: 'testaaja1',
        name: 'Test User1',
        password: 'ps'
      }
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      assert(result.body.error.includes('password missing or too short'))

      const userLengthAtEnd = await User.find({}).length
      assert.strictEqual(userLengthAtEnd, userLengthAtStart)
    })

    test('fails withstatus code 400 and message if username is not unique', async () => {
      const userLengthAtStart = await User.find({}).length

      const newUser = {
        username: 'unique',
        name: 'Unique User',
        password: 'uniikki_lumihiutale'
      }
      const firstAdd = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await User.find({})
      const usernames = usersAtEnd.map(user => user.username)
      assert(usernames.includes(newUser.username))

      const secondAdd = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
      assert(secondAdd.body.error.includes('expected `username` to be unique'))

      const usersAtEndEnd = await User.find({})
      assert.strictEqual(usersAtEnd.length, usersAtEndEnd.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
