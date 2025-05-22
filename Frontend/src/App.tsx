import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RequestAccessPage from './pages/RequestAccessPage';
import PendingRequestsPage from './pages/PendingRequestsPage';
import CreateSoftwarePage from './pages/CreateSoftwarePage';
import Header from './components/Header';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/request-access" 
                element={
                  <ProtectedRoute>
                    <RequestAccessPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/pending-requests" 
                element={
                  <ProtectedRoute roles={['Manager', 'Admin']}>
                    <PendingRequestsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/create-software" 
                element={
                  <ProtectedRoute roles={['Admin']}>
                    <CreateSoftwarePage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;