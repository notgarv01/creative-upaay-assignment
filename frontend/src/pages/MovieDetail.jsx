import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMovie, setFormat } from '../store/index.js';
import BottomNav from '../components/BottomNav.jsx';
import { API_BASE_URL } from '../config.js';

const MovieDetail = ({ showToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [movie, setLocalMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const selectedFormat = useSelector((state) => state.booking.selectedFormat);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/movies/${id}`);
        if (!res.ok) {
          throw new Error('Movie not found.');
        }
        const data = await res.json();
        setLocalMovie(data);
        dispatch(setMovie(data)); // Store movie in Redux
      } catch (err) {
        showToast(err.message, 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [id, navigate, dispatch, showToast]);

  const handleFormatSelect = (fmt) => {
    dispatch(setFormat(fmt));
    showToast(`Format set to ${fmt}`);
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    showToast(isFavorite ? 'Removed from favorites' : 'Added to favorites!', 'success');
  };

  const handleGetTickets = () => {
    navigate(`/theatres/${id}`);
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-brand-bg">
        <span className="text-xs font-semibold text-brand-textGray">Loading movie details...</span>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="flex-grow flex flex-col justify-between h-full bg-brand-bg overflow-hidden relative">
      
      {/* Main Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto no-scrollbar pb-4">
        
        {/* Hero Image Section */}
        <div className="relative w-full h-[250px] overflow-hidden select-none shrink-0 shadow-sm">
          <img src={movie.bannerImage} alt={movie.title} className="w-full h-full object-cover" />
          
          {/* Close Button overlay (top-left) */}
          <button 
            onClick={() => navigate('/')} 
            className="absolute top-3 left-4 flex items-center gap-1.5 text-white hover:text-slate-200 transition-colors drop-shadow-md z-10 select-none focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span className="text-sm font-bold tracking-wide">Close</span>
          </button>

          {/* Favorite Button overlay (top-right) */}
          <button 
            onClick={handleFavoriteToggle} 
            className="absolute top-3 right-4 text-white hover:scale-105 active:scale-95 transition-all z-10 focus:outline-none drop-shadow-md"
          >
            <svg 
              id="heart-icon" 
              xmlns="http://www.w3.org/2000/svg" 
              fill={isFavorite ? "currentColor" : "none"} 
              viewBox="0 0 24 24" 
              strokeWidth="2" 
              stroke="currentColor" 
              className={`w-6 h-6 transition-all duration-300 ${isFavorite ? 'text-rose-500' : 'text-white'}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>

        {/* Movie Information Section */}
        <div className="px-6 mt-4 shrink-0">
          
          {/* Title, PG rating, and rating score */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-bold text-brand-dark leading-tight">{movie.title}</h1>
                <span className="border border-brand-primary/40 text-brand-primary text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 select-none bg-white">
                  {movie.pgRating}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-brand-textGray mt-0.5">{movie.genres.join(', ')}</p>
            </div>
            
            {/* Score */}
            <div className="flex items-center gap-1 text-slate-800 font-bold text-xs bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] py-1 px-2 rounded-xl shrink-0 select-none">
              <svg className="w-3.5 h-3.5 text-slate-800" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span>{movie.score}</span>
            </div>
          </div>

          {/* Synopsis */}
          <p className="text-xs text-[#7E8BA0] leading-[1.5] font-medium mt-3">
            {movie.synopsis}
          </p>

          {/* Format Available Section */}
          <div className="mt-4">
            <h2 className="text-xs font-bold text-slate-800 leading-none">Format Available</h2>
            <div className="flex gap-2.5 mt-2.5 select-none">
              {movie.formats.map((fmt) => {
                const isActive = selectedFormat === fmt;
                return (
                  <button 
                    key={fmt}
                    onClick={() => handleFormatSelect(fmt)}
                    className={`w-11 h-8 flex items-center justify-center border rounded-lg text-[11px] font-bold bg-white active:scale-95 transition-all duration-200 focus:outline-none ${isActive ? 'border-brand-primary text-brand-primary' : 'border-slate-200 text-slate-400 hover:bg-slate-50/20'}`}
                  >
                    {fmt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Release Date Section */}
          <div className="mt-4">
            <h2 className="text-xs font-bold text-slate-800 leading-none">Release Date</h2>
            <p className="text-[11px] font-semibold text-[#7E8BA0] mt-2">{movie.releaseDate}</p>
          </div>

          {/* Cast Section */}
          <div className="mt-4">
            <h2 className="text-xs font-bold text-slate-800 leading-none">Cast</h2>
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-2 mt-1.5 scroll-smooth snap-x snap-mandatory">
              {movie.cast.map((c, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-2.5 bg-white p-1.5 rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.01)] border border-slate-100/50 w-[145px] shrink-0 snap-start select-none"
                >
                  <img src={c.imageUrl} alt={c.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-bold text-slate-800 truncate">{c.name}</h4>
                    <p className="text-[8px] text-brand-textGray font-semibold truncate mt-0.5">{c.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Section (Action Button & Nav Bar) */}
      <div className="flex flex-col shrink-0">
        <div className="bg-white border-t border-slate-100 pt-2.5 pb-2.5 px-6 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] flex flex-col gap-2.5">
          <button 
            onClick={handleGetTickets}
            className="w-full bg-brand-primary hover:bg-[#3B32C4] active:scale-[0.98] text-white py-3 rounded-2xl font-semibold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-300 text-sm tracking-wide focus:outline-none"
          >
            Get Tickets
          </button>
        </div>
        <BottomNav />
      </div>

    </div>
  );
};

export default MovieDetail;
