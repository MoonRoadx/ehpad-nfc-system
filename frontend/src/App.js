import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Residents from './pages/Residents';
import NFCScanner from './pages/NFCScanner';
import ProtectedRoute from './components/ProtectedRoute';
import { authService } from './services/auth';

function App() {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/residents" 
          element={
            <ProtectedRoute>
              <Residents />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/scanner" 
          element={
            <ProtectedRoute>
              <NFCScanner />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
        />
        
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
