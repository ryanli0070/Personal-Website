import './homebutton.css';
import { Link } from 'react-router-dom';
import home from './images/home.png';

function HomeButton() {
    return (
        <div className="home-button-container">
            <Link to="/">
                <img src={home} alt="Home" className="home-icon" />
            </Link>
        </div>
    );
}

export default HomeButton;