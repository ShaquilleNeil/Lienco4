import React, {useState} from 'react'
import './Form.css'
import { db } from '../firebase'; // Import Firestore config
import { collection, addDoc } from 'firebase/firestore';

const Form = ({ isAssessVisisble, onClose}) => {
 


    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        assessmentType: '',
        location: '',
        message: ''
    });


    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex

        if (!formData.fullName || formData.fullName.length < 2) {
            newErrors.fullName = "Full Name is required and should be at least 2 characters.";
        }
        if (!emailPattern.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (!formData.phone) {
            newErrors.phone = "Phone number is required.";
        }
        if (!formData.assessmentType) {
            newErrors.assessmentType = "Please select an assessment type.";
        }
        if (!formData.location || formData.location.length < 3) {
            newErrors.location = "Location is required and should be at least 3 characters.";
        }
        if (formData.message.length < 10) {
            newErrors.message = "Message should be at least 10 characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };






    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) { // Only submit if validation passes
            try {
                await addDoc(collection(db, 'Assessment Requests'), formData);
                alert('Form submitted successfully!');
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    assessmentType: '',
                    location: '',
                    message: ''
                });
                onClose(); // Close the form after submission
            } catch (error) {
                console.error("Error submitting form: ", error);
                alert('Failed to submit form');
            }
        }
    };


  return (
    <div className='aform-overlay' onClick={onClose}>
        <div className='aform-container ' onClick={(e) => e.stopPropagation()}></div>
        <div className='aform-content'>

        

        <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} noValidate>
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name:</label>
                            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                            {errors.fullName && <div className="error-message">{errors.fullName}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address:</label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                            {errors.email && <div className="error-message">{errors.email}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number:</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                            {errors.phone && <div className="error-message">{errors.phone}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="assessmentType">Assessment Type:</label>
                            <select id="assessmentType" name="assessmentType" value={formData.assessmentType} onChange={handleChange} required>
                                <option value="">Select an option</option>
                                <option value="plumbing">Plumbing</option>
                                <option value="electrical">Electrical</option>
                            </select>
                            {errors.assessmentType && <div className="error-message">{errors.assessmentType}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="location">Location:</label>
                            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
                            {errors.location && <div className="error-message">{errors.location}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message:</label>
                            <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange}></textarea>
                            {errors.message && <div className="error-message">{errors.message}</div>}
                        </div>
                        <button type="submit" className='aformbutton'>Submit</button>
                    </form>
            </div>
    </div>
  )
}

export default Form
