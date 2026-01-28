import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Rooms from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import Dashboard from './pages/Dashboard';
import CreateRoom from './pages/CreateRoom';
import UpdateRoom from './pages/UpdateRoom';
import Contact from './pages/Contact';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/room/:id" element={<RoomDetails />} />
              <Route path="/contact" element={<Contact />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/host/create-room" element={
                <ProtectedRoute roles={['owner', 'admin']}>
                  <CreateRoom />
                </ProtectedRoute>
              } />
              <Route path="/host/update-room/:id" element={
                <ProtectedRoute roles={['owner', 'admin']}>
                  <UpdateRoom />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-center" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
