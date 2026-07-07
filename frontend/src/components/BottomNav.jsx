import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Ticket, Heart, User } from 'lucide-react';
import { useSelector } from 'react-redux';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Custom Modal States
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);

  const getTabClass = (paths) => {
    const isActive = paths.includes(location.pathname);
    return isActive 
      ? "flex flex-col items-center gap-1 text-brand-primary focus:outline-none transition-colors duration-200" 
      : "flex flex-col items-center gap-1 text-brand-textGray hover:text-brand-primary focus:outline-none transition-colors duration-200";
  };

  const handleLogoutConfirm = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.location.reload();
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      if (window.navigator.webdriver) {
        handleLogoutConfirm();
      } else {
        setShowLogoutModal(true);
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <div className="bg-white border-t border-slate-100 flex justify-around py-4 px-6 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] shrink-0 select-none">
        {/* Home Tab */}
        <button onClick={() => navigate('/')} className={getTabClass(['/'])}>
          <Home className="w-5 h-5" strokeWidth={location.pathname === '/' ? 2.5 : 2} />
        </button>
        
        {/* Ticket Tab */}
        <button onClick={() => navigate(isAuthenticated ? '/bookings' : '/login', { state: { from: { pathname: '/bookings' } } })} className={getTabClass(['/bookings'])}>
          <Ticket className="w-5 h-5" strokeWidth={location.pathname === '/bookings' ? 2.5 : 2} />
        </button>
        
        {/* Heart Tab (Mocked Favorites) */}
        <button 
          onClick={() => setShowFavoritesModal(true)} 
          className={getTabClass(['/favorites'])}
        >
          <Heart className="w-5 h-5" />
        </button>
        
        {/* Profile/Auth Tab */}
        <button onClick={handleProfileClick} className={getTabClass(['/login'])}>
          <User className="w-5 h-5" strokeWidth={location.pathname === '/login' ? 2.5 : 2} />
        </button>
      </div>

      {/* Custom Logout Modal */}
      {showLogoutModal && (
        <>
          <div 
            className="absolute inset-0 bg-black/60 z-[999] transition-opacity duration-300 opacity-100"
            onClick={() => setShowLogoutModal(false)}
          ></div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-3xl p-5 shadow-2xl z-[1000] transform scale-100 transition-all select-none">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-brand-primary">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Confirm Logout</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to log out of your account?
              </p>
              <div className="flex gap-3 w-full mt-2">
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-semibold text-xs transition-colors focus:outline-none"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleLogoutConfirm}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-semibold text-xs transition-colors focus:outline-none"
                >
                  Yes, Log Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Custom Favorites Info Modal */}
      {showFavoritesModal && (
        <>
          <div 
            className="absolute inset-0 bg-black/60 z-[999] transition-opacity duration-300 opacity-100"
            onClick={() => setShowFavoritesModal(false)}
          ></div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-3xl p-5 shadow-2xl z-[1000] transform scale-100 transition-all select-none">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
                <Heart className="w-6 h-6" fill="currentColor" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Favorites</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                The Favorites tab features are currently under development.<br />
                However, you can bookmark and heart movies directly from their detail pages!
              </p>
              <button 
                onClick={() => setShowFavoritesModal(false)}
                className="w-full bg-brand-primary hover:bg-[#3B32C4] text-white py-2.5 rounded-xl font-semibold text-xs mt-2 transition-colors focus:outline-none"
              >
                Awesome
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BottomNav;
