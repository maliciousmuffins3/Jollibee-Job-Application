import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import logo from "../assets/company-logo.png";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:5000/auth/login", { email, password });
            alert("Login successful!");

            // Store token in localStorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            
            // Redirect to dashboard or home page
            window.location.href = "/Jollibee-Application-Management-Portal";  
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div className="h-dvh flex items-center justify-center">
            <div className="card w-96 bg-base-100 shadow-2xl p-6 mx-2">
                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <img src={logo} alt="Company Logo" className="h-20 w-auto" />
                </div>

                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        className="input input-bordered w-full mb-3" 
                        aria-label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="input input-bordered w-full mb-3" 
                        aria-label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn bg-blood w-full hover:bg-blood/80">
                        Login
                    </button>              
                </form>

                <div className="text-center mt-3">
                    <Link to="/forgot-password" className="text-error">Forgot Password?</Link>
                </div>
                <div className="text-center mt-2">
                    Don't have an account? <Link to="/sign-up" className="text-error">Sign Up</Link>
                </div>
                <div className="text-center mt-2">
                    Want to apply? <Link to="/apply-now" className="text-error">Apply Now</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
