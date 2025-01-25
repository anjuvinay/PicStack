
import React, { useState, ChangeEvent, FormEvent,  } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

type LoginForm = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     navigate('/home'); 
  //   }
  // }, [navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("https://picbackend.onrender.com/login", {
        userData: {
          email: formData.email,
          password: formData.password,
        },
      });
      
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem('userName', user.name);

      navigate("/home");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Invalid credentials or server error");
    }
  };

  const handleRegister = () => {
    console.log("Navigating to Registration...");
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-[url('/loginpic.jpg')] bg-cover bg-center flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo1.png" alt="Logo" className="h-12 w-auto mb-2" />
          <h1 className="text-xl font-bold">Welcome Back</h1>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-200 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded
                         focus:outline-none focus:ring-2 focus:ring-cyan-300 transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded
                         focus:outline-none focus:ring-2 focus:ring-cyan-300 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-3 text-white bg-cyan-500 rounded
                       hover:bg-cyan-600 focus:outline-none focus:ring-2
                       focus:ring-blue-200 transition font-semibold"
          >
            Login
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center gap-1">
          <span className="text-sm text-gray-600">
            Don&apos;t have an account?
          </span>
          <button
            onClick={handleRegister}
            className="text-sm font-semibold text-blue-500 hover:text-blue-600 focus:outline-none"
          >
            Register
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1">
              <a href='/forgotPassword' className="text-sm text-blue-600 items-center ">Forgot password??</a>
        </div>

      </div>
    </div>
  );
};

export default Login;
