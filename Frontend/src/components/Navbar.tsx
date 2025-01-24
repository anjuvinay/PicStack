
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  
  
  const userName = localStorage.getItem('userName') || undefined;

  
  const [isOpen, setIsOpen] = useState(false);

  
  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

 
  const handleLogout = () => {
    
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
   
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-4 bg-cyan-800 text-white shadow-md z-50 h-[100px]">
      
      <div className="flex items-center">
        <Link to="/home">
          <img src="/logo1.png" alt="Logo" className="h-12 mr-2" />
        </Link>
        <h2 className="font-bold text-gray-300">PicStack</h2>
      </div>

      
      <div className="relative flex items-center gap-4">
        
        {userName ? (
          <span className="text-lg">Welcome, {userName}</span>
        ) : (
          <span className="text-lg">Welcome, Guest</span>
        )}

       
        <button onClick={handleToggleDropdown} className="focus:outline-none">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-40 bg-white text-black rounded shadow-md">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
