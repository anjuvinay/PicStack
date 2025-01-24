
import axios from 'axios';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const ResetPassword: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const validatePassword = (password: string) => {
        const errors: Record<string, string> = {};
        if (!password) {
            errors.password = 'Password is required';
        } else if (password.trim().length < 5) {
            errors.password = 'Password must be at least 5 characters long';
        } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
            errors.password = 'Password must include both letters and numbers';
        } else if (password.startsWith(' ')) {
            errors.password = 'Password must not start with whitespace';
        }
        return errors;
    };

    const handleResetPassword = async () => {
        const errors = validatePassword(password);

        if (Object.keys(errors).length > 0) {
            Object.values(errors).forEach((error) => toast.error(error));
            return;
        }

        if (!confirmPassword) {
            toast.error('Confirm password is required');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (!email) {
            toast.error('Email is missing');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/reset-password', {
                email,
                password,
            });
            toast.success(response.data.message || 'Password reset successful');
            navigate('/');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.log(err)
            toast.error(err.response?.data?.message || 'Password reset failed');
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
            <img src="/logo1.png" alt="Logo" className="mx-auto h-16 mb-4" />
            </a>
          </div>
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
                    Reset Password
                </h2>
                <p className="text-sm text-gray-600 text-center mb-6">
                    Enter your new password below to reset your password.
                </p>

                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full p-3 mb-4 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-gray-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full p-3 mb-6 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-gray-800"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                    onClick={handleResetPassword}
                    className="w-full p-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 shadow-lg transition duration-300"
                >
                    Reset Password
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;
