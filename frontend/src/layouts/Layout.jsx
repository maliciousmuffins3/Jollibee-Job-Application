import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/company-logo.png";
import {
  Menu,
  Home,
  ChartNoAxesCombined as ApplicantStatusIcon,
  Users as ApplicantIcon,
  FileText as ApplicantDocumentIcon,
  Settings,
  LogOut,
  Bell,
  Search,
  CalendarDays as AppointmentIcon,
  KeyRound,
} from "lucide-react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setDarkTheme } from "../redux/themeSlice";
import { setUserCredentials, clearCredentials } from "../redux/userSlice"; // ✅ import user action

function Layout() {
  const [info, setInfo] = useState(localStorage.getItem("user") || "Guest");
  const [userName, setUserName] = useState(info == "Guest" ? "Guest" : JSON.parse(info).full_name);
  const toggleDarkMode = useSelector((state) => state.theme.toggleDarkMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Notification state
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // ✅ Restore dark mode preference
    const savedTheme = localStorage.getItem("toggleDarkMode");
    if (savedTheme !== null) {
      dispatch(setDarkTheme({ toggleDarkMode: savedTheme === "true" }));
    }

    // ✅ Restore user credentials (e.g., userName)
    const savedUser = localStorage.getItem("user");
    let savedUserName = localStorage.getItem("userName");
    const savedUserEmail = localStorage.getItem("userEmail");
    const savedUserPassword = localStorage.getItem("userPassword");

    if (savedUserName || savedUserEmail) {
      dispatch(
        setUserCredentials({
          userName: savedUserName || null,
          userEmail: savedUserEmail || null,
          userPassword: savedUserPassword || null,
        })
      );
    }

    // Fetch notification data
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/applicant_status/get-all-applicant-status"
        );
        const data = await response.json();
        
        // Assuming the number of unread notifications can be derived from the data
        // For example, you could check for specific conditions (e.g., "isUnread" flag)
        const unreadNotifications = data.filter(status => status.isUnread).length;
        
        setNotificationCount(unreadNotifications);  // Set the count of unread notifications
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications(); // Fetch the notifications when the component mounts
  }, [dispatch]);

  const handleDarkModeToggle = () => {
    const newDarkModeState = !toggleDarkMode;
    dispatch(setDarkTheme({ toggleDarkMode: newDarkModeState }));
    localStorage.setItem("toggleDarkMode", newDarkModeState.toString());
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPassword");
    dispatch(clearCredentials());
    navigate("/log-in");
  };

  return (
    <div
      data-theme={toggleDarkMode ? "dark" : "light"}
      className="h-screen flex"
    >
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-4 space-y-6 transform transition-transform duration-300 ease-in-out z-50 shadow-lg ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <img src={logo} alt="Company Logo" className="h-16 w-auto" />
          <button
            onClick={() => setSidebarOpen(false)}
            className="btn btn-sm btn-ghost text-xl"
          >
            x
          </button>
        </div>
        <h2
          className={`text-2xl font-bold text-center ${sidebarOpen ? "block" : "hidden"}`}
        >
          Admin Dashboard
        </h2>
        <nav className="space-y-2">
          {[{
            icon: Home, label: "Dashboard", path: "/"
          }, {
            icon: ApplicantIcon, label: "Applicant", path: "/applicants"
          }, {
            icon: AppointmentIcon, label: "Appointment", path: "/appointment"
          }, {
            icon: ApplicantDocumentIcon, label: "Applicant Documents", path: "/applicant-documents"
          }, {
            icon: ApplicantStatusIcon, label: "Applicant Status", path: "/applicant-status"
          }, {
            icon: KeyRound, label: "Available Position", path: "/available-position"
          }].map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center p-3 rounded-lg hover:bg-warning hover:text-primary-content"
            >
              <item.icon size={20} />
              <span className={`ml-3 ${sidebarOpen ? "block" : "hidden"}`}>
                {item.label}
              </span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center p-3 w-full rounded-lg bg-blood text-error-content hover:bg-blood/80"
          >
            <LogOut size={20} />
            <span className={`ml-3 ${sidebarOpen ? "block" : "hidden"}`}>
              Logout
            </span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col bg-base-100 ${sidebarOpen ? "" : "ml-0 md:ml-0"}`}
      >
        {/* Top Navbar */}
        <header className="navbar bg-base-100 shadow-md p-4 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-ghost"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-4">
            <button className="btn btn-circle btn-ghost relative">
              <Bell size={20} />
              {/* Notification Badge */}
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>
            <button
              onClick={handleDarkModeToggle}
              className="btn btn-circle btn-ghost"
            >
              {toggleDarkMode ? (
                <FaSun size={20} className="text-yellow-500" />
              ) : (
                <FaMoon size={20} />
              )}
            </button>
            <div className="w-10 h-10 rounded-full bg-error text-white flex items-center justify-center font-bold text-lg">
              {userName ? userName.charAt(0).toUpperCase() : "?"}
            </div>
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
