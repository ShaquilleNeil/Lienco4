import React from 'react'
import './About.css'
import im from './OIP.jpg'
import {Link} from 'react-router-dom'


const About = () => {
  return (
    <div className='about'>
        <div className='aboutcontent'>
        <div className='image-side'>
              <img src={im} alt='side' />
            </div>
            <div className='info-side'>
              <div className='sub1'><h1>Crafting Quality: The Lienco Constructions Promise</h1></div>

              <div className='sub'><p>At Lienco Constructions, we specialize in transforming visions into reality.<br/> 
              With over a decade of experience in the construction industry, our dedicated team <br/>
              is committed to delivering exceptional quality in every project we undertake.<br/> 
              Whether it’s residential, commercial, or industrial construction, we take pride  in our<br/> attention to detail and innovative approach, ensuring that each build meets our clients' unique needs.</p>
              
              <p>Our extensive portfolio showcases a diverse range of projects, from stunning custom homes to expansive<br/> commercial facilities.
              We understand that every project is a reflection of our clients' aspirations, and we<br/> work closely with them from the initial design phase to final completion.
              Our collaborative process ensures<br/> transparency and communication, allowing us to build strong, lasting relationships with our clients.<br/></p>

              <p>You can send us an Email: <b>Lienco@gmail.com</b> </p>
              <p>Or call us: <b>1-438-778-3730</b></p>
              <p>
                Or you can send us a message by clicking the button below and filling out our form
              </p>
              
              </div>


              <div className='sub3'><Link to="/contact">
              <button><b>Contact Us</b></button>
            </Link></div>
           
            </div>
            
            
             
            </div>
      
    </div>
  )
}

export default About
