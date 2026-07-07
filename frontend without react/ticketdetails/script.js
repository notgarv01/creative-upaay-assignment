// URL Query parameters storage variables (with default values matching mockup)
let theaterParam = "The Grandview";
let dateParam = "Friday, October 10";
let formatParam = "2D";
let timeParam = "10:00 AM";
let screenParam = "Screen 1";
let seatsParam = "H10, H10"; // Match mockup's exact visual seat display values

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

// Toggle Modal dialogs
function toggleCancelModal(show) {
  const backdrop = document.getElementById('cancel-backdrop');
  const modal = document.getElementById('cancel-modal');

  if (show) {
    backdrop.classList.remove('hidden');
    modal.classList.remove('hidden');
    setTimeout(() => {
      backdrop.classList.remove('opacity-0');
      backdrop.classList.add('opacity-100');
      modal.classList.remove('opacity-0', 'scale-95');
      modal.classList.add('opacity-100', 'scale-100');
    }, 10);
  } else {
    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0');
    modal.classList.remove('opacity-100', 'scale-100');
    modal.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
      backdrop.classList.add('hidden');
      modal.classList.add('hidden');
    }, 300);
  }
}

// Confirm Cancellation action
function confirmCancellation() {
  toggleCancelModal(false);
  
  // Hide cancel button
  document.getElementById('cancel-btn').classList.add('hidden');
  
  // Render Cancelled Overlay Stamp
  const stamp = document.getElementById('cancelled-overlay');
  stamp.classList.remove('hidden');
  setTimeout(() => {
    stamp.classList.remove('opacity-0');
    stamp.classList.add('opacity-100');
  }, 10);

  showToast("Booking successfully cancelled. Refund initiated.");
}

// Load URL variables and build dynamic ticket
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const urlTheater = params.get('theater');
  const urlDate = params.get('date');
  const urlFormat = params.get('format');
  const urlTime = params.get('time');
  const urlScreen = params.get('screen');
  const urlSeats = params.get('seats');

  if (urlTheater) theaterParam = decodeURIComponent(urlTheater);
  if (urlDate) dateParam = decodeURIComponent(urlDate);
  if (urlFormat) formatParam = decodeURIComponent(urlFormat);
  if (urlTime) timeParam = decodeURIComponent(urlTime);
  if (urlScreen) screenParam = decodeURIComponent(urlScreen);
  if (urlSeats) seatsParam = decodeURIComponent(urlSeats);

  // Render columns
  document.getElementById('theater-text').textContent = theaterParam;
  document.getElementById('date-text').textContent = dateParam;
  document.getElementById('screen-format-text').textContent = `${screenParam} - ${formatParam}`;
  document.getElementById('time-text').textContent = timeParam;

  // Populate seat badge list
  const seatsArr = seatsParam.split(', ').filter(s => s.trim() !== "");
  const seatsContainer = document.getElementById('seats-list-container');
  seatsContainer.innerHTML = '';
  
  seatsArr.forEach(seat => {
    const span = document.createElement('span');
    span.className = "bg-[#5C6E8D] text-white px-2 py-0.5 rounded-md font-bold text-[9px] shadow-sm shadow-[#5C6E8D]/10";
    span.textContent = seat;
    seatsContainer.appendChild(span);
  });

  // Calculate total paid cost
  const ticketCost = seatsArr.length * ticketRate;
  const finalPaid = ticketCost + bookingFee;
  document.getElementById('total-text').textContent = `₹${finalPaid}`;

  // Build real QR Code dynamically referencing these booking coordinates
  const qrData = `Movie: Meg 2 | Theater: ${theaterParam} | Seats: ${seatsParam} | Total: INR ${finalPaid}`;
  document.getElementById('qr-code-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;

  // Generate dynamic current timestamp matching ticket purchase date/time (or default mockup time if params are default)
  if (!urlSeats) {
    document.getElementById('timestamp-text').textContent = "10/9/2023 10:45 AM";
  } else {
    const now = new Date();
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    document.getElementById('timestamp-text').textContent = now.toLocaleDateString('en-US', options).replace(',', '');
  }
});
