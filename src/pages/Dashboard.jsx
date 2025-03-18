import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Home, Users, FileText, Settings, LogOut, Bell, Search } from "lucide-react";
import { FaSun, FaMoon } from "react-icons/fa";
import axios from "axios";
import logo from "../assets/company-logo.png";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/log-in");
    } else {
      // Fetch user info from localStorage or API
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
      } else {
        fetchUser(token);
      }
    }
  }, [navigate]);

  // ✅ Fetch user details from backend
  const fetchUser = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  };

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/log-in");
  };

  return (
    <div data-theme={darkMode ? "dark" : "light"} className="h-screen flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 space-y-6 transform transition-transform duration-300 ease-in-out z-50 shadow-lg ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } md:translate-x-0 md:relative md:w-64 lg:w-72`}
      >
        <div className="flex justify-between items-center mb-4 md:justify-center">
          <img src={logo} alt="Company Logo" className="h-16 w-auto" />
          <button onClick={() => setSidebarOpen(false)} className="md:hidden btn btn-sm btn-ghost">
            ✕
          </button>
        </div>
        <h2 className="text-2xl font-bold text-center">Admin Dashboard</h2>
        <nav className="space-y-2">
          <a href="#" className="flex items-center p-3 rounded-lg hover:bg-primary hover:text-primary-content">
            <Home size={20} /> <span className="ml-3">Dashboard</span>
          </a>
          <a href="#" className="flex items-center p-3 rounded-lg hover:bg-primary hover:text-primary-content">
            <Users size={20} /> <span className="ml-3">Users</span>
          </a>
          <a href="#" className="flex items-center p-3 rounded-lg hover:bg-primary hover:text-primary-content">
            <FileText size={20} /> <span className="ml-3">Reports</span>
          </a>
          <a href="#" className="flex items-center p-3 rounded-lg hover:bg-primary hover:text-primary-content">
            <Settings size={20} /> <span className="ml-3">Settings</span>
          </a>
          <button onClick={handleLogout} className="flex items-center p-3 w-full rounded-lg bg-error text-error-content hover:bg-error/80">
            <LogOut size={20} /> <span className="ml-3">Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-base-100">
        {/* Top Navbar */}
        <header className="navbar bg-base-100 shadow-md p-4 flex justify-between items-center md:justify-end">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn btn-ghost md:hidden">
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-4">
            <button className="btn btn-circle btn-ghost">
              <Search size={20} />
            </button>
            <button className="btn btn-circle btn-ghost">
              <Bell size={20} />
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className="btn btn-circle btn-ghost">
              {darkMode ? <FaSun size={20} className="text-yellow-500" /> : <FaMoon size={20} />}
            </button>
            {user ? (
              <div className="avatar online">
                <div className="w-10 rounded-full">
                  <img src={user.profilePic || "https://i.pravatar.cc/100"} alt="User" />
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 flex-1">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user?.fullName || "User"}!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card bg-primary text-primary-content p-4 shadow-md">
              <h2 className="text-lg font-bold text-center">Total Applications</h2>
              <p className="text-3xl font-semibold text-center">1,245</p>
            </div>
            <div className="card bg-secondary text-secondary-content p-4 shadow-md">
              <h2 className="text-lg font-bold text-center">Active Employees</h2>
              <p className="text-3xl font-semibold text-center">320</p>
            </div>
            <div className="card bg-accent text-accent-content p-4 shadow-md">
              <h2 className="text-lg font-bold text-center">Pending Approvals</h2>
              <p className="text-3xl font-semibold text-center">45</p>
            </div>
          </div>

          {/* Recent Activities Table */}
          <div className="mt-6 card bg-base-200 p-4 shadow-md">
            <h2 className="text-lg font-bold mb-4 text-center">Recent Activities</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Action</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td>Submitted Application</td>
                    <td>2025-03-18</td>
                  </tr>
                  <tr>
                    <td>Jane Smith</td>
                    <td>Updated Profile</td>
                    <td>2025-03-17</td>
                  </tr>
                  <tr>
                    <td>David Johnson</td>
                    <td>Approved Leave</td>
                    <td>2025-03-16</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
