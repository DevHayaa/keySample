"use client";
import { useState } from "react";
import Footer from "../../commonComponents/footer";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
      <div className="flex flex-col min-h-screen bg-both">
        <div className="login-container">
            <div className="login-box">
                {/* Login Title */}
                <h2 className="login-title">Welcome Back</h2>

                {/* Email Input */}
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <input 
                        type="email"
                        className="input-field"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* Password Input */}
                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Password</label>
                    <input 
                        type="password"
                        className="input-field"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* Login Button */}
                <button className="login-btn">Login</button>

                {/* Divider */}
                <div className="divider my-6">
                    <span className="text-gray-500 dark:text-gray-400 px-2">OR</span>
                </div>

                {/* Google Login */}
                <button className="google-btn">
                    <img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
                    Continue with Google
                </button>

                {/* Footer */}
                <p className="footer-text">
                    Don't have an account? <a href="#">Sign up</a>
                </p>
            </div>
            </div>
            <Footer />
        </div>


    );
}
