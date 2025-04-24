import { Link } from "react-router-dom";

function ForgotPassword() {
    return (
        <div className="h-dvh flex items-center justify-center" data-theme="redtheme">
            <div className="card w-96 bg-base-100 shadow-xl p-6 mx-2">
                <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
                <p className="text-center text-gray-600 mb-4">
                    Enter your email to receive password reset instructions.
                </p>
                <form>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        className="input input-bordered w-full mb-3" 
                        aria-label="Email"
                    />
                    <button 
                        type="submit" 
                        className="btn bg-blood hover:bg-blood/80 w-full">
                        Reset Password
                    </button>
                </form>
                <div className="text-center mt-3">
                    <Link to="/log-in" className="text-error">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
