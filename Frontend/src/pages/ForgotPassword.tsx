
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleForgotPassword = async () => {
        if (!email) {
            toast.error('Email is required');
            return;
        }

        if (!isValidEmail(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        try {
            const response = await axios.post('https://your-service.onrender.com/forgot-password', { email });
            toast.success(response.data.message || 'Check your email for the OTP');
            navigate('/enter-otp', { state: { email } });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Error sending OTP');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative">
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: 'url(otp1.jpg)',
                }}
            ></div>

            <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

            <div className="relative z-10 bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <div className="text-center mb-6">
            
            <a href="/" className="inline-block">
            <img src="/logo1.png" alt=" Logo" className="mx-auto h-16 mb-4" />
            </a>
          </div>
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
                    Forgot Password
                </h2>

                <input
                    type='email'
                    placeholder="Enter your email"
                    className="w-full p-3 mb-6 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-gray-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <button
                    onClick={handleForgotPassword}
                    className="w-full p-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-800 shadow-lg transition duration-300"
                >
                    Send Reset Email
                </button>
            </div>
        </div>
    );
};

export default ForgotPassword;




