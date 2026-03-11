import React, { useState } from 'react';
import './pathner.css';  // Assuming we style the components in an external CSS file
import axios from 'axios'; // Import axios for making HTTP requests
 import Navbar from '../components/Navbar';
const Pathner = () => {
    const [ServiceName, setServiceName] = useState('');
    const [ownerDetails, setOwnerDetails] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [typeOfService, setTypeOfService] = useState('');
    const [emailDetails, setEmailDetails] = useState(''); // Added state for email details

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Prepare data to send
        const pathnerData = {
            serviceName: ServiceName,
            ownerDetails,
            phoneNumber,
            address,
            typeOfService,
            emailDetails
        };


        try {
            const response = await axios.post('http://localhost:5000/api/pathners', pathnerData);
            console.log(response.data); // Log success message
        } catch (error) {
            if (error.response) {
                // The request was made, and the server responded with a status code outside the range of 2xx
                console.error('Error saving pathner details:', error.response.data);
            } else if (error.request) {
                // The request was made, but no response was received
                console.error('No response received from the server:', error.request);
            } else {
                // Something else happened while setting up the request
                console.error('Error in setting up the request:', error.message);
            }
        }
    };


    return (
       <div className="service-registration">
 
              <Navbar  />


  <div className="registration-container">
    {/* Sidebar */}
    

    {/* Main Form Section */}
    <main className="main-content">
      <h2>Service Delar Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="serviceName">Service Name</label>
          <input
            type="text"
            id="serviceName"
            placeholder="Service name*"
            value={ServiceName}
            onChange={(e) => setServiceName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ownerDetails">Owner Details</label>
          <input
            type="text"
            id="ownerDetails"
            placeholder="Owner details"
            value={ownerDetails}
            onChange={(e) => setOwnerDetails(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="emailDetails">Email</label>
          <input
            type="email"
            id="emailDetails"
            placeholder="Email"
            value={emailDetails}
            onChange={(e) => setEmailDetails(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="typeOfService">Type of Service Provided</label>
          <input
            type="text"
            id="typeOfService"
            placeholder="Type of Service"
            value={typeOfService}
            onChange={(e) => setTypeOfService(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-button">Continue</button>
      </form>
    </main>
  </div>
</div>

    );
};

export default Pathner;