import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import Error from './components/Error'
import './index.css'

const Filter = ({newFilter, handleFilterChange}) =>
  <div>
    filter shown with <input value={newFilter} onChange={handleFilterChange} />
  </div>

const PersonForm = ({addPerson, newName, handleNameChange, newNumber, handleNumberChange}) =>
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} /> 
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} /> 
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>

const Persons = ({ personsToShow, deletePerson}) => 
  <div>
    {personsToShow.map(person =>
      <p key={person.id}>
        {person.name} {person.number}
        <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
      </p>
    )}
  </div>

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons)
      })
  }, [])
  console.log('render', persons.length, 'persons')


  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)

    const personObject = {
      name: newName, 
      number: newNumber 
    }

    const oldPerson = (persons.find(person => person.name === newName))
    if (oldPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(oldPerson.id, personObject)
          .then((returnedPerson) => {
            setPersons(persons.map(person => person.id !== oldPerson.id ? person : returnedPerson))
            setNotificationMessage(`"${personObject.name}'s" number succesfully changed to "${personObject.number}"`)
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          })
          .catch((error) => {
            setErrorMessage(
              `Person "${personObject.name}" was already removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter(person => person.id !== oldPerson.id))
            
          })
        return
      } 
    }
    
    personService
      .create(personObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setNotificationMessage(`Added "${personObject.name}" to phonebook`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })
      .catch((error) => {
        setErrorMessage(
          error.response.data.error
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNotificationMessage(`"${name}" removed from phonebook`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }


  const personsToShow = newFilter === ''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
        <Notification message={notificationMessage} />
        <Error message={errorMessage} />
        <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h2>Add a new person or update number</h2>
        <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
        <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App