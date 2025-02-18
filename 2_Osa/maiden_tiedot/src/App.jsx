import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({newFilter, handleFilterChange}) =>
  <div>
    filter shown with <input value={newFilter} onChange={handleFilterChange} />
  </div>

const ListOfCountries = ( {countriesToShow, handleShowClickedCountry, handleFilterChange} ) => {
  if (countriesToShow.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  }

  if (countriesToShow.length > 1) {
    return (
      <div>
        {countriesToShow.map(country => 
          <div key={country.name.common}>
            {country.name.common}
            <button onClick={() => {
              handleShowClickedCountry(country) 
              handleFilterChange({ target: { value: country.name.common }})}}
            >show</button>
          </div>)}
      </div>
    )
  }

  if (countriesToShow.length === 1) {
    return (
      <TheCountry country={countriesToShow[0]} />
    )
  }

  if (countriesToShow.length === 0) {
    return (
      <div>
        No matches, specify another filter
      </div>
    )
  }
}

const TheCountry = ({country}) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h2>Languages:</h2>
      <ul>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
      </ul>
      <img src={country.flags.png} alt={country.name.common} />
    </div>
  )
}


const App = () => {
  const [newFilter, setNewFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [showClickedCountry, setShowClickedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log(response.data)
        setCountries(response.data)
      })
  }, [])
  
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const handleShowClickedCountry = (country) => {
    setShowClickedCountry(country)
  }  

  const countriesToShow = newFilter === ''
    ? countries
    : countries.filter(country => country.name.common.toLowerCase().includes(newFilter.toLowerCase()))
    console.log(countriesToShow)
  
  return (
    <div>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <ListOfCountries 
      countriesToShow={countriesToShow} 
      handleShowClickedCountry={handleShowClickedCountry}
      handleFilterChange={handleFilterChange} />
    </div>
  )
}

export default App