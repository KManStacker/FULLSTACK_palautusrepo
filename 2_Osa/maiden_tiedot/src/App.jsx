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
            >show
            </button>
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
      <Weather country={country} />
    </div>
  )
}

const Weather = ({country}) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    axios
      //.get(`https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::simple&place=rovaniemi&parameters=temperature,windspeedms`)  
      .get(`https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0&request=getFeature&storedquery_id=fmi::observations::weather::simple&place=${country.capital}&parameters=temperature,windspeedms`)
      .then(response => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "application/xml");
        console.log(response.data)
  
        let temperature = "N/A";
        let windspeed = "N/A";
  
        const elements = xmlDoc.getElementsByTagName("BsWfs:BsWfsElement");
        
        for (let element of elements) {
          const paramName = element.getElementsByTagName("BsWfs:ParameterName")[0]?.textContent;
          const paramValue = element.getElementsByTagName("BsWfs:ParameterValue")[0]?.textContent;
          
          if (paramName === "temperature") {
            //console.log('HEREEEEEEE', paramValue, 'C')
            temperature = paramValue;
          } else if (paramName === "windspeedms") {
            //console.log('HEREEEEEEE2', paramValue, 'ms')
            windspeed = paramValue;
          }
        }
  
        setWeather({ temperature, windspeed });
      })
      .catch((error) => {
        console.error("Error fetching weather:", error);
        setWeather({ temperature: "N/A", windspeed: "N/A" });
      });
  }, [country]);

  if (!weather) return <p>Loading weather...</p>;
      
  return (
    <div>
      <h2>Weather in {country.capital}:</h2>
      <p>Temperature: {weather.temperature} Celcius</p>
      <p>Wind: {weather.windspeed} m/s</p>
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
        //console.log(response.data)
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