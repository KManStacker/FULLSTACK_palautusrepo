require('dotenv').config()
const express = require('express')
// const morgan = require('morgan')
// const cors = require('cors')
const Person = require('./models/person')

const app = express()

// morgan.token('body', (req) => JSON.stringify(req.body))
// let persons = []

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
// app.use(cors())

/*
let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456 789"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]
*/

app.get('/', (request, response) => {
  response.send('<h1>PHONEBOOK</h1>')
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      response.send(`
                <p>Phonebook has info for ${count} people</p>
                <p>${new Date()}</p>
            `)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).send({ error: 'person nada existense' })
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).send({ error: 'person nada existense' })
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ error: 'name missing' })
  }
  if (!body.number) {
    return response.status(400).json({ error: 'number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.status(201).json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  if (!name) {
    return response.status(400).json({ error: 'name missing' })
  }
  if (!number) {
    return response.status(400).json({ error: 'number missing' })
  }

  const personData = { name, number }

  Person.findByIdAndUpdate(
    request.params.id,
    personData,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (!updatedPerson) {
        response.status(404).send({ error: 'person nada existense, cannot update' })
      } else {
        response.json(updatedPerson)
      }
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error('Handling error:',error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  response.status(500).json({ error: 'Internal server error' })
  //    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001 // const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} at -> http://localhost:${PORT}/`)
})
