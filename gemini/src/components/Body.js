import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import geminiBody from '../assets/img/gemini_body.jpg';  

function Body()
{
    const navigate = useNavigate(); // Initialize the navigate function

    const handleButtonClick = () => {
        navigate('/chat'); // Redirect to the /chat route
    };

    return(
    <body className="main">
        <div className="container">
            <div className="header">
                <h1 className="title" style={{ marginBottom: '3%', marginTop: '3%' }}>Introducing Gemini: our largest <br/>
                    and most capable AI model</h1>
            </div>
            <div className="image">
                <img src={geminiBody} className="img-fluid" />
            </div>
            <div className="btn">
                <button type="button" className="btn btn-primary" onClick={handleButtonClick}>Try Gemini</button>
            </div>
        </div>
    </body>
    );
}

export default Body;

