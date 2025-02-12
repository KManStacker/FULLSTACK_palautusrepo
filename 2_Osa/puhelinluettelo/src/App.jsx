import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({newFilter, handleFilterChange}) =>
  <div>
    filter shown with <input value={newFilter} onChange={handleFilterChange} />
  </div>

const PersonForm = ({addName, newName, handleNameChange, newNumber, handleNumberChange}) =>
  <form onSubmit={addName}>
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



const Persons = ({personsToShow}) => 
  <div>
    {personsToShow.map(person =>
      <p key={person.name}>{person.name} {person.number}</p>
    )}
  </div>

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'persons')

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

  const addName = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    const nameObject = {
      name: newName, 
      number: newNumber 
    }
    axios
      .post('http://localhost:3001/persons', nameObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
  }

  const personsToShow = newFilter === ''
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />

      <h2>add a new</h2>
      <PersonForm addName={addName} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} />
    </div>
  )

}

export default App