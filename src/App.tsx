import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ToolDashboard from './pages/ToolDashboard';
import Features from './ToolsPage/Features';
import Modules from './ToolsPage/Modules';
import About from "./ToolsPage/About"
import { RAGProvider } from './context/RAGContext';

function App() {
  return (
    <RAGProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tool/:toolName" element={<ToolDashboard />} />
        </Routes>
      </Router>
    </RAGProvider>
  );
}

export default App;