import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Login from '../pages/login';
import Home from '../pages/home'; 
import Categories from '../pages/categories';
import Tags from '../pages/tag';
import Stock from '../pages/stock';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/categorias" element={<Categories />} />
        <Route path="/tags" element={<Tags />} />
        <Route path="/estoque" element={<Stock />} />
      </Routes>
    </Router>
  );
}

export default App;
