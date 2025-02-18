const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return <div className="notificationGood">{message}</div>
  }
  
  export default Notification