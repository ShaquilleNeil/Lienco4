import React, {useState} from 'react'
import './Contact.css'  
// import FI from './cback.jpg'
import { db } from '../firebase'; // Import Firestore config
import { collection, addDoc } from 'firebase/firestore'; // Firestore functions


const Contact = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

    // Handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        // Store data in Firestore
        await addDoc(collection(db, 'contactForms'), formData);
        alert('Your message has been sent!');
        setFormData({ name: '', email: '', message: '' }); // Reset form
      } catch (error) {
        console.error('Error submitting form: ', error);
        alert('There was an error sending your message. Please try again.');
      }
    };



  return (
    <div className='contact'>
        <div className='content'>
          
          <form>
           
            {/* <img src={Back} alt='back' /> */}
            {/* <img src={FI} alt='logo' /> */}
            <h1>Contact Us</h1>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" placeholder='John Doe' required value={formData.name}
            onChange={handleChange} />
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" placeholder='example@email.com' required  value={formData.email}
            onChange={handleChange}/>
            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" placeholder='Write your message here...' required  value={formData.message}
            onChange={handleChange} />
            <div className='btn2'>
              <button type='submit' onClick={handleSubmit} ><b>Submit</b></button>
            </div>
          </form>
          </div>
    </div>
  )
}

export default Contact
