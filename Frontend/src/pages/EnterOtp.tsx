
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


const EnterOtp: React.FC = () => {
    const OTP_DURATION = 30; 
    const [otp, setOtp] = useState('');
    const [timeLeft, setTimeLeft] = useState(0); 
    const [isResendDisabled, setIsResendDisabled] = useState(true); 
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const timerRef = React.useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        initializeTimer();
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const initializeTimer = () => {
        const currentTime = Date.now();
        const storedExpiryTime = localStorage.getItem('otpExpiryTime');
        let remainingTime = 0;

        if (storedExpiryTime) {
            const expiryTime = parseInt(storedExpiryTime);
            remainingTime = Math.max(Math.floor((expiryTime - currentTime) / 1000), 0);
        }

        if (remainingTime > 0) {
            startTimer(remainingTime);
        } else {
            startTimer(OTP_DURATION); 
        }
    };

    const startTimer = (duration: number) => {
        setTimeLeft(duration);
        setIsResendDisabled(true);

        const expiryTime = Date.now() + duration * 1000;
        localStorage.setItem('otpExpiryTime', expiryTime.toString());

        timerRef.current = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timerRef.current!);
                    setIsResendDisabled(false);
                    localStorage.removeItem('otpExpiryTime');
                    toast.info('You can now resend the OTP.');
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            toast.error('OTP is required');
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            toast.error('OTP must be a 6-digit number');
            return;
        }

        if (!email) {
            toast.error('Email is missing');
            return;
        }

        if (timeLeft === 0) {
            toast.error('OTP has expired. Please request a new OTP.');
            return;
        }

        try {
            const response = await axios.post('https://your-service.onrender.com/verify-otp', { email, otp });
            toast.success(response.data.message || 'OTP verified successfully');
            localStorage.removeItem('otpExpiryTime'); 
            navigate('/reset-password', { state: { email } });
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'OTP verification failed');
        }
    };

    const handleResendOtp = async () => {
        if (!email) {
            toast.error('Email is missing');
            return;
        }

        try {
            const response = await axios.post('https://your-service.onrender.com/resend-otp', { email });
            toast.success(response.data.message || 'OTP resent successfully');
            startTimer(OTP_DURATION); 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Error resending OTP');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative">
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: 'url(otp1.jpg',
                }}
            ></div>

            <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

            <div className="relative z-10 bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <div className="text-center mb-6">
            
            <a href="/" className="inline-block">
            <img src="/logo1.png" alt=" Logo" className="mx-auto h-16 mb-4" />
            </a>
          </div>
                <h2 className="text-3xl font-bold text-cyan-700 text-center mb-4">
                    Verify OTP
                </h2>
                <p className="text-sm text-gray-600 text-center mb-6">
                    Enter the OTP sent to <span className="font-semibold">{email}</span>.
                </p>
                <p className="text-red-500 text-center font-semibold mb-6">
                    OTP Expires in: {formatTime(timeLeft)}
                </p>
                <input
                    type="number"
                    placeholder="Enter OTP"
                    className="w-full p-3 mb-6 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-gray-800"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <div className="flex justify-between gap-4">
                <button
                    onClick={handleVerifyOtp}
                    className="w-full p-3 bg-cyan-700 text-white font-semibold rounded-lg hover:bg-cyan-600 shadow-lg transition duration-300 "
                >
                    Verify OTP
                </button>
                <button
                    onClick={handleResendOtp}
                    className={`w-full p-3 font-semibold rounded-lg shadow-lg transition duration-300 ${
                        isResendDisabled
                            ? 'bg-cyan-900 text-white cursor-not-allowed'
                            : 'bg-cyan-700 text-white hover:bg-cyan-600'
                    }`}
                    disabled={isResendDisabled}
                >
                    Resend OTP
                </button>
                </div>
            </div>
        </div>
    );
};

export default EnterOtp;
