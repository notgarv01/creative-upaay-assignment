import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BottomNav from '../components/BottomNav.jsx';
import { API_BASE_URL } from '../config.js';

const MyBookings = ({ showToast }) => {
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Cancellation modal states
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to retrieve bookings list.');
      }
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/bookings' } } });
      return;
    }
    fetchBookings();
  }, [isAuthenticated, token, navigate]);

  const handleCancelClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowCancelModal(true);
  };

  const confirmCancellation = async () => {
    if (!selectedBookingId) return;
    setCancelling(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${selectedBookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to cancel the booking.');
      }
      showToast('Booking cancelled successfully!', 'success');
      setBookings(bookings.map(b => b._id === selectedBookingId ? { ...b, status: 'cancelled' } : b));
      setShowCancelModal(false);
      setSelectedBookingId(null);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col justify-between h-full bg-brand-bg overflow-hidden relative border-x border-slate-200/20 font-sans">
      
      {/* Cancellation Dialog Warning Modal Backdrop & Box */}
      {showCancelModal && (
        <>
          <div 
            className="absolute inset-0 bg-black/60 z-40 transition-opacity duration-300 opacity-100"
            onClick={() => !cancelling && setShowCancelModal(false)}
          ></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] bg-white rounded-3xl p-6 shadow-2xl z-50 transform scale-100 transition-all duration-300 select-none">
            <div className="flex flex-col items-center text-center gap-3">
              {/* Warning Icon */}
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-800">Cancel Ticket Booking</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to cancel this booking? A fee of ₹100 may apply, and the rest will be refunded to your source payment account.
              </p>
              
              <div className="flex flex-col gap-2 w-full mt-2">
                <button 
                  onClick={confirmCancellation}
                  disabled={cancelling}
                  className="w-full bg-rose-500 hover:bg-rose-600 active:scale-[0.98] disabled:bg-rose-300 text-white py-2.5 rounded-2xl text-xs font-bold transition-all"
                >
                  {cancelling ? 'Yes, Cancelling...' : 'Yes, Cancel Booking'}
                </button>
                <button 
                  onClick={() => setShowCancelModal(false)}
                  disabled={cancelling}
                  className="w-full border border-slate-200 hover:bg-slate-50 active:scale-[0.98] text-slate-600 py-2.5 rounded-2xl text-xs font-semibold transition-all"
                >
                  No, Keep Ticket
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto no-scrollbar pb-4">
        
        {/* Top Navigation Header */}
        <div className="px-6 pt-5 select-none shrink-0 flex flex-col gap-4">
          {/* Back Link */}
          <div>
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-1 text-slate-500 hover:text-brand-primary transition-colors font-semibold text-sm w-max focus:outline-none bg-transparent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back
            </button>
          </div>

          {/* Horizontal Tabs */}
          <div className="flex gap-6 text-xs select-none">
            <span className="border-b-2 border-brand-primary pb-1 font-bold text-slate-800 cursor-pointer">
              My Bookings
            </span>
            <span 
              onClick={() => showToast('No past bookings recorded.')}
              className="font-semibold text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
            >
              Past Bookings
            </span>
          </div>
        </div>

        {/* Tickets container */}
        <div className="px-6 mt-6 flex flex-col gap-5 shrink-0">
          {loading ? (
            <div className="text-center py-10 text-xs text-brand-textGray font-semibold">
              Retrieving booked tickets...
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-10 text-xs text-brand-textGray font-semibold bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
              No booking tickets found.<br />
              <button 
                onClick={() => navigate('/')} 
                className="mt-3 bg-brand-primary text-white text-[10px] px-3.5 py-1.5 rounded-xl font-bold focus:outline-none"
              >
                Book Tickets Now
              </button>
            </div>
          ) : (
            bookings.map((booking) => {
              const schedule = booking.scheduleId;
              const movie = schedule?.movieId;
              const theatre = schedule?.theatreId;
              const isCancelled = booking.status === 'cancelled';
              const formattedDate = new Date(booking.transactionDate || booking.createdAt || Date.now()).toLocaleString();

              return (
                <div 
                  key={booking._id} 
                  className="relative bg-white rounded-3xl border border-slate-100 shadow-[0_10px_32px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col transition-all hover:shadow-md"
                >
                  {/* Cancelled Overlay Stamp */}
                  {isCancelled && (
                    <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-300">
                      <div className="border-4 border-rose-500 text-rose-500 font-extrabold uppercase text-xl px-4 py-2 rounded-2xl transform -rotate-12 tracking-widest shadow-md">
                        Cancelled
                      </div>
                    </div>
                  )}

                  {/* Movie Header image banner */}
                  <div className="w-full h-[155px] overflow-hidden bg-slate-100 select-none">
                    <img 
                      src={movie?.bannerImage || '/images/ticket_hero.png'} 
                      alt="Meg 2 Movie Action Banner" 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  {/* Ticket Card Content details */}
                  <div className="p-5 flex flex-col">
                    
                    {/* Movie Title */}
                    <h2 className="text-md font-bold text-slate-900 leading-tight">{movie?.title || 'Meg 2: The Trench'}</h2>

                    {/* Detailed Columns (2-column layout) */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2 mt-4 text-[11px] select-none">
                      
                      {/* Col 1 top: Theater */}
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-800">{theatre?.name || 'Theatre'}</span>
                        <span className="font-semibold text-brand-textGray text-[10px]">
                          {schedule?.date === 'Fri 10' ? 'Friday, October 10' : schedule?.date || 'Friday, October 10'}
                        </span>
                      </div>

                      {/* Col 2 top: Screen & Format */}
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-800">{schedule?.screen || 'Screen 1'} - {schedule?.format || '2D'}</span>
                        <span className="font-semibold text-brand-textGray text-[10px]">{schedule?.time || '10:00 AM'}</span>
                      </div>

                      {/* Col 1 bottom: Seats pill list */}
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-700 text-[10px] uppercase tracking-wide">Seats:</span>
                        <div id="seats-list-container" className="flex flex-wrap gap-1.5 mt-0.5">
                          {booking.seats.map((seat) => (
                            <span 
                              key={seat}
                              className="bg-[#5C6E8D] text-white px-2 py-0.5 rounded-md font-bold text-[9px]"
                            >
                              {seat.replace('-', '')}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Col 2 bottom: Paid totals */}
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-700 text-[10px] uppercase tracking-wide">Amount Paid:</span>
                        <span className="font-bold text-brand-primary text-sm mt-0.5">₹{booking.amount}</span>
                      </div>

                    </div>

                    {/* Divider line */}
                    <hr className="border-slate-100 my-4 select-none" />

                    {/* Card Bottom footer (Cancel trigger, Transaction timestamp & QR Code) */}
                    <div className="flex justify-between items-end select-none">
                      
                      {/* Left block: cancel button & transaction details */}
                      <div className="flex flex-col gap-1">
                        {!isCancelled && (
                          <button 
                            onClick={() => handleCancelClick(booking._id)}
                            className="border border-slate-200 hover:border-rose-100 hover:bg-rose-50 text-rose-500 font-bold px-3.5 py-1.5 rounded-xl text-[10px] select-none transition-all active:scale-95 focus:outline-none mb-3.5 w-max"
                          >
                            Cancel Booking
                          </button>
                        )}
                        <span className="text-brand-textGray text-[9px] font-semibold leading-none uppercase tracking-wide">Transaction Date:</span>
                        <span className="text-slate-600 text-[10px] font-bold mt-0.5">{formattedDate}</span>
                      </div>

                      {/* Right block: working QR Code image */}
                      <div className="w-16 h-16 flex items-center justify-center p-1 rounded-xl bg-slate-50 border border-slate-100/50">
                        <img src={booking.qrCodeUrl} alt="QR Code Link" className="w-full h-full object-contain" />
                      </div>

                    </div>

                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default MyBookings;
