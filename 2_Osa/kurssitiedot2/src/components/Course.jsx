const Course = (props) => {
    return (
      <div>
        <h2>Hello Kitty Web Courses</h2>
        {props.courses.map((course) => (
          <div key={course.id}>
            <Header course={course} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
          </div>
        ))}
      </div>
    )
  }
  
    const Header = (props) => {
      console.log('kurssin nimi', props, props.course.name)
      return (
        <div>
          <h3>{props.course.name}</h3>
        </div>
      )
    };
  
    const Content = (props) => {
      console.log(props)
      return (
        <div>
          {props.parts.map((part) => <Part key={part.id} parts={part} />)}
        </div>
      )
    }
  
    const Part = ({parts}) => {
      console.log('partyn nimi', parts.name)
      return (
        <div>
          <p>{parts.name}: {parts.exercises} </p> 
        </div>
      )
    };
  
    const Total = (props) => {
      console.log('totaali',props)
      const total = props.parts.reduce((s, p) => s + p.exercises, 0)
      return (
        <div>
          <b>Number of exercises: {total}</b>
        </div>
      )
    }; 

export default Course;