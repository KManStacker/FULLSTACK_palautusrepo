import { useState } from 'react'

const Button = (props) => {

  return (
    <div>
      <button onClick={() => props.setGood(props.good + 1)}>good</button>
      <button onClick={() => props.setNeutral(props.neutral + 1)}>neutral</button>
      <button onClick={() => props.setBad(props.bad + 1)}>bad</button>
    </div>
  )
}

const StatisticLine = (props) => {
  if (props.text === "positive") {
    return (
      <div>
        <p>{props.text} {props.value} %</p>
      </div>
    )
  }
  else {
    return (
      <div>
        <p>{props.text} {props.value}</p>
      </div>
    )
  }
}

const Statistics = (props) => {

  if (props.good + props.neutral + props.bad > 0) {
    return (
      <div>
      <StatisticLine text="good" value ={props.good} />
      <StatisticLine text="neutral" value ={props.neutral} />
      <StatisticLine text="bad" value ={props.bad} />
      <StatisticLine text="all" value ={props.good + props.neutral + props.bad} />
      <StatisticLine text="average" value ={(props.good*1 + props.neutral*0 + props.bad*(-1)) / (props.good + props.neutral + props.bad)} />
      <StatisticLine text="positive" value ={props.good / (props.good + props.neutral + props.bad) * 100} />  
      </div>
      
      /*<div>
        <h1>statistics</h1>
        <p>good {props.good}</p>
        <p>neutral {props.neutral}</p>
        <p>bad {props.bad}</p>
        <p>all {props.good + props.neutral + props.bad}</p> 
        <p>average {(props.good*1 + props.neutral*0 + props.bad*(-1)) / (props.good + props.neutral + props.bad)}</p> 
        <p>positive {props.good / (props.good + props.neutral + props.bad) * 100} %</p> 
      </div> */
    )
  }
  else {
    return (
      <div>
      <p>No feedback given</p>
      </div>
    )
  } 
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (

    <div>
      <h1>give feedback</h1>
      <Button good={good} neutral={neutral} bad={bad} setGood={setGood} setNeutral={setNeutral} setBad={setBad}/>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App