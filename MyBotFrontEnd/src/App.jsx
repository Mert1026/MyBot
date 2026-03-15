import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import Members from './pages/Members';
import Parents from './pages/Parents';
import Applications from './pages/Applications';
import Home from './pages/Home';
import Courses from './pages/Courses';
import ApplicationForm from './pages/ApplicationForm';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminLayout = ({ children }) => (
  <>
    <Navbar />
    <main className="main-content">
      {children}
    </main>
  </>
);

function App() {
  return (
    <div className="app-container">
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/apply" element={<ApplicationForm />} />
          <Route path="/login" element={
            <main className="main-content">
               <Login />
            </main>
          } />
          
          <Route path="/*" element={
            <PrivateRoute>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="groups" element={<Groups />} />
                  <Route path="members" element={<Members />} />
                  <Route path="parents" element={<Parents />} />
                  <Route path="applications" element={<Applications />} />
                </Routes>
              </AdminLayout>
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
