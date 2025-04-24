import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ React Router v6
import mainLogo from "../assets/logo.png"; // ✅ Import Main Logo
import secondaryLogo from "../assets/company-logo.png"; // ✅ Import Secondary Logo

function SplashScreen({
    duration = 3000,
    nextPage = "/"
}) {
    const [fadeOut, setFadeOut] = useState(false);
    const navigate = useNavigate(); // ✅ Works in React Router v6

    useEffect(() => {
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => navigate(nextPage), 500);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, navigate, nextPage]);

    return (
        <div
            className={`h-screen w-screen flex flex-col items-center justify-center px-6 transition-opacity duration-700 ${fadeOut ? "opacity-0" : "opacity-100"
                } bg-gradient-to-b from-red-600 to-red-900 text-white`}
            data-theme="redtheme"
        >
            {/* Logo Container - Main & Secondary Logos */}
            <div className="flex flex-row items-center space-x-6 sm:space-x-10 mb-6">
                {/* Main Logo - Standard Size */}
                <div className="w-32 sm:w-40 md:w-48 lg:w-56 h-32 sm:h-40 md:h-48 lg:h-56 flex items-center justify-center">
                    <img
                        src={mainLogo}
                        alt="Main Logo"
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Secondary Logo - 10px Smaller */}
                <div className="w-[7.375rem] sm:w-[9.375rem] md:w-[11.375rem] lg:w-[13.375rem] h-[7.375rem] sm:h-[9.375rem] md:h-[11.375rem] lg:h-[13.375rem] flex items-center justify-center">
                    <img
                        src={secondaryLogo}
                        alt="Secondary Logo"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            {/* Title - Jollibee Application System */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center tracking-wide drop-shadow-lg">
                Online Job Application Portal
            </h1>

            {/* Subtext (Optional) */}
            <p className="text-sm sm:text-lg text-gray-300 text-center mt-2">
                Bringing innovation to your fingertips.
            </p>

            {/* Loading Dots Animation */}
            <div className="mt-6 flex space-x-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse delay-150"></div>
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full animate-pulse delay-300"></div>
            </div>
        </div>
    );
}

export default SplashScreen;
