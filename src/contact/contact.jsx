import "./contact.css"
import transition from "../transition";
import HomeButton from '../homebutton.jsx'

function Contact() {
    return (
        <div>
            <HomeButton />
            <h1 className="contact-list">
                <h2> <b>Contacts:</b></h2>
                <a href="https://www.linkedin.com/in/ryan-li007/" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                </a>
                <a href="https://github.com/ryanli0070" target="_blank" rel="noopener noreferrer">
                    GitHub
                </a>
                <a href="https://www.instagram.com/ryguy_li/" target="_blank" rel="noopener noreferrer">
                    Instagram
                </a>
                <a href="mailto:r584li@uwaterloo.ca:" target="_blank" rel="noopener noreferrer">
                    Email
                </a>
            </h1>
        </div>
    )
}

export default transition(Contact);