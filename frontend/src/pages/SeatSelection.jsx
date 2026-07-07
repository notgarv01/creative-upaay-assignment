import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedSeats, setTotalPrice } from '../store/index.js';
import BottomNav from '../components/BottomNav.jsx';

const SeatSelection = ({ showToast }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    selectedMovie,
    selectedTheatre,
    selectedDate,
    selectedFormat,
    selectedScreen,
    selectedTime,
    selectedSeats: savedSeats,
  } = useSelector((state) => state.booking);

  const [activeSchedule, setActiveSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localSelectedSeats, setLocalSelectedSeats] = useState(savedSeats || []);

  const MAX_SEATS = 6;

  useEffect(() => {
    if (!selectedMovie || !selectedTheatre) {
      showToast('Missing booking context. Redirecting to home...', 'error');
      navigate('/');
      return;
    }

    const fetchScheduleData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/schedules?movieId=${selectedMovie._id}&theatreId=${selectedTheatre._id}&date=${encodeURIComponent(selectedDate)}`);
        if (!res.ok) {
          throw new Error('Failed to load schedule seats layout.');
        }
        const data = await res.json();
        
        const matched = data.find(
          s => s.format === selectedFormat && s.screen === selectedScreen && s.time === selectedTime
        );

        if (!matched) {
          throw new Error('Specific schedule slot not found.');
        }

        setActiveSchedule(matched);
      } catch (err) {
        showToast(err.message, 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, [selectedMovie, selectedTheatre, selectedDate, selectedFormat, selectedScreen, selectedTime, navigate, showToast]);

  const ticketRate = activeSchedule ? activeSchedule.price : 280;

  useEffect(() => {
    dispatch(setSelectedSeats(localSelectedSeats));
    dispatch(setTotalPrice(localSelectedSeats.length * ticketRate));
  }, [localSelectedSeats, ticketRate, dispatch]);

  const handleSeatClick = (seatId) => {
    if (localSelectedSeats.includes(seatId)) {
      setLocalSelectedSeats(localSelectedSeats.filter(s => s !== seatId));
    } else {
      if (localSelectedSeats.length >= MAX_SEATS) {
        showToast(`You can select a maximum of ${MAX_SEATS} seats per transaction.`, 'error');
        return;
      }
      setLocalSelectedSeats([...localSelectedSeats, seatId]);
    }
  };

  const handleViewSummary = () => {
    if (localSelectedSeats.length === 0) {
      showToast('Please select at least one seat first!', 'error');
      return;
    }
    navigate('/summary');
  };

  if (loading || !activeSchedule) {
    return (
      <div className="flex-grow flex items-center justify-center bg-brand-bg">
        <span className="text-xs font-semibold text-brand-textGray">Loading seating map...</span>
      </div>
    );
  }

  // Exact Rows configurations from script.js
  const rowsAtoG = ["A", "B", "C", "D", "E", "F", "G"];
  const rowH = "H";
  const rowsJtoM = ["J", "K", "L", "M"];

  const renderSeat = (row, col) => {
    const seatId = `${row}-${col}`;
    const isOccupied = activeSchedule.occupiedSeats.includes(seatId);
    const isSelected = localSelectedSeats.includes(seatId);

    if (isOccupied) {
      return (
        <div 
          key={seatId} 
          className="w-6 h-6 flex items-center justify-center bg-slate-400 text-white rounded-md text-[9px] font-semibold cursor-not-allowed select-none"
        >
          {col}
        </div>
      );
    }

    if (isSelected) {
      return (
        <div 
          key={seatId}
          onClick={() => handleSeatClick(seatId)}
          className="w-6 h-6 flex items-center justify-center bg-brand-primary text-white rounded-md text-[9px] font-bold cursor-pointer shadow-sm transition-all duration-150 active:scale-95"
        >
          {col}
        </div>
      );
    }

    return (
      <div 
        key={seatId}
        onClick={() => handleSeatClick(seatId)}
        className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 text-slate-500 rounded-md text-[9px] font-semibold cursor-pointer transition-all hover:border-brand-primary hover:text-brand-primary active:scale-95"
      >
        {col}
      </div>
    );
  };

  return (
    <div className="flex-grow flex flex-col justify-between h-full bg-brand-bg overflow-hidden relative border-x border-slate-200/20 font-sans">
      
      {/* Main Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto no-scrollbar pb-2">
        
        {/* Top Header Navigation */}
        <div className="px-6 pt-5 select-none shrink-0">
          <div className="flex justify-between items-center text-slate-500">
            <button 
              onClick={() => navigate(`/schedule/${selectedMovie._id}/${selectedTheatre._id}`)} 
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

          {/* Progress Bar (60%) */}
          <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-brand-primary h-full w-[60%] rounded-full"></div>
          </div>

          {/* Screen details title */}
          <div className="flex items-end justify-between mt-4">
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-none">Select Seats</h1>
              <p className="text-xs font-semibold text-brand-textGray mt-2">
                <span>{selectedScreen}</span>
                <span className="text-brand-primary ml-1">{selectedTime}</span>
              </p>
            </div>
            
            {/* Dynamic Price Tag */}
            <div className="text-right select-none">
              <span className="text-md font-bold text-slate-800">
                ₹{localSelectedSeats.length * ticketRate}
              </span>
            </div>
          </div>
        </div>

        {/* Screen representation (Arc) */}
        <div className="px-6 mt-1 flex flex-col items-center select-none shrink-0">
          <svg className="w-[90%] h-8 text-slate-300" viewBox="0 0 100 30" preserveAspectRatio="none" fill="none">
            <path d="M 2 28 Q 50 0 98 28" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
          </svg>
          <span className="text-[9px] tracking-[0.25em] font-bold text-slate-400 uppercase mt-1">Screen</span>
        </div>

        {/* Seat Selector Grid Map */}
        <div className="px-6 mt-5 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex flex-col gap-[7.5px] min-w-[360px]">
            
            {/* Populating A-G (seats 1-10) */}
            {rowsAtoG.map((row) => (
              <div key={row} className="flex items-center gap-1.5">
                <div className="w-4 text-center text-xs font-bold text-slate-400 select-none mr-2 shrink-0 sticky left-0 bg-[#F8F9FD] pr-1 z-10">
                  {row}
                </div>
                {Array.from({ length: 10 }, (_, i) => renderSeat(row, i + 1))}
              </div>
            ))}

            {/* Populating H (seats 1-10) */}
            <div className="flex items-center gap-1.5 mb-4">
              <div className="w-4 text-center text-xs font-bold text-slate-400 select-none mr-2 shrink-0 sticky left-0 bg-[#F8F9FD] pr-1 z-10">
                H
              </div>
              {Array.from({ length: 10 }, (_, i) => renderSeat("H", i + 1))}
            </div>

            {/* Populating J-M (seats 1-12) */}
            {rowsJtoM.map((row) => (
              <div key={row} className="flex items-center gap-1.5">
                <div className="w-4 text-center text-xs font-bold text-slate-400 select-none mr-2 shrink-0 sticky left-0 bg-[#F8F9FD] pr-1 z-10">
                  {row}
                </div>
                {Array.from({ length: 12 }, (_, i) => renderSeat(row, i + 1))}
              </div>
            ))}

          </div>
        </div>

        {/* Color Legend Indicators */}
        <div className="px-6 mt-5 flex justify-center gap-6 text-[11px] font-medium text-slate-500 select-none shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-white border border-slate-200 rounded-md"></div>
            Available
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-slate-400 rounded-md"></div>
            Occupied
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 bg-brand-primary rounded-md"></div>
            Selected
          </div>
        </div>

      </div>

      {/* Bottom Checkout Trigger Bar */}
      <div className="bg-white border-t border-slate-100 pt-2.5 pb-2.5 px-6 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] shrink-0 flex flex-col gap-2.5">
        <button 
          onClick={handleViewSummary}
          className="w-full bg-brand-primary hover:bg-[#3B32C4] active:scale-[0.98] text-white py-3 rounded-2xl font-semibold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-300 text-sm tracking-wide focus:outline-none"
        >
          View Booking Summary
        </button>
        <BottomNav />
      </div>

    </div>
  );
};

export default SeatSelection;
