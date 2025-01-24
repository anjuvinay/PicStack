
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import EnterOtp from './pages/EnterOtp';
import ResetPassword from './pages/ResetPassword';



function App() {
 

  return (
    <>


      <Router>

        <Routes>

        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Login/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/forgotpassword" element={<ForgotPassword />} /> 
        <Route path="/enter-otp" element={<EnterOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} /> 


        </Routes>

      </Router>

     
    </>
  )
}

export default App
