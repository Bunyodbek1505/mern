import { Routes, Route, Navigate } from "react-router-dom";
import Header from './components/Header'
import Login from "./pages/auth/Login";
import Register from './pages/auth/Register'

import { AuthProvider, useAuth } from "./context/authContext";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <AuthProvider>
      <Header />
      <Routes>
        <Route
          path="/"
          element={<PrivateRoute />} // Protect the Home page route
        />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
}

// Protect Home Page route
function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <HomePage /> : <Navigate to="/login" />;
}

export default App;
