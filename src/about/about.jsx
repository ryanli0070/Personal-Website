import transition from "../transition";
import './about.css'
import aboutpic from '../images/aboutpic.png'
import HomeButton from '../homebutton.jsx'

function about() {
  return (
    <div>
    <HomeButton />
    <div className="about-container">
      
      <h1>About Me</h1>
        <div className = "content" >
          <p>Hi! My name is Ryan, and I'm a first year student at the Univeristy of Waterloo studying Systems Design Engineering.
          I'm in my 1A term, currently seeking a winter 2026 internship, and I'm excited to learn more about fullstack development.
          In my free time, I enjoy playing basketball & volleyball, going to the gym, and cooking new recipes! Feel free to reach out, I would love to chat!</p>
          <img src={aboutpic} alt="Picture of Ryan" className="picture" />
        </div>
    </div>
    </div>
  );
}
export default transition(about);