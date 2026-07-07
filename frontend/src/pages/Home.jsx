import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setMovie, setTheatre } from '../store/index.js';
import BottomNav from '../components/BottomNav.jsx';

const Home = ({ showToast }) => {
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [category, setCategory] = useState('now'); // 'now' or 'soon'
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, theatresRes] = await Promise.all([
          fetch('http://localhost:5000/api/movies'),
          fetch('http://localhost:5000/api/theatres')
        ]);
        
        if (!moviesRes.ok || !theatresRes.ok) {
          throw new Error('Failed to load data from server.');
        }

        const moviesData = await moviesRes.json();
        const theatresData = await theatresRes.json();

        setMovies(moviesData);
        setTheatres(theatresData);
      } catch (err) {
        showToast(err.message || 'Error connecting to backend server.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  const handleMovieClick = (movie) => {
    dispatch(setMovie(movie));
    navigate(`/movie/${movie._id}`);
  };

  const handleTheatreClick = (theatre) => {
    const defaultMovie = movies.find(m => m.title === "Meg 2: The Trench") || movies[0];
    if (defaultMovie) {
      dispatch(setMovie(defaultMovie));
      dispatch(setTheatre(theatre));
      navigate(`/schedule/${defaultMovie._id}/${theatre._id}`);
      showToast(`Selected ${theatre.name} for ${defaultMovie.title}`);
    } else {
      showToast('Please select a movie first.');
    }
  };

  const filteredMovies = movies.filter(m => m.status === category);

  // Helper to retrieve exact theatre SVGs from home.html
  const getTheatreSvg = (name) => {
    if (name === "The Grandview") {
      return (
        <svg className="w-8 h-8 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 12H5V8h6v8zm8 0h-6v-2h6v2zm0-4h-6V8h6v4z"/>
        </svg>
      );
    }
    if (name === "Play Loft") {
      return (
        <svg className="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
        </svg>
      );
    }
    if (name === "CinemaOne") {
      return (
        <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zm-6.75 11.25L10 18l-1.25-2.75L6 14l2.75-1.25L10 10l1.25 2.75L14 14l-2.75 1.25z"/>
        </svg>
      );
    }
    // Cinemount / Default
    return (
      <svg className="w-8 h-8 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-9 12H5V8h6v8zm8 0h-6v-2h6v2zm0-4h-6V8h6v4z"/>
      </svg>
    );
  };

  return (
    <div className="flex-grow flex flex-col justify-between h-full bg-brand-bg overflow-hidden relative">
      {/* Main Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto no-scrollbar pb-2">
        
        {/* Hero Banner Section */}
        <div className="relative w-full aspect-[16/10] overflow-hidden select-none shrink-0 shadow-sm">
          <img src="/images/home_hero.png" alt="Meg 2: The Trench Banner" className="w-full h-full object-cover" />
          {/* Search Overlay Button */}
          <button 
            onClick={() => showToast('Search feature coming soon!')}
            className="absolute top-4 right-4 bg-black/25 hover:bg-black/45 backdrop-blur-md text-white p-2 rounded-full transition-all duration-200 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
            </svg>
          </button>
        </div>

        {/* Category Tabs Selector */}
        <div className="px-6 mt-6 shrink-0">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex gap-6">
              <button 
                id="btn-now"
                onClick={() => setCategory('now')}
                className={`text-sm font-bold relative pb-2 border-b-2 transition-all duration-300 ${category === 'now' ? 'text-brand-primary border-brand-primary' : 'text-brand-textGray border-transparent hover:text-slate-500'}`}
              >
                Now Showing
              </button>
              <button 
                id="btn-soon"
                onClick={() => setCategory('soon')}
                className={`text-sm font-bold relative pb-2 border-b-2 transition-all duration-300 ${category === 'soon' ? 'text-brand-primary border-brand-primary' : 'text-brand-textGray border-transparent hover:text-slate-500'}`}
              >
                Coming Soon
              </button>
            </div>
            <a href="#" onClick={(e) => { e.preventDefault(); showToast('Viewing all movies...'); }} className="text-xs font-bold text-brand-primary hover:underline transition-all">View All</a>
          </div>
        </div>

        {/* Movies List Container (Horizontal Carousel) */}
        <div id="movies-carousel" className="flex overflow-x-auto gap-4 px-6 py-4 no-scrollbar scroll-smooth snap-x snap-mandatory shrink-0">
          {loading ? (
            <div className="w-full text-center py-6 text-xs text-brand-textGray font-semibold">
              Loading movies...
            </div>
          ) : filteredMovies.length === 0 ? (
            <div className="w-full text-center py-6 text-xs text-brand-textGray font-semibold">
              No movies found in this tab.
            </div>
          ) : (
            filteredMovies.map((movie) => (
              <div 
                key={movie._id}
                onClick={() => handleMovieClick(movie)}
                className="w-[125px] shrink-0 snap-start flex flex-col group cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
              >
                <div className="w-[125px] h-[178px] rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md border border-slate-100 transition-shadow">
                  <img src={movie.posterImage} alt={movie.title} className="w-full h-full object-cover select-none" />
                </div>
                <h3 className="text-xs font-bold text-slate-800 mt-2 leading-[1.3] line-clamp-1 group-hover:text-brand-primary transition-colors">
                  {movie.title}
                </h3>
                <p className="text-[10px] text-brand-textGray mt-0.5 font-medium leading-none">
                  {movie.genres.join(', ')}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Movie Theatres Section Header */}
        <div className="px-6 mt-4 shrink-0 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800">Movie Theatres</h2>
          <a href="#" onClick={(e) => { e.preventDefault(); showToast('Viewing all theatres...'); }} className="text-xs font-bold text-brand-primary hover:underline transition-all">View All</a>
        </div>

        {/* Theatres List Container */}
        <div className="px-6 mt-4 flex flex-col gap-3 shrink-0">
          {loading ? (
            <div className="w-full text-center py-6 text-xs text-brand-textGray font-semibold">
              Loading theatres...
            </div>
          ) : (
            theatres.map((theatre) => (
              <div 
                key={theatre._id}
                onClick={() => handleTheatreClick(theatre)}
                className="flex items-center gap-4 bg-brand-cardBg p-3.5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-md border border-slate-100/50 transition-all duration-300 cursor-pointer group"
              >
                {/* Theatre Logo */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#F8F9FD] border border-slate-100 flex-shrink-0 transition-transform group-hover:scale-[1.03]">
                  {getTheatreSvg(theatre.name)}
                </div>
                {/* Theatre Info */}
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
            ))
          )}
        </div>

      </div>

      {/* Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
};

export default Home;
