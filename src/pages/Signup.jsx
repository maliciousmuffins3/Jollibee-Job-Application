import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/company-logo.png"; // Import the logo

function Signup() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log("Signup Data:", formData);
        // Here you can send the data to your backend
    };

    return (
        <div className="h-dvh flex items-center justify-center" data-theme="redtheme">
            <div className="card w-96 bg-base-100 shadow-xl p-6 mx-2">
                
                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <img src={logo} alt="Jollibee Logo" className="h-20 w-auto" />
                </div>

                <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="fullName"
                        placeholder="Full Name" 
                        className="input input-bordered w-full mb-3" 
                        aria-label="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Email" 
                        className="input input-bordered w-full mb-3" 
                        aria-label="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input 
                        type="password" 
                        name="password"
                        placeholder="Password" 
                        className="input input-bordered w-full mb-3" 
                        aria-label="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <input 
                        type="password" 
                        name="confirmPassword"
                        placeholder="Confirm Password" 
                        className="input input-bordered w-full mb-3" 
                        aria-label="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit" className="btn btn-error w-full">
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
