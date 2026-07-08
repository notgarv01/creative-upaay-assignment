import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import MovieDetail from './pages/MovieDetail.jsx';
import TheatreSelection from './pages/TheatreSelection.jsx';
import ScheduleSelection from './pages/ScheduleSelection.jsx';
import SeatSelection from './pages/SeatSelection.jsx';
import BookingSummary from './pages/BookingSummary.jsx';
import PaymentCheckout from './pages/PaymentCheckout.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import MyBookings from './pages/MyBookings.jsx';
import Login from './pages/Login.jsx';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

const App = () => {
  // Toast State
  const [toast, setToast] = useState({
    message: '',
    type: 'success', // 'success' | 'error' | 'info'
    visible: false
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type, visible: true });
  };

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  return (
    <BrowserRouter>
      {/* Page Centering Wrapper */}
      <div className="min-h-screen bg-[#0F172A] flex justify-center items-center py-0 min-[391px]:py-6">
        
        {/* Mobile Viewport Container */}
        <div className="w-full min-[391px]:w-[390px] h-screen min-[391px]:h-[844px] bg-brand-bg relative overflow-hidden shadow-2xl flex flex-col border border-slate-200/10 min-[391px]:rounded-[36px]">
          
          {/* Toast Notification Banner */}
          <div 
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 transition-all duration-300 max-w-[320px] w-[85%] ${
              toast.visible ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0 pointer-events-none'
            } ${
              toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'error' ? 'bg-rose-600' : 'bg-slate-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-4.5 h-4.5 text-emerald-100 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4.5 h-4.5 text-rose-100 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4.5 h-4.5 text-blue-100 shrink-0" />}
            <p className="text-[10px] font-semibold tracking-wide leading-snug">{toast.message}</p>
          </div>

          {/* Router Endpoints */}
          <Routes>
            <Route path="/" element={<Home showToast={showToast} />} />
            <Route path="/movie/:id" element={<MovieDetail showToast={showToast} />} />
            <Route path="/theatres/:movieId" element={<TheatreSelection showToast={showToast} />} />
            <Route path="/schedule/:movieId/:theatreId" element={<ScheduleSelection showToast={showToast} />} />
            <Route path="/seats" element={<SeatSelection showToast={showToast} />} />
            <Route path="/summary" element={<BookingSummary showToast={showToast} />} />
            <Route path="/payment" element={<PaymentCheckout showToast={showToast} />} />
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/bookings" element={<MyBookings showToast={showToast} />} />
            <Route path="/login" element={<Login showToast={showToast} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
