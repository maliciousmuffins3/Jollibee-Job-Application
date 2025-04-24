import { Outlet, Navigate, Link } from "react-router-dom";
import { useState } from "react";
import logo from '../assets/company-logo.png';
import { Menu, Home, ChartNoAxesCombined as ApplicantStatusIcon, Users as ApplicantIcon, FileText as ApplicantDocumentIcon, Settings, LogOut, Bell, Search, CalendarDays as AppointmentIcon } from "lucide-react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SearchBarHeader from "../components/SearchBarHeader";

function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/log-in");
    };

    return (
        <div data-theme={darkMode ? "dark" : "light"} className="h-screen flex">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 space-y-6 transform transition-transform duration-300 ease-in-out z-50 shadow-lg ${sidebarOpen ? "translate-x-0" : "-translate-x-64"}`}>
                <div className="flex justify-between items-center mb-4">
                    <img src={logo} alt="Company Logo" className="h-16 w-auto" />
                    <button onClick={() => setSidebarOpen(false)} className="btn btn-sm btn-ghost text-xl">x</button>
                </div>
                <h2 className={`text-2xl font-bold text-center ${sidebarOpen ? "block" : "hidden"}`}>Admin Dashboard</h2>
                <nav className="space-y-2">
                    {[
                        { icon: Home, label: "Dashboard", path: "/" },
                        { icon: ApplicantIcon, label: "Applicant", path: "/applicants" },
                        { icon: AppointmentIcon, label: "Appointment", path: "/appointment" },
                        { icon: ApplicantDocumentIcon, label: "Applicant Documents", path: "/applicant-documents" },
                        { icon: ApplicantStatusIcon, label: "Applicant Status", path: "/applicant-status" }
                    ].map((item, index) => (
                        <Link key={index} to={item.path} className="flex items-center p-3 rounded-lg hover:bg-warning hover:text-primary-content">
                            <item.icon size={20} />
                            <span className={`ml-3 ${sidebarOpen ? "block" : "hidden"}`}>{item.label}</span>
                        </Link>
                    ))}
                    <button onClick={handleLogout} className="flex items-center p-3 w-full rounded-lg bg-blood text-error-content hover:bg-blood/80">
                        <LogOut size={20} />
                        <span className={`ml-3 ${sidebarOpen ? "block" : "hidden"}`}>Logout</span>
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col bg-base-100 ${sidebarOpen ? '' : 'ml-0 md:ml-0'}`}>
                {/* Top Navbar */}
                <header className="navbar bg-base-100 shadow-md p-4 flex justify-between items-center">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn btn-ghost">
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

                {/* Main content */}
                <main className="p-6 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;
