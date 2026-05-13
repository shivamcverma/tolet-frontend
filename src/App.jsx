import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Properties from './pages/Properties';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddProperty from './pages/AddProperty';
import PropertyDetail from './pages/PropertyDetail';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-deep relative overflow-hidden">
      {/* Global Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0" 
           style={{ background: 'radial-gradient(circle at 10% 10%, rgba(139, 92, 246, 0.05) 0%, transparent 30%), radial-gradient(circle at 90% 90%, rgba(6, 182, 212, 0.05) 0%, transparent 30%)' }}>
      </div>
      
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-property" element={<AddProperty />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
