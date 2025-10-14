import "./projects.css"
import transition from "../transition";
import HomeButton from '../homebutton.jsx'
import { Link } from "react-router-dom";

function Projects() {
    return (
        <div className="projects-section">
            <HomeButton />
            <h1>My Projects</h1>
            <div className="project-boxes">
                <Link to="https://github.com/ryanli0070/Shogun-Showdown" target="_blank" rel="noopener noreferrer">
                <div className="project-container1">
                    <h2><b>Shogun Showdown</b></h2>
                    <p>A local 2D multiplayer platform fighting game inspired by Super Smash Bros</p>
                    <dl>MonoGame, .NET, C#</dl>
                </div>
                </Link>
                <div className="project-container2">
                    <h2><b>MacroBud(WIP)</b></h2>
                    <p>A responsive macro-nutrient tracker which sugguests dietary improvements based off eating habits</p>
                    <dl>React, Node.js, SQL</dl>
                </div>
            </div>
        </div>
    )
}

export default transition(Projects);