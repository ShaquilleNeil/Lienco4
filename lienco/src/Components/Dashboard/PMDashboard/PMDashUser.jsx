import React from 'react'
import './PMDashUser.css'
import Header from '../Header.jsx'
import Sidebar from '../SideBar.jsx'
import im1 from '../../Images/projects.jpg';


const DashUser = ({onLogout, userRole}) => {

  // const cardData = [
  //   {
  //     id: 1, // Added unique ID
  //     title: "Projects",
  //     description: "Track your projects with ease. ",
  //     imageUrl: im1
  //   },
  //   {
  //     id: 2, // Added unique ID
  //     title: "Resources",
  //     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum in labore laudantium deserunt fugiat numquam.",
  //     imageUrl: "https://i.imgur.com/QYWAcXk.jpeg"
  //   },
  //   {
  //     id: 3, // Added unique ID
  //     title: "Contact Project Manager",
  //     description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rerum in labore laudantium deserunt fugiat numquam.",
  //     imageUrl: "https://i.imgur.com/QYWAcXk.jpeg"
  //   },
  // ];
  return (
    <div className='dashuser'>
      <Header onLogout={onLogout} />
      <Sidebar userRole={userRole} />

 

     <div className='cards'>

      <figure>
    <img src="https://picsum.photos/id/287/250/300" alt="Mountains"/>
    <figcaption>The Day</figcaption>
</figure>
<figure >
    <img src="https://picsum.photos/id/475/250/300" alt="Mountains"/>
    <figcaption>The Night</figcaption>
</figure>

<figure>
    <img src="https://picsum.photos/id/287/250/300" alt="Mountains"/>
    <figcaption>The Day</figcaption>
</figure>

<figure>
    <img src="https://picsum.photos/id/287/250/300" alt="Mountains"/>
    <figcaption>The Day</figcaption>
</figure>

<figure>
    <img src="https://picsum.photos/id/287/250/300" alt="Mountains"/>
    <figcaption>The Day</figcaption>
</figure>

<figure>
    <img src="https://picsum.photos/id/287/250/300" alt="Mountains"/>
    <figcaption>The Day</figcaption>
</figure>

</div>
    </div>
  )
}

export default DashUser
