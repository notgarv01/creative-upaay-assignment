import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BottomNav from '../components/BottomNav.jsx';

const BookingSummary = ({ showToast }) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const {
    selectedMovie,
    selectedTheatre,
    selectedDate,
    selectedFormat,
    selectedScreen,
    selectedTime,
    selectedSeats,
    totalPrice,
  } = useSelector((state) => state.booking);

  const bookingFee = 20;
  const grandTotal = totalPrice + bookingFee;

  const handleProceedPayment = () => {
    if (selectedSeats.length === 0) {
      showToast('No seats selected! Redirecting to seat selection...', 'error');
      navigate('/seats');
      return;
    }

    if (!isAuthenticated) {
      showToast('Please log in or sign up to complete your checkout.', 'info');
      navigate('/login', { state: { from: { pathname: '/payment' } } });
    } else {
      navigate('/payment');
    }
  };

  if (!selectedMovie || !selectedTheatre) {
    return (
      <div className="flex-grow flex items-center justify-center bg-brand-bg">
        <span className="text-xs font-semibold text-brand-textGray">Loading summary...</span>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col justify-between h-full bg-brand-bg overflow-hidden relative border-x border-slate-200/20 font-sans">
      
      {/* Main Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto no-scrollbar pb-4">
        
        {/* Top Header Navigation Links */}
        <div className="px-6 pt-5 select-none shrink-0">
          <div className="flex justify-between items-center text-slate-500">
            <button 
              onClick={() => navigate('/seats')} 
              className="flex items-center gap-1 hover:text-brand-primary transition-colors font-semibold text-sm focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="hover:text-brand-primary transition-colors font-semibold text-sm focus:outline-none"
            >
              Cancel
            </button>
          </div>

          {/* Progress Bar (80%) */}
          <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-brand-primary h-full w-[80%] rounded-full"></div>
          </div>
        </div>

        {/* Booking Summary Main Title */}
        <div className="px-6 mt-4 select-none shrink-0">
          <h1 className="text-lg font-bold text-slate-800 leading-none">Booking Summary</h1>
        </div>

        {/* Hero Image Banner Card */}
        <div className="px-6 mt-4 select-none shrink-0">
          <div className="w-full h-[155px] overflow-hidden rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.02)] border border-slate-100/50">
            <img src="/images/summary_hero.png" alt="Meg 2 Movie Scene" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Movie Title & Location Info */}
        <div className="px-6 mt-4 shrink-0">
          <h2 className="text-md font-bold text-slate-800 leading-tight">{selectedMovie.title}</h2>
          
          {/* Metadata Row */}
          <div className="flex flex-row items-center gap-3.5 mt-2 select-none">
            {/* Theatre details */}
            <div className="flex items-center gap-1 text-[11px] font-semibold text-brand-textGray">
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{selectedTheatre.name}</span>
            </div>
            {/* Date details */}
            <div className="flex items-center gap-1 text-[11px] font-semibold text-brand-textGray">
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{selectedDate === 'Fri 10' ? 'Friday, October 10' : selectedDate === 'Sat 11' ? 'Saturday, October 11' : selectedDate}</span>
            </div>
          </div>

          {/* Show Details (Screen, Time, Format) */}
          <div className="flex items-center gap-4 mt-3 select-none text-[11px] font-semibold text-slate-800">
            <div className="flex items-center gap-1">
              <span>{selectedScreen}</span>
            </div>
            <span className="text-brand-primary">{selectedTime}</span>
            <span className="text-brand-textGray">{selectedFormat}</span>
          </div>

          {/* Seats badges */}
          <div className="flex items-center gap-2.5 mt-3 select-none text-[11px] font-semibold text-slate-800">
            <span className="text-zinc-800">Seats</span>
            <div className="flex flex-wrap gap-1.5">
              {selectedSeats.map((seat) => (
                <span 
                  key={seat}
                  className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-bold text-[9px]"
                >
                  {seat.replace('-', '')}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Receipts & cost calculations */}
        <div className="px-6 mt-6 shrink-0 flex flex-col gap-2.5 text-[11px] text-zinc-600 font-semibold select-none">
          <div className="flex justify-between">
            <span>{selectedSeats.length}x Tickets</span>
            <span className="font-semibold text-slate-800">₹{totalPrice}</span>
          </div>
          <div className="flex justify-between text-slate-800">
            <span>Booking Fee</span>
            <span>₹{bookingFee}</span>
          </div>
          <hr className="border-slate-300/50 mt-1" />
          <div className="flex justify-between text-xs mt-1">
            <span className="font-bold text-slate-800">Total</span>
            <span className="font-bold text-slate-800">₹{grandTotal}</span>
          </div>
        </div>

      </div>

      {/* Bottom Action Block */}
      <div className="flex flex-col shrink-0">
        <div className="bg-white border-t border-slate-100 pt-2.5 pb-2.5 px-6 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] flex flex-col gap-2.5">
          <button 
            onClick={handleProceedPayment}
            className="w-full bg-brand-primary hover:bg-[#3B32C4] active:scale-[0.98] text-white py-3 rounded-2xl font-semibold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-300 text-sm tracking-wide focus:outline-none"
          >
            Proceed to Payment
          </button>
        </div>
        <BottomNav />
      </div>

    </div>
  );
};

export default BookingSummary;
