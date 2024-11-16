import React from 'react'
import './DashUser.css'
import Header from './Header.jsx'
import Sidebar from './SideBar.jsx'
import Card from './Card.jsx';
import im1 from '../Images/projects.jpg';

const DashUser = ({ onLogout }) => {

  const cardData = [
    {
      id: 1, // Added unique ID
      title: "Projects",
      description: "Track your projects with ease. ",
      imageUrl: im1
    },
    {
      id: 2, // Added unique ID
      title: "Resources",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum in labore laudantium deserunt fugiat numquam.",
      imageUrl: "https://i.imgur.com/QYWAcXk.jpeg"
    },
    {
      id: 3, // Added unique ID
      title: "Contact Project Manager",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum in labore laudantium deserunt fugiat numquam.",
      imageUrl: "https://i.imgur.com/QYWAcXk.jpeg"
    },
  ];
  return (
    <div className='dashuser'>
      <Header onLogout={onLogout} />
      <Sidebar  />

      {cardData.map((card) => (
        <Card key={card.id} title={card.title} description={card.description} imageUrl={card.imageUrl} />
      ))}





    </div>
  )
}

export default DashUser
