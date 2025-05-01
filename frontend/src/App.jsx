import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import SplashScreen from "./pages/SplashScreen";
import Dashboard from "./pages/Dashboard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "./layouts/Layout";
import ApplicantDocument from "./pages/ApplicantDocument";
import ApplicantList from "./pages/ApplicantList";
import AppointmentSchedule from './pages/AppointmentSchedule';
import ApplicantStatus from "./pages/ApplicantStatus";
import LandingPage from "./pages/LandingPage";
import AvailablePositions from "./pages/AvailablePositions";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/Jollibee-Application-Management-Portal");
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      if (
        window.location.pathname !== "/sign-up" &&
        window.location.pathname !== "/forgot-password" &&
        window.location.pathname !== "/apply-now"
      ) {
        navigate("/log-in");
      }
    } else {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
      } else {
        fetchUser(token);
      }
    }
  }, [navigate]);

  const fetchUser = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (err) {
      console.error("Failed to fetch user data", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Routes>
        <Route
          path="/Jollibee-Application-Management-Portal"
          element={<SplashScreen />}
        />
        <Route path="/log-in" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/apply-now" element={<LandingPage />} />
        <Route path="/" element={<Layout />}>
          <Route path="/applicant-documents" element={<ApplicantDocument />} />
          <Route path="/applicants" element={<ApplicantList />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/appointment" element={<AppointmentSchedule />} />
          <Route path="/applicant-status" element={<ApplicantStatus />} />
          <Route path="/available-position" element={<AvailablePositions />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
