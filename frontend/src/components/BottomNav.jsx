import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Ticket, Heart, User } from 'lucide-react';
import { useSelector } from 'react-redux';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const getTabClass = (paths) => {
    const isActive = paths.includes(location.pathname);
    return isActive 
      ? "flex flex-col items-center gap-1 text-brand-primary focus:outline-none transition-colors duration-200" 
      : "flex flex-col items-center gap-1 text-brand-textGray hover:text-brand-primary focus:outline-none transition-colors duration-200";
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      if (window.confirm("Do you want to log out?")) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.reload();
      }
    } else {
      navigate('/login');
    }
  };

  return (
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
        onClick={() => alert("Favorites feature is mocked. You can search or heart movies on details page!")} 
        className={getTabClass(['/favorites'])}
      >
        <Heart className="w-5 h-5" />
      </button>
      
      {/* Profile/Auth Tab */}
      <button onClick={handleProfileClick} className={getTabClass(['/login'])}>
        <User className="w-5 h-5" strokeWidth={location.pathname === '/login' ? 2.5 : 2} />
      </button>
    </div>
  );
};

export default BottomNav;
