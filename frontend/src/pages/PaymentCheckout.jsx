import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearBooking } from '../store/index.js';
import BottomNav from '../components/BottomNav.jsx';

const PaymentCheckout = ({ showToast }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);

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

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'wallet'
  
  // Card states
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [saveDetails, setSaveDetails] = useState(false);

  // Wallet state
  const [selectedWallet, setSelectedWallet] = useState('GPay');

  // Simulated Failure
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [scheduleId, setScheduleId] = useState(null);

  useEffect(() => {
    if (!selectedMovie || !selectedTheatre) return;
    
    const fetchSchedule = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/schedules?movieId=${selectedMovie._id}&theatreId=${selectedTheatre._id}&date=${encodeURIComponent(selectedDate)}`);
        if (res.ok) {
          const data = await res.json();
          const matched = data.find(
            s => s.format === selectedFormat && s.screen === selectedScreen && s.time === selectedTime
          );
          if (matched) {
            setScheduleId(matched._id);
          }
        }
      } catch (err) {
        console.error('Failed to get schedule ID', err);
      }
    };
    fetchSchedule();
  }, [selectedMovie, selectedTheatre, selectedDate, selectedFormat, selectedScreen, selectedTime]);

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Digits only
    if (value.length > 16) value = value.slice(0, 16);
    const matches = value.match(/.{1,4}/g);
    setCardNumber(matches ? matches.join(' ') : value);
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Digits only
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExpiry(value);
    }
  };

  const handleCvcChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCardCvc(value);
    }
  };

  const handleCompleteCheckout = async () => {
    if (!scheduleId) {
      showToast('Schedule loading... Please wait.', 'error');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardName.trim()) {
        showToast('Please enter the name on card.', 'error');
        return;
      }
      const rawCardNo = cardNumber.replace(/\s/g, '');
      if (rawCardNo.length !== 16) {
        showToast('Card number must be exactly 16 digits.', 'error');
        return;
      }
      if (cardExpiry.length !== 5 || !cardExpiry.includes('/')) {
        showToast('Expiry date must be MM/YY format.', 'error');
        return;
      }
      if (cardCvc.length !== 3) {
        showToast('CVV must be exactly 3 digits.', 'error');
        return;
      }
    }

    setProcessing(true);
    showToast('Authorizing payment and reserving seats...', 'info');

    try {
      const paymentDetails = {
        method: paymentMethod,
        ...(paymentMethod === 'card' ? {
          name: cardName,
          cardNumber: cardNumber.replace(/\s/g, ''),
          expiry: cardExpiry,
          cvc: cardCvc
        } : {
          provider: selectedWallet
        })
      };

      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          scheduleId,
          seats: selectedSeats,
          amount: grandTotal,
          paymentDetails,
          simulateFailure
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Payment failed.');
      }

      showToast('Payment successful!', 'success');
      
      setTimeout(() => {
        dispatch(clearBooking());
        navigate('/success', { state: { booking: data.booking, movie: selectedMovie, theatre: selectedTheatre, format: selectedFormat, screen: selectedScreen, time: selectedTime } });
      }, 1000);

    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setProcessing(false);
    }
  };

  if (!selectedMovie || !selectedTheatre) return null;

  return (
    <div className="flex-grow flex flex-col justify-between h-full bg-brand-bg overflow-hidden relative border-x border-slate-200/20 font-sans">
      
      {/* Main Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto no-scrollbar pb-4">
        
        {/* Top Header Navigation Links */}
        <div className="px-6 pt-5 select-none shrink-0">
          <div className="flex justify-between items-center text-slate-500">
            <button 
              onClick={() => navigate('/summary')} 
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

          {/* Progress Bar (100%) */}
          <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-brand-primary h-full w-[100%] rounded-full"></div>
          </div>
        </div>

        {/* Title Header */}
        <div className="px-6 mt-4 select-none shrink-0">
          <h1 className="text-lg font-bold text-slate-800 leading-none">Checkout</h1>
        </div>

        {/* Summary Details Block */}
        <div className="px-6 mt-4 select-none shrink-0">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider leading-none">Summary</h2>
          
          <div className="flex flex-col gap-2 mt-3.5 text-[11px] text-slate-500 font-medium select-none">
            <div className="flex justify-between">
              <span id="summary-qty-label">{selectedSeats.length}x Tickets</span>
              <span id="summary-cost-text">₹{totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Booking Fee</span>
              <span>₹{bookingFee}</span>
            </div>
            <hr className="border-slate-300/40 mt-1.5" />
            <div className="flex justify-between text-xs mt-1.5 font-bold text-slate-800">
              <span>Total</span>
              <span id="summary-total-text">₹{grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Payment Choice Section */}
        <div className="px-6 mt-6 shrink-0">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider leading-none">Choose payment method</h2>
          
          <div className="flex items-center gap-6 mt-3.5 select-none">
            
            {/* Credit/Debit Card Selector */}
            <label 
              onClick={() => setPaymentMethod('card')} 
              className={`flex items-center gap-2 cursor-pointer text-xs font-semibold ${paymentMethod === 'card' ? 'text-slate-800' : 'text-slate-400'}`}
            >
              <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-brand-primary' : 'border-slate-300'}`}>
                {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-brand-primary"></div>}
              </div>
              Credit/Debit Card
            </label>

            {/* Mobile Wallet Selector */}
            <label 
              onClick={() => setPaymentMethod('wallet')} 
              className={`flex items-center gap-2 cursor-pointer text-xs font-semibold ${paymentMethod === 'wallet' ? 'text-slate-800' : 'text-slate-400'}`}
            >
              <div className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'wallet' ? 'border-brand-primary' : 'border-slate-300'}`}>
                {paymentMethod === 'wallet' && <div className="w-2.5 h-2.5 rounded-full bg-brand-primary"></div>}
              </div>
              Mobile Wallet
            </label>
            
          </div>
        </div>

        {/* Form Section */}
        <div className="px-6 mt-4 shrink-0">
          
          {/* Credit Card Form Box */}
          {paymentMethod === 'card' && (
            <div id="card-payment-form" className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wide">Name on card</label>
                <input 
                  type="text" 
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Name on card" 
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wide">Card number</label>
                <input 
                  type="text" 
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456" 
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wide">Expiry date</label>
                  <input 
                    type="text" 
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY" 
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wide">CVC/CVV</label>
                  <input 
                    type="password" 
                    value={cardCvc}
                    onChange={handleCvcChange}
                    placeholder="CVC" 
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-colors"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer mt-1 select-none">
                <div 
                  onClick={() => setSaveDetails(!saveDetails)}
                  className={`w-4 h-4 rounded border flex items-center justify-center bg-white transition-colors ${saveDetails ? 'border-brand-primary bg-indigo-50' : 'border-slate-300'}`}
                >
                  <svg className={`w-3 h-3 text-brand-primary ${saveDetails ? 'block' : 'hidden'}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[10px] font-semibold text-slate-700">Save payment details for the next purchase</span>
              </label>
            </div>
          )}

          {/* Mobile Wallet Box */}
          {paymentMethod === 'wallet' && (
            <div id="wallet-payment-form" className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Select Wallet Provider</span>
              
              <div className="flex flex-col gap-2.5 select-none">
                {['GPay', 'Paytm', 'PhonePe'].map((p) => {
                  const label = p === 'GPay' ? 'Google Pay' : p === 'Paytm' ? 'Paytm UPI' : 'PhonePe';
                  const isSel = selectedWallet === p;
                  return (
                    <div 
                      key={p}
                      onClick={() => setSelectedWallet(p)} 
                      className={`wallet-option flex items-center justify-between border bg-white p-3 rounded-xl cursor-pointer transition-all ${isSel ? 'border-brand-primary' : 'border-slate-200 hover:border-brand-primary'}`}
                    >
                      <span className="text-xs font-bold text-slate-700">{label}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSel ? 'border-brand-primary' : 'border-slate-300'}`}>
                        {isSel && <div className="w-2.5 h-2.5 rounded-full bg-brand-primary"></div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Simulated Failure Checkbox for ACID Test demo */}
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-2 shadow-sm">
            <input 
              type="checkbox" 
              checked={simulateFailure} 
              onChange={(e) => setSimulateFailure(e.target.checked)} 
              className="mt-0.5 rounded text-rose-500 focus:ring-rose-400 w-4 h-4 cursor-pointer"
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-rose-800">Simulate Payment Failure (ACID Rollback Demo)</span>
              <p className="text-[9px] text-rose-700/80 leading-snug">
                Check this box to force the transaction to fail. The seat locks will immediately revert to available in MongoDB.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Payment Actions */}
      <div className="bg-white border-t border-slate-100 pt-2.5 pb-2.5 px-6 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] shrink-0 flex flex-col gap-2.5">
        <button 
          onClick={handleCompleteCheckout}
          disabled={processing}
          className="w-full bg-brand-primary hover:bg-[#3B32C4] active:scale-[0.98] disabled:bg-indigo-300 text-white py-3 rounded-2xl font-semibold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-300 text-sm tracking-wide focus:outline-none"
        >
          {processing ? 'Processing...' : 'Complete Payment'}
        </button>
        <BottomNav />
      </div>

    </div>
  );
};

export default PaymentCheckout;
