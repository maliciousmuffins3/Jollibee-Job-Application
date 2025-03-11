import { Link } from "react-router-dom";

function Login() {
    return (
        <div className="h-dvh flex items-center justify-center">
            <div className="card w-96 bg-base-100 shadow-xl p-6 mx-2">
                <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                <form>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        className="input input-bordered w-full mb-3" 
                        aria-label="Email"
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="input input-bordered w-full mb-3" 
                        aria-label="Password"
                    />
                    <button 
                        type="submit" 
                        className="btn btn-error w-full">
                        Login
                    </button>
                </form>
                <div className="text-center mt-3">
                    <Link to="/forgot-password" className="text-error">Forgot Password?</Link>
                </div>
                <div className="text-center mt-2">
                    Don't have an account? <Link to="/sign-up" className="text-error">Sign Up</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
