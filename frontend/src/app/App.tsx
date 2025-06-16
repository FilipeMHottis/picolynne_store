import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Login from '../pages/login';
import Home from '../pages/home'; 
import Categories from '../pages/categories';
import Tags from '../pages/tag';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/tags" element={<Tags />} />
      </Routes>
    </Router>
  );
}

export default App;
