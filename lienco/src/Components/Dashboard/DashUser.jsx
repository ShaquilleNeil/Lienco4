import React from 'react'
import './DashUser.css'
import Stats from './stats.jsx'
import Header from './Header.jsx'

const DashUser = () => {
  return (
    <div className='dashuser'>
      <Header />
      <Stats />
    </div>
  )
}

export default DashUser
