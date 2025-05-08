import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import logo from "../assets/company-logo.png";

function Signup() {
    // This will show all available environment variables
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        otp: "",  // OTP field
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [otpSent, setOtpSent] = useState(false); // Track OTP state
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle OTP request
    const handleOtpRequest = async () => {
        setError(""); // Clear previous errors
        try {
            setLoading(true);
            const response = await axios.post(import.meta.env.VITE_SERVER_URL + "/auth/send-otp", {
                email: formData.email,
            });
            setSuccess(response.data.message);
            setOtpSent(true);  // OTP sent, expect OTP input from user
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission (registration + OTP verification)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (!otpSent) {
            setError("Please verify your email by entering the OTP first.");
            return;
        }

        // Step 1: Verify OTP before registering the user
        try {
            const otpResponse = await axios.post(import.meta.env.VITE_SERVER_URL + "/auth/verify-registration", {
                email: formData.email,
                otp: formData.otp
            });

            // Step 2: If OTP is verified, proceed with registration
            const response = await axios.post(import.meta.env.VITE_SERVER_URL + "/auth/signup", {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password
            });

            setSuccess(response.data.message);
            setTimeout(() => (window.location.href = "/log-in"), 1500); // Redirect after success
        } catch (err) {
            setError(err.response?.data?.error || "Signup failed");
        }
    };

    return (
        <div className="h-dvh flex items-center justify-center">
            <div className="card w-96 bg-base-100 shadow-xl p-6 mx-2">
                <div className="flex justify-center mb-4">
                    <img src={logo} alt="Company Logo" className="h-20 w-auto" />
                </div>

                <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

                {/* DaisyUI Alert for Error */}
                {error && (
                    <div className="alert alert-error mb-4">
                        <div>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {/* DaisyUI Alert for Success */}
                {success && (
                    <div className="alert alert-success mb-4">
                        <div>
                            <span>{success}</span>
                        </div>
                    </div>
                )}

                {!otpSent ? (
                    // First stage: Request OTP
                    <form onSubmit={(e) => { e.preventDefault(); handleOtpRequest(); }}>
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Email" 
                            className="input input-bordered w-full mb-3" 
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit" className="btn bg-blood hover:bg-blood/80 w-full" disabled={loading}>
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </form>
                ) : (
                    // Second stage: OTP input and registration form
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            name="fullName"
                            placeholder="Full Name" 
                            className="input input-bordered w-full mb-3" 
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Password" 
                            className="input input-bordered w-full mb-3" 
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <input 
                            type="password" 
                            name="confirmPassword"
                            placeholder="Confirm Password" 
                            className="input input-bordered w-full mb-3" 
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <input 
                            type="text" 
                            name="otp"
                            placeholder="Enter OTP" 
                            className="input input-bordered w-full mb-3" 
                            value={formData.otp}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit" className="btn bg-blood hover:bg-blood/80 w-full" disabled={loading}>
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </form>
                )}

                <div className="text-center mt-3">
                    Already have an account? <Link to="/log-in" className="text-error">Login</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
