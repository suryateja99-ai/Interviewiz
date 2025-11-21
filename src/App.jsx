import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./frontend/Header";
import Navbar from "./frontend/Navbar";
import Career from "./frontend/Career";
import Body from "./frontend/Body";
import Interview from "./frontend/Interview";
import CodeExplain from "./frontend/CodeExplain"
import Resource from "./frontend/Resource";

function App() {
  return (
    <Router>
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/career" element={<Career />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/code-explainer" element={<CodeExplain />} />
        <Route path="/resources" element={<Resource />} />
      </Routes>
    </Router>
  );
}

export default App;

