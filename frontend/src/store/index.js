import { configureStore, createSlice } from '@reduxjs/toolkit';

// --- Auth Slice ---
const initialAuthState = {
  token: localStorage.getItem('auth_token') || null,
  user: JSON.parse(localStorage.getItem('auth_user')) || null,
  isAuthenticated: !!localStorage.getItem('auth_token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    loginSuccess(state, action) {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  }
});

// --- Booking Slice ---
const loadBookingFromStorage = () => {
  try {
    const saved = localStorage.getItem('booking_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Map seats array back to a set if needed, but array is easier to serialize
      return {
        selectedMovie: parsed.selectedMovie || null,
        selectedTheatre: parsed.selectedTheatre || null,
        selectedDate: parsed.selectedDate || 'Fri 10',
        selectedFormat: parsed.selectedFormat || '2D',
        selectedScreen: parsed.selectedScreen || 'Screen 1',
        selectedTime: parsed.selectedTime || '10:00 AM',
        selectedSeats: parsed.selectedSeats || [],
        totalPrice: parsed.totalPrice || 0,
      };
    }
  } catch (e) {
    console.error('Failed to load booking state', e);
  }
  return {
    selectedMovie: null,
    selectedTheatre: null,
    selectedDate: 'Fri 10',
    selectedFormat: '2D',
    selectedScreen: 'Screen 1',
    selectedTime: '10:00 AM',
    selectedSeats: [],
    totalPrice: 0,
  };
};

const initialBookingState = loadBookingFromStorage();

const bookingSlice = createSlice({
  name: 'booking',
  initialState: initialBookingState,
  reducers: {
    setMovie(state, action) {
      state.selectedMovie = action.payload;
      state.selectedSeats = [];
      state.totalPrice = 0;
      saveBookingState(state);
    },
    setTheatre(state, action) {
      state.selectedTheatre = action.payload;
      state.selectedSeats = [];
      state.totalPrice = 0;
      saveBookingState(state);
    },
    setDate(state, action) {
      state.selectedDate = action.payload;
      state.selectedSeats = [];
      state.totalPrice = 0;
      saveBookingState(state);
    },
    setFormat(state, action) {
      state.selectedFormat = action.payload;
      saveBookingState(state);
    },
    setScreen(state, action) {
      state.selectedScreen = action.payload;
      state.selectedSeats = [];
      state.totalPrice = 0;
      saveBookingState(state);
    },
    setTime(state, action) {
      state.selectedTime = action.payload;
      state.selectedSeats = [];
      state.totalPrice = 0;
      saveBookingState(state);
    },
    setSelectedSeats(state, action) {
      state.selectedSeats = action.payload;
      // ticket rate is usually price from schedule. We will calculate price dynamically
      // but we will update the state with the calculated total price
      saveBookingState(state);
    },
    setTotalPrice(state, action) {
      state.totalPrice = action.payload;
      saveBookingState(state);
    },
    clearBooking(state) {
      state.selectedMovie = null;
      state.selectedTheatre = null;
      state.selectedDate = 'Fri 10';
      state.selectedFormat = '2D';
      state.selectedScreen = 'Screen 1';
      state.selectedTime = '10:00 AM';
      state.selectedSeats = [];
      state.totalPrice = 0;
      localStorage.removeItem('booking_state');
    }
  }
});

function saveBookingState(state) {
  try {
    localStorage.setItem('booking_state', JSON.stringify({
      selectedMovie: state.selectedMovie,
      selectedTheatre: state.selectedTheatre,
      selectedDate: state.selectedDate,
      selectedFormat: state.selectedFormat,
      selectedScreen: state.selectedScreen,
      selectedTime: state.selectedTime,
      selectedSeats: state.selectedSeats,
      totalPrice: state.totalPrice,
    }));
  } catch (e) {
    console.error('Failed to save booking state', e);
  }
}

// Export actions
export const { loginSuccess, logout } = authSlice.actions;
export const {
  setMovie,
  setTheatre,
  setDate,
  setFormat,
  setScreen,
  setTime,
  setSelectedSeats,
  setTotalPrice,
  clearBooking
} = bookingSlice.actions;

// Configure store
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    booking: bookingSlice.reducer
  }
});
