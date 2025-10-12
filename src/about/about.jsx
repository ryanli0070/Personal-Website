import transition from "../transition";
import './about.css'

function about() {
  return (
    <div className="about-container">
      <h1>About Me</h1>
      <ul>
        <li>I am male</li>
        <li>I like basketball</li>
        <li>I play many games</li>
      </ul>
    </div>
  );
}
export default transition(about);