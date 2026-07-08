import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav.jsx';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { booking, movie, theatre, format, screen, time, date } = location.state || {};

  if (!booking) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-brand-bg px-6 text-center">
        <span className="text-xs font-semibold text-brand-textGray mb-4">No booking transaction found.</span>
        <button 
          onClick={() => navigate('/')} 
          className="bg-brand-primary text-white text-xs px-4 py-2 rounded-xl"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const transactionTime = new Date(booking.transactionDate || booking.createdAt || Date.now()).toLocaleString();

  return (
    <div className="flex-grow flex flex-col justify-between h-full bg-brand-bg overflow-hidden relative border-x border-slate-200/20 font-sans">
      
      {/* Main Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto no-scrollbar pb-4">
        
        {/* Top Header Close Link */}
        <div className="px-6 pt-5 flex justify-end select-none shrink-0">
          <button 
            onClick={() => navigate('/')} 
            className="text-brand-textGray hover:text-brand-primary transition-colors font-bold text-sm focus:outline-none bg-transparent"
          >
            Close
          </button>
        </div>

        {/* Success Checkmark Header */}
        <div className="px-6 mt-2 flex flex-col items-center select-none shrink-0">
          {/* Emerald Checkmark circle */}
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm border border-emerald-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-sm font-bold text-slate-800 mt-3.5 tracking-wide">Payment Successful!</h1>
        </div>

        {/* Ticket Receipt Card */}
        <div className="px-6 mt-6 shrink-0">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_10px_32px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
            
            {/* Hero scene header image banner */}
            <div className="w-full h-[155px] overflow-hidden bg-slate-100 select-none">
              <img src="/images/success_hero.png" alt="Meg 2 Movie Action Banner" className="w-full h-full object-cover" />
            </div>

            {/* Ticket Card Content details */}
            <div className="p-5 flex flex-col">
              
              {/* Movie Title */}
              <h2 className="text-md font-bold text-slate-900 leading-tight">{movie?.title || 'Meg 2: The Trench'}</h2>

              {/* Detailed Columns (2-column layout) */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-4 text-[11px] select-none">
                
                {/* Col 1 top: Theater */}
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-slate-800" id="theater-text">{theatre?.name || 'The Grandview'}</span>
                  <span className="font-semibold text-brand-textGray text-[10px]" id="date-text">
                    {(date || booking.scheduleId?.date) === 'Fri 10' ? 'Friday, October 10' : (date || booking.scheduleId?.date) || 'Friday, October 10'}
                  </span>
                </div>

                {/* Col 2 top: Screen & Format */}
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-slate-800" id="screen-format-text">{screen || 'Screen 1'} - {format || '2D'}</span>
                  <span className="font-semibold text-brand-textGray text-[10px]" id="time-text">{time || '10:00 AM'}</span>
                </div>

                {/* Col 1 bottom: Seats pill list */}
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-700 text-[10px] uppercase tracking-wide">Seats:</span>
                  <div id="seats-list-container" class="flex flex-wrap gap-1.5 mt-0.5">
                    {booking.seats.map((seat) => (
                      <span 
                        key={seat}
                        className="bg-[#5C6E8D] text-white px-2 py-0.5 rounded-md font-bold text-[9px] shadow-sm shadow-[#5C6E8D]/10"
                      >
                        {seat.replace('-', '')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Col 2 bottom: Paid totals */}
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-slate-700 text-[10px] uppercase tracking-wide">Amount Paid:</span>
                  <span className="font-bold text-brand-primary text-sm mt-0.5" id="total-text">₹{booking.amount}</span>
                </div>

              </div>

              {/* Divider line */}
              <hr className="border-slate-100 my-4 select-none" />

              {/* Card Bottom footer (Transaction timestamp & QR Code) */}
              <div className="flex justify-between items-end select-none">
                
                {/* Left block: transaction details */}
                <div className="flex flex-col gap-1 pb-1">
                  <span className="text-brand-textGray text-[9px] font-semibold leading-none uppercase tracking-wide">Transaction Date:</span>
                  <span id="timestamp-text" className="text-slate-600 text-[10px] font-bold mt-0.5">{transactionTime}</span>
                </div>

                {/* Right block: working QR Code image */}
                <div className="w-16 h-16 flex items-center justify-center p-1 rounded-xl bg-slate-50 border border-slate-100/50">
                  <img id="qr-code-img" src={booking.qrCodeUrl} alt="QR Code Link" className="w-full h-full object-contain" />
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Bottom Helper text instructions */}
        <div className="px-6 mt-6 select-none shrink-0 text-center">
          <p className="text-[11px] font-semibold text-brand-textGray leading-relaxed">
            You may view all purchased tickets in the ticket page.
          </p>
        </div>

      </div>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default PaymentSuccess;
