import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Aqui dizemos: Quando a URL for '/' (raiz), mostre a tela de Login */}
        <Route path="/" element={<Login />} />
        
        {/* Futuramente colocaremos outras aqui, como: */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;