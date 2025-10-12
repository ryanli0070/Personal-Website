import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import transition from '../transition'
import './body.css'
import email from '../images/email.png'
import about from '../images/about.png'
import projects from '../images/projects.png'

function Body() {
    const [displayText, setDisplayText] = useState('')
    const fullText = 'RYAN LI'
    
    useEffect(() => {
        let index = 0
        const timer = setInterval(() => {
            if (index < fullText.length) {
                setDisplayText(fullText.slice(0, index + 1))
                index++
            } else {
                clearInterval(timer)
            }
        }, 350) 
        
        return () => clearInterval(timer)
    }, [])
    
    return(
        <div className="body-container">
            <h5 className="typing-text">{displayText}<span className="cursor">ǀ</span></h5>
            <p>Systems Design Engineer at the University of Waterloo</p>
            <div className="icons-container">
                <Link to ="/contact">
                <img src={email} alt="Contact" className="icon" />
                </Link>
                <Link to ="/about">
                    <img src={about} alt="About" className="icon" />
                </Link>
                <img src={projects} alt="Projects" className="icon" />
            </div>
        </div>
    )   
}

export default transition(Body); 