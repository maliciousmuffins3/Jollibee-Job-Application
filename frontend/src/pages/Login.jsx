import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import logo from "../assets/company-logo.png";
import { useDispatch } from "react-redux";
import { setUserCredentials } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpPhase, setIsOtpPhase] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // For success message

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (!isOtpPhase) {
        // Step 1: Email + Password
        const response = await axios.post(import.meta.env.VITE_SERVER_URL + "/auth/login", {
          email,
          password,
        });

        setSuccess("OTP sent to your email.");
        setIsOtpPhase(true);
      } else {
        // Step 2: OTP Verification
        const response = await axios.post(import.meta.env.VITE_SERVER_URL + "/auth/verify-otp", {
          email,
          otp,
        });

        setSuccess("Login successful!");

        const user = response.data.user;

        dispatch(
          setUserCredentials({
            userEmail: email,
            userPassword: password,
            userName: email.split("@")[0],
          })
        );

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(user));

        navigate("/Jollibee-Application-Management-Portal");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="h-dvh flex items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-2xl p-6 mx-2">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Company Logo" className="h-20 w-auto" />
        </div>

        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>

        {/* Success Message */}
        {success && (
          <div className="alert alert-success mb-4">
            <div>
              <span>{success}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-error mb-4">
            <div>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isOtpPhase ? (
            <>
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
            </>
          ) : (
            <>
              <p className="text-center mb-2">Enter the 6-digit OTP sent to your email</p>
              <input
                type="text"
                placeholder="OTP"
                className="input input-bordered w-full mb-3"
                aria-label="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </>
          )}

          <button type="submit" className="btn bg-blood w-full hover:bg-blood/80">
            {isOtpPhase ? "Verify OTP" : "Login"}
          </button>
        </form>

        {!isOtpPhase && (
          <>
            <div className="text-center mt-3">
              <Link to="/forgot-password" className="text-error">
                Forgot Password?
              </Link>
            </div>
            <div className="text-center mt-2">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-error">
                Sign Up
              </Link>
            </div>
            <div className="text-center mt-2">
              Want to apply?{" "}
              <Link to="/apply-now" className="text-error">
                Apply Now
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
