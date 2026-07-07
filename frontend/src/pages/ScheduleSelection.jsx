import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFormat, setScreen, setTime, setTotalPrice } from '../store/index.js';
import BottomNav from '../components/BottomNav.jsx';
import { API_BASE_URL } from '../config.js';

const ScheduleSelection = ({ showToast }) => {
  const { movieId, theatreId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [movie, setLocalMovie] = useState(null);
  const [theatre, setLocalTheatre] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedDate = useSelector((state) => state.booking.selectedDate);
  const selectedFormat = useSelector((state) => state.booking.selectedFormat);
  const selectedScreen = useSelector((state) => state.booking.selectedScreen);
  const selectedTime = useSelector((state) => state.booking.selectedTime);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, theatreRes, schedulesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/movies/${movieId}`),
          fetch(`${API_BASE_URL}/api/theatres`),
          fetch(`${API_BASE_URL}/api/schedules?movieId=${movieId}&theatreId=${theatreId}&date=${encodeURIComponent(selectedDate)}`)
        ]);

        if (!movieRes.ok || !theatreRes.ok || !schedulesRes.ok) {
          throw new Error('Failed to retrieve schedule details.');
        }

        const movieData = await movieRes.json();
        const theatresData = await theatreRes.json();
        const schedulesData = await schedulesRes.json();

        const matchedTheatre = theatresData.find(t => t._id === theatreId);

        setLocalMovie(movieData);
        setLocalTheatre(matchedTheatre);
        setSchedules(schedulesData);
      } catch (err) {
        showToast(err.message, 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [movieId, theatreId, selectedDate, navigate, showToast]);

  const handleFormatToggle = (fmt) => {
    dispatch(setFormat(fmt));
    showToast(`Format set to ${fmt}`);
  };

  const handleSlotClick = (sched) => {
    dispatch(setScreen(sched.screen));
    dispatch(setTime(sched.time));
    dispatch(setTotalPrice(0)); // Clear selected seats total
    showToast(`Selected ${sched.screen} - ${sched.time}`);
  };

  const handleGetTickets = () => {
    if (!selectedScreen || !selectedTime) {
      showToast('Please select a time slot first!', 'error');
      return;
    }
    navigate('/seats');
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-brand-bg">
        <span className="text-xs font-semibold text-brand-textGray">Loading schedules...</span>
      </div>
    );
  }

  if (!movie || !theatre) return null;

  const formatSchedules = schedules.filter(s => s.format === selectedFormat);

  // Helper lists to map standard slots from design
  const screen1Slots = [
    { time: "10:00 AM", available: true },
    { time: "12:00 PM", available: true },
    { time: "2:00 PM", available: false }, // Mocked unavailable per mockup
    { time: "4:00 PM", available: true },
    { time: "6:00 PM", available: true },
    { time: "8:00 PM", available: false }  // Mocked unavailable per mockup
  ];

  const screen2Slots = [
    { time: "10:00 AM", available: true },
    { time: "12:00 PM", available: true },
    { time: "2:00 PM", available: false },
    { time: "4:00 PM", available: true },
    { time: "6:00 PM", available: true },
    { time: "8:00 PM", available: false }
  ];

  const renderSlot = (slot, screenName) => {
    const isSelected = selectedScreen === screenName && selectedTime === slot.time;
    // Find database price/schedule for this slot if it exists
    const scheduleMatch = formatSchedules.find(s => s.screen === screenName && s.time === slot.time);

    if (!slot.available || !scheduleMatch) {
      return (
        <div 
          key={slot.time}
          className="w-full py-2.5 text-center text-xs font-semibold rounded-xl border border-slate-200/50 bg-white text-slate-300 cursor-not-allowed select-none"
        >
          {slot.time}
        </div>
      );
    }

    if (isSelected) {
      return (
        <div 
          key={slot.time}
          onClick={() => handleSlotClick(scheduleMatch)}
          className="time-slot w-full py-2.5 text-center text-xs font-bold rounded-xl cursor-pointer transition-all duration-200 bg-brand-primary border border-transparent text-white shadow-sm"
        >
          {slot.time}
        </div>
      );
    }

    return (
      <div 
        key={slot.time}
        onClick={() => handleSlotClick(scheduleMatch)}
        className="time-slot w-full py-2.5 text-center text-xs font-bold rounded-xl cursor-pointer transition-all duration-200 bg-white border border-brand-primary/20 text-brand-primary hover:bg-indigo-50/20"
      >
        {slot.time}
      </div>
    );
  };

  const activeSchedulesPrice = formatSchedules.map(s => s.price);
  const minPrice = activeSchedulesPrice.length ? Math.min(...activeSchedulesPrice) : theatre.minPrice;
  const maxPrice = activeSchedulesPrice.length ? Math.max(...activeSchedulesPrice) : theatre.maxPrice;

  return (
    <div className="flex-grow flex flex-col justify-between h-full bg-brand-bg overflow-hidden relative border-x border-slate-200/20 font-sans">
      
      {/* Main Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto no-scrollbar pb-4">
        
        {/* Hero Image Banner Section */}
        <div className="relative w-full h-[190px] overflow-hidden select-none shrink-0 shadow-sm">
          <img src="/images/schedule_hero.png" alt="Meg 2 Movie Action Scene" className="w-full h-full object-cover" />
          
          {/* Header Overlays */}
          <div className="absolute top-9 inset-x-4 flex justify-between items-center text-white drop-shadow z-10 select-none">
            <button 
              onClick={() => navigate(`/theatres/${movieId}`)} 
              className="flex items-center gap-1.5 hover:text-slate-200 transition-colors font-bold text-sm focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="hover:text-slate-200 transition-colors font-bold text-sm focus:outline-none"
            >
              Cancel
            </button>
          </div>

          {/* Movie and Schedule Details Overlay */}
          <div className="absolute bottom-8 left-6 text-white drop-shadow z-10">
            <h1 className="text-lg font-bold leading-tight">{movie.title}</h1>
            
            <div className="flex flex-row items-center gap-3.5 mt-2 select-none">
              {/* Theatre details */}
              <div className="flex items-center gap-1 text-[12px] text-slate-200">
                <svg className="w-3.5 h-3.5 text-slate-200 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>{theatre.name}</span>
              </div>
              {/* Date details */}
              <div className="flex items-center gap-1 text-[12px] text-slate-200 font-semibold">
                <svg className="w-3.5 h-3.5 text-slate-200 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{selectedDate === 'Fri 10' ? 'Friday, October 10' : selectedDate === 'Sat 11' ? 'Saturday, October 11' : selectedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Progress Bar */}
        <div className="px-6 mt-4 shrink-0">
          <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
            <div className="bg-brand-primary h-full w-[40%] rounded-full"></div>
          </div>
        </div>

        {/* Main Schedule Selection Area */}
        <div className="px-6 mt-4 shrink-0">
          <h2 className="text-md font-bold text-slate-800 leading-none">Choose Schedule</h2>
          
          {/* Format and Pricing row */}
          <div className="flex items-center justify-between mt-3.5 select-none">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-800">Format</span>
              <div className="flex gap-2">
                {movie.formats.map((fmt) => {
                  const isActive = selectedFormat === fmt;
                  return (
                    <button 
                      key={fmt}
                      onClick={() => handleFormatToggle(fmt)}
                      className={`w-10 h-7 flex items-center justify-center border rounded-lg text-[10px] font-bold transition-all duration-200 focus:outline-none ${isActive ? 'border-brand-primary bg-brand-primary text-white' : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-50/50'}`}
                    >
                      {fmt}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <span className="text-xs font-bold text-slate-500">₹{minPrice} - ₹{maxPrice}</span>
          </div>
          
          <hr className="border-slate-300/60 mt-3.5" />
        </div>

        {/* Screens and Times Grids */}
        <div className="px-6 mt-4 flex flex-col gap-4 shrink-0">
          {/* Screen 1 Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 leading-none">Screen 1</h3>
            <div className="grid grid-cols-3 gap-2.5 mt-3 select-none">
              {screen1Slots.map(slot => renderSlot(slot, 'Screen 1'))}
            </div>
          </div>

          {/* Screen 2 Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 leading-none">Screen 2</h3>
            <div className="grid grid-cols-3 gap-2.5 mt-3 select-none">
              {screen2Slots.map(slot => renderSlot(slot, 'Screen 2'))}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section (Action Button & Nav Bar) */}
      <div className="bg-white border-t border-slate-100 pt-2.5 pb-2.5 px-6 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] shrink-0 flex flex-col gap-2.5">
        <button 
          onClick={handleGetTickets}
          className="w-full bg-brand-primary hover:bg-[#3B32C4] active:scale-[0.98] text-white py-3 rounded-2xl font-semibold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-300 text-sm tracking-wide focus:outline-none"
        >
          Get Tickets
        </button>
        <BottomNav />
      </div>

    </div>
  );
};

export default ScheduleSelection;
