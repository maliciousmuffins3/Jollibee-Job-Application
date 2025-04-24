import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import logo from "../assets/company-logo.png";

function Signup() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5000/auth/signup", {
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
                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && <p className="text-green-500 text-center">{success}</p>}

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
                        type="email" 
                        name="email"
                        placeholder="Email" 
                        className="input input-bordered w-full mb-3" 
                        value={formData.email}
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
                    <button type="submit" className="btn bg-blood hover:bg-blood/80 w-full">
                        Sign Up
                    </button>
                </form>

                <div className="text-center mt-3">
                    Already have an account? <Link to="/log-in" className="text-error">Login</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
