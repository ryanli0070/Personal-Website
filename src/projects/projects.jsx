import "./projects.css"
import transition from "../transition";
import HomeButton from '../homebutton.jsx'

function Projects() {
    return (
        <div className="projects-section">
            <HomeButton />
            <h1>My Projects</h1>
            <div className="project-boxes">
                <div className="project-container1">
                    <h2><b>Shogun Showdown</b></h2>
                    <p>A local 2D multiplayer platform fighting game inspired by Super Smash Bros</p>
                    <dl>MonoGame, .NET, C#</dl>
                </div>
                <div className="project-container2">
                    <h2><b>MacroBud(WIP)</b></h2>
                    <p>A local 2D multiplayer platform fighting game inspired by Super Smash Bros</p>
                    <dl>React, Node.js, SQL</dl>
                </div>
            </div>
        </div>
    )
}

export default transition(Projects);