import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePaste from './pages/CreatePaste';
import EditPaste from './pages/EditPaste';
import ViewPaste from './pages/ViewPaste';
import PublicPastes from './pages/PublicPastes';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-center"><span className="spinner"></span></div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/public" element={<PublicPastes />} />
        <Route path="/snippet/:id" element={<ViewPaste />} />
        <Route
          path="/create"
          element={<ProtectedRoute><CreatePaste /></ProtectedRoute>}
        />
        <Route
          path="/edit/:id"
          element={<ProtectedRoute><EditPaste /></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
