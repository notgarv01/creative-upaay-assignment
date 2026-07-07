import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginSuccess } from '../store/index.js';
import { Eye, EyeOff } from 'lucide-react';
import { API_BASE_URL } from '../config.js';

const Login = ({ showToast }) => {
  const [tab, setTab] = useState('login'); // 'login' or 'signup'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleDemoFill = () => {
    setLoginEmail('demo@creativeupaay.com');
    setLoginPassword('password123');
    showToast('Demo credentials prefilled!', 'success');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast('Please fill in all fields.', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      dispatch(loginSuccess({ token: data.token, user: data.user }));
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword || !signupConfirm) {
      showToast('Please fill in all fields.', 'error');
      return;
    }
    if (signupPassword !== signupConfirm) {
      showToast('Passwords do not match!', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      dispatch(loginSuccess({ token: data.token, user: data.user }));
      showToast(`Account created! Welcome, ${data.user.name}!`, 'success');
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col justify-between py-8 px-8 overflow-y-auto no-scrollbar bg-brand-bg">
      {/* Top Section */}
      <div className="flex flex-col items-center">
        {/* Brand Logo */}
        <div className="h-16 flex items-center justify-center mb-2 transition-transform duration-300 hover:scale-105">
          <img src="/images/login_logo.png" alt="Creative Upaay Logo" className="h-full w-auto object-contain" />
        </div>
        
        {/* Header Title */}
        <h1 className="text-xl font-bold text-center text-brand-dark leading-[1.2] tracking-tight">
          Creative Upaay<br />Hiring Assignment
        </h1>

        {/* Demo credentials tip */}
        <div 
          onClick={handleDemoFill}
          className="mt-4 px-3 py-1.5 border border-dashed border-brand-primary/40 bg-indigo-50/50 hover:bg-indigo-50 cursor-pointer rounded-xl text-[10px] text-brand-primary font-semibold text-center select-none transition-colors"
        >
          Click to use Demo Credentials<br/>
          <span className="text-slate-500">demo@creativeupaay.com / password123</span>
        </div>

        {/* Tabs Container */}
        <div className="relative flex bg-[#EBECEF] p-1 rounded-2xl w-full mt-6 select-none">
          {/* Sliding highlight */}
          <div 
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out transform"
            style={{ transform: tab === 'login' ? 'translateX(0)' : 'translateX(calc(100% + 8px))' }}
          ></div>
          
          <button 
            onClick={() => setTab('login')} 
            className={`relative z-10 flex-1 py-2.5 text-center text-xs font-bold transition-colors duration-300 ${tab === 'login' ? 'text-brand-dark' : 'text-brand-textGray'}`}
          >
            Login
          </button>
          
          <button 
            onClick={() => setTab('signup')} 
            className={`relative z-10 flex-1 py-2.5 text-center text-xs font-bold transition-colors duration-300 ${tab === 'signup' ? 'text-brand-dark' : 'text-brand-textGray'}`}
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Middle Sliding forms Container */}
      <div className="relative overflow-hidden w-full flex-grow mt-6 mb-6 min-h-[220px] flex items-center">
        <div 
          className="flex w-[200%] shrink-0 transition-transform duration-500 ease-out"
          style={{ transform: tab === 'login' ? 'translateX(0)' : 'translateX(-50%)' }}
        >
          {/* LOGIN FORM */}
          <form id="form-login" onSubmit={handleLoginSubmit} className="w-1/2 px-0.5 shrink-0 flex flex-col gap-5">
            <div className="relative w-full">
              <input 
                type="email" 
                id="login-email" 
                required 
                placeholder=" "
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="peer w-full bg-transparent border-b border-brand-border focus:border-brand-primary py-2 text-brand-dark transition-colors duration-200 text-xs placeholder-transparent focus:outline-none"
              />
              <label 
                htmlFor="login-email" 
                className="absolute left-0 top-2 text-brand-textGray pointer-events-none transition-all duration-300 text-xs peer-placeholder-shown:text-xs peer-placeholder-shown:top-2 peer-focus:top-[-10px] peer-focus:text-[10px] peer-focus:text-brand-primary peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-[10px]"
              >
                Email ID
              </label>
            </div>
            
            <div className="relative w-full">
              <input 
                type={showLoginPassword ? "text" : "password"} 
                id="login-password" 
                required 
                placeholder=" "
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="peer w-full bg-transparent border-b border-brand-border focus:border-brand-primary py-2 pr-10 text-brand-dark transition-colors duration-200 text-xs placeholder-transparent focus:outline-none"
              />
              <label 
                htmlFor="login-password" 
                className="absolute left-0 top-2 text-brand-textGray pointer-events-none transition-all duration-300 text-xs peer-placeholder-shown:text-xs peer-placeholder-shown:top-2 peer-focus:top-[-10px] peer-focus:text-[10px] peer-focus:text-brand-primary peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-[10px]"
              >
                Password
              </label>
              <button 
                type="button" 
                onClick={() => setShowLoginPassword(!showLoginPassword)} 
                className="absolute right-0 top-2 text-[#A0ABC0] hover:text-brand-primary transition-colors p-1"
              >
                {showLoginPassword ? <EyeOff className="w-4 h-4 text-brand-primary" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </form>

          {/* SIGN UP FORM */}
          <form id="form-signup" onSubmit={handleSignupSubmit} className="w-1/2 px-0.5 shrink-0 flex flex-col gap-4">
            <div className="relative w-full">
              <input 
                type="text" 
                id="signup-name" 
                required 
                placeholder=" "
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="peer w-full bg-transparent border-b border-brand-border focus:border-brand-primary py-2 text-brand-dark transition-colors duration-200 text-xs placeholder-transparent focus:outline-none"
              />
              <label 
                htmlFor="signup-name" 
                className="absolute left-0 top-2 text-brand-textGray pointer-events-none transition-all duration-300 text-xs peer-placeholder-shown:text-xs peer-placeholder-shown:top-2 peer-focus:top-[-10px] peer-focus:text-[10px] peer-focus:text-brand-primary peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-[10px]"
              >
                Name
              </label>
            </div>

            <div className="relative w-full">
              <input 
                type="email" 
                id="signup-email" 
                required 
                placeholder=" "
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="peer w-full bg-transparent border-b border-brand-border focus:border-brand-primary py-2 text-brand-dark transition-colors duration-200 text-xs placeholder-transparent focus:outline-none"
              />
              <label 
                htmlFor="signup-email" 
                className="absolute left-0 top-2 text-brand-textGray pointer-events-none transition-all duration-300 text-xs peer-placeholder-shown:text-xs peer-placeholder-shown:top-2 peer-focus:top-[-10px] peer-focus:text-[10px] peer-focus:text-brand-primary peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-[10px]"
              >
                Email ID
              </label>
            </div>
            
            <div className="relative w-full">
              <input 
                type={showSignupPassword ? "text" : "password"} 
                id="signup-password" 
                required 
                placeholder=" "
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="peer w-full bg-transparent border-b border-brand-border focus:border-brand-primary py-2 pr-10 text-brand-dark transition-colors duration-200 text-xs placeholder-transparent focus:outline-none"
              />
              <label 
                htmlFor="signup-password" 
                className="absolute left-0 top-2 text-brand-textGray pointer-events-none transition-all duration-300 text-xs peer-placeholder-shown:text-xs peer-placeholder-shown:top-2 peer-focus:top-[-10px] peer-focus:text-[10px] peer-focus:text-brand-primary peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-[10px]"
              >
                Password
              </label>
              <button 
                type="button" 
                onClick={() => setShowSignupPassword(!showSignupPassword)} 
                className="absolute right-0 top-2 text-[#A0ABC0] hover:text-brand-primary transition-colors p-1"
              >
                {showSignupPassword ? <EyeOff className="w-4 h-4 text-brand-primary" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative w-full">
              <input 
                type={showSignupConfirm ? "text" : "password"} 
                id="signup-confirm" 
                required 
                placeholder=" "
                value={signupConfirm}
                onChange={(e) => setSignupConfirm(e.target.value)}
                className="peer w-full bg-transparent border-b border-brand-border focus:border-brand-primary py-2 pr-10 text-brand-dark transition-colors duration-200 text-xs placeholder-transparent focus:outline-none"
              />
              <label 
                htmlFor="signup-confirm" 
                className="absolute left-0 top-2 text-brand-textGray pointer-events-none transition-all duration-300 text-xs peer-placeholder-shown:text-xs peer-placeholder-shown:top-2 peer-focus:top-[-10px] peer-focus:text-[10px] peer-focus:text-brand-primary peer-[:not(:placeholder-shown)]:top-[-10px] peer-[:not(:placeholder-shown)]:text-[10px]"
              >
                Confirm Password
              </label>
              <button 
                type="button" 
                onClick={() => setShowSignupConfirm(!showSignupConfirm)} 
                className="absolute right-0 top-2 text-[#A0ABC0] hover:text-brand-primary transition-colors p-1"
              >
                {showSignupConfirm ? <EyeOff className="w-4 h-4 text-brand-primary" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Section Action Button */}
      <div className="w-full">
        <button 
          type="submit" 
          form={tab === 'login' ? 'form-login' : 'form-signup'}
          disabled={loading}
          className="w-full bg-brand-primary hover:bg-[#3B32C4] active:scale-[0.98] disabled:bg-indigo-300 text-white py-3 rounded-2xl font-semibold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-300 text-sm tracking-wide"
        >
          {loading ? 'Processing...' : tab === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </div>
    </div>
  );
};

export default Login;
