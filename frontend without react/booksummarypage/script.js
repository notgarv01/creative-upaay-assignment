let theaterVal = "The Grandview";
let dateVal = "Friday, October 10";
let formatVal = "2D";
let timeVal = "10:00 AM";
let screenVal = "Screen 1";
let seatsVal = "J9, J10";

const ticketRate = 280;
const bookingFee = 20;

// Toast Notification System
function showToast(message) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  
  msgEl.textContent = message;
  
  toast.classList.remove('-translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');
  
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('-translate-y-24', 'opacity-0');
  }, 3000);
}

// Payment Confirm Trigger
function handleProceedPayment() {
  showToast("Redirecting to checkout...");
  setTimeout(() => {
    window.location.href = `../paymentpage/payment.html?theater=${encodeURIComponent(theaterVal)}&date=${encodeURIComponent(dateVal)}&format=${encodeURIComponent(formatVal)}&time=${encodeURIComponent(timeVal)}&screen=${encodeURIComponent(screenVal)}&seats=${encodeURIComponent(seatsVal)}`;
  }, 800);
}

// Dynamic initial loading values from URL search params
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const urlTheater = params.get('theater');
  const urlDate = params.get('date');
  const urlFormat = params.get('format');
  const urlTime = params.get('time');
  const urlScreen = params.get('screen');
  const urlSeats = params.get('seats');

  if (urlTheater) theaterVal = decodeURIComponent(urlTheater);
  if (urlDate) dateVal = decodeURIComponent(urlDate);
  if (urlFormat) formatVal = decodeURIComponent(urlFormat);
  if (urlTime) timeVal = decodeURIComponent(urlTime);
  if (urlScreen) screenVal = decodeURIComponent(urlScreen);
  if (urlSeats) seatsVal = decodeURIComponent(urlSeats);

  // Render overlay labels
  document.getElementById('theater-text').textContent = theaterVal;
  document.getElementById('date-text').textContent = dateVal;
  document.getElementById('screen-text').textContent = screenVal;
  document.getElementById('time-text').textContent = timeVal;
  document.getElementById('format-text').textContent = formatVal;

  // Populate Back button link back to seats page with query params intact
  document.getElementById('back-link').href = `../selectseats/seats.html?theater=${encodeURIComponent(theaterVal)}&date=${encodeURIComponent(dateVal)}&format=${encodeURIComponent(formatVal)}&time=${encodeURIComponent(timeVal)}&screen=${encodeURIComponent(screenVal)}`;

  // Render Seats lists
  const seatsArr = seatsVal.split(', ').filter(s => s.trim() !== "");
  const seatsContainer = document.getElementById('seats-list-container');
  seatsContainer.innerHTML = '';
  
  seatsArr.forEach(seat => {
    const span = document.createElement('span');
    span.className = "bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-bold text-[9px]";
    span.textContent = seat;
    seatsContainer.appendChild(span);
  });

  // Recalculate billing
  const count = seatsArr.length;
  document.getElementById('tickets-qty-label').textContent = `${count}x Tickets`;
  
  const ticketsCost = count * ticketRate;
  document.getElementById('tickets-cost-text').textContent = `₹${ticketsCost}`;
  document.getElementById('payable-total-text').textContent = `₹${ticketsCost + bookingFee}`;
});
