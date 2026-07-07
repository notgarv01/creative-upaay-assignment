import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTheatre, setDate } from '../store/index.js';
import BottomNav from '../components/BottomNav.jsx';

const TheatreSelection = ({ showToast }) => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [movie, setLocalMovie] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedDate = useSelector((state) => state.booking.selectedDate);

  const days = [
    { label: "Fri 10", day: "Fri", date: "10" },
    { label: "Sat 11", day: "Sat", date: "11" },
    { label: "Sun 12", day: "Sun", date: "12" },
    { label: "Mon 13", day: "Mon", date: "13" },
    { label: "Tue 14", day: "Tue", date: "14" },
    { label: "Wed 15", day: "Wed", date: "15" },
    { label: "Thu 16", day: "Thu", date: "16" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, theatresRes] = await Promise.all([
          fetch(`http://localhost:5000/api/movies/${movieId}`),
          fetch('http://localhost:5000/api/theatres')
        ]);
        
        if (!movieRes.ok || !theatresRes.ok) {
          throw new Error('Failed to load data.');
        }

        const movieData = await movieRes.json();
        const theatresData = await theatresRes.json();

        setLocalMovie(movieData);
        setTheatres(theatresData);
      } catch (err) {
        showToast(err.message, 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [movieId, navigate, showToast]);

  const handleDateSelect = (dayLabel) => {
    dispatch(setDate(dayLabel));
    showToast(`Date set to ${dayLabel}`);
  };

  const handleSelectTheatre = (theatre) => {
    dispatch(setTheatre(theatre));
    navigate(`/schedule/${movieId}/${theatre._id}`);
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-brand-bg">
        <span className="text-xs font-semibold text-brand-textGray">Loading theatres...</span>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="flex-grow flex flex-col justify-between h-full bg-brand-bg overflow-hidden relative border-x border-slate-200/20 font-sans">
      
      {/* Main Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto no-scrollbar pb-4">
        
        {/* Hero Image Banner Section */}
        <div className="relative w-full h-[180px] overflow-hidden select-none shrink-0 shadow-sm">
          <img src="/images/theater_hero.png" alt="Meg 2 Movie Action Scene" className="w-full h-full object-cover" />
          
          {/* Gradient overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/50"></div>
          
          {/* Header Overlays */}
          <div className="absolute top-4 inset-x-4 flex justify-between items-center text-white drop-shadow z-10 select-none">
            <button 
              onClick={() => navigate(`/movie/${movieId}`)} 
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

          {/* Movie Details Overlay */}
          <div className="absolute bottom-4 left-6 text-white drop-shadow z-10">
            <h1 className="text-lg font-bold leading-tight">{movie.title}</h1>
            <p className="text-[11px] font-semibold text-slate-200 mt-0.5">{movie.genres.join(', ')}</p>
          </div>
        </div>

        {/* Booking Progress Bar */}
        <div className="px-6 mt-4 shrink-0">
          <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
            <div className="bg-brand-primary h-full w-[22%] rounded-full"></div>
          </div>
        </div>

        {/* Main Theatre Selection Area */}
        <div className="px-6 mt-4 shrink-0">
          <h2 className="text-md font-bold text-slate-800 leading-none">Select Movie Theatre</h2>
          
          {/* Date Selector Row */}
          <div className="flex overflow-x-auto gap-4 pb-2 mt-4 ml-2 no-scrollbar scroll-smooth snap-x snap-mandatory select-none">
            {days.map((item) => {
              const isActive = selectedDate === item.label;
              return (
                <div 
                  key={item.label}
                  onClick={() => handleDateSelect(item.label)}
                  className="date-card flex flex-col items-center gap-1.5 shrink-0 snap-start cursor-pointer select-none"
                >
                  <span className={`day-text text-xs ${isActive ? 'font-bold text-brand-primary' : 'font-semibold text-slate-400'}`}>
                    {item.day}
                  </span>
                  <div className={`date-box w-7 h-7 flex items-center justify-center rounded-md transition-all duration-200 ${isActive ? 'bg-brand-primary text-white shadow-sm font-bold' : 'bg-white border border-slate-200 text-slate-600 font-semibold'}`}>
                    {item.date}
                  </div>
                </div>
              );
            })}
          </div>
          
          <hr className="border-slate-300 mt-4" />
        </div>

        {/* Theatres List Container */}
        <div className="px-6 mt-4 flex flex-col gap-3 shrink-0">
          {theatres.map((theatre) => (
            <div 
              key={theatre._id}
              onClick={() => handleSelectTheatre(theatre)}
              className="flex items-center gap-4 p-3.5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-md border border-slate-100/50 transition-all duration-300 cursor-pointer group bg-white"
            >
              {/* Logo */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#F8F9FD] border border-slate-100 flex-shrink-0 transition-transform group-hover:scale-[1.03]">
                <img src={theatre.logo} alt={theatre.name} className="w-9 h-9 object-contain select-none" />
              </div>
              {/* Info */}
              <div className="flex-grow min-w-0">
                <h3 className="text-sm font-bold text-slate-800 truncate group-hover:text-brand-primary transition-colors">
                  {theatre.name}
                </h3>
                <p className="text-[10px] text-brand-textGray truncate flex items-center gap-1 mt-0.5 font-medium">
                  <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {theatre.location}
                </p>
                <p className="text-xs font-bold text-brand-primary mt-1.5 leading-none">
                  ₹{theatre.minPrice} - ₹{theatre.maxPrice}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
};

export default TheatreSelection;
