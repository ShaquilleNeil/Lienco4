const StatusDisplay = ({ status }) => {

  
  const getColor = (status) => {
    let color
    switch (status) {
      case 'done':
        color = 'rgb(0,255,9)'
        break
      case 'working on it':
        color = 'rgb(255,247,0)'
        break
      case 'stuck':
        color = 'rgb(219,27,27)'
        break
      default:
        color = 'rgb(183,183,183)'
    }
    return color
  }

  return (
    <div
      className="status-display"
      style={{ backgroundColor: getColor(status) }}
    >
      {status}
    </div>
  )
}

export default StatusDisplay
