import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <div className="navbar">
      <Link to="/">About</Link>
      <Link to="/code-explainer">Code Explainer</Link>
      <Link to="/career">Career Chat</Link>
      <Link to="/resources">Resources</Link>
    </div>
  );
}

export default Navbar;
