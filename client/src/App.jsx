import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Focus from './pages/Focus';
import Login from './pages/Login';
import Register from './pages/Register';
import WeeklyReview from './pages/WeeklyReview';

function App() {
    return (
        <AuthProvider>
            <TaskProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/focus" element={<ProtectedRoute><Focus /></ProtectedRoute>} />
                        <Route path="/review" element={<ProtectedRoute><WeeklyReview /></ProtectedRoute>} />
                    </Routes>
                </Router>
            </TaskProvider>
        </AuthProvider>
    );
}

export default App;
