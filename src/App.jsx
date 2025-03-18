import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import SplashScreen from "./pages/SplashScreen";
import Dashboard from './pages/Dashboard'

function App() {
  return (
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/log-in" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        
      </Routes>
  );
}

export default App;
