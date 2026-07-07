let selectedFormat = "2D";
let selectedScreen = "Screen 1";
let selectedTimeVal = "10:00 AM";
let theaterParam = "The Grandview";
let dateParam = "Friday, October 10";

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

// Toggle 2D / 3D Format
function toggleFormat(format) {
  if (format === selectedFormat) return;
  selectedFormat = format;
  
  const btn2d = document.getElementById('format-2d');
  const btn3d = document.getElementById('format-3d');
  
  if (format === '2D') {
    btn2d.className = "w-10 h-7 flex items-center justify-center border border-brand-primary bg-brand-primary text-white rounded-lg text-[10px] font-bold transition-all duration-200 focus:outline-none";
    btn3d.className = "w-10 h-7 flex items-center justify-center border border-slate-200 bg-white text-slate-400 rounded-lg text-[10px] font-bold transition-all duration-200 focus:outline-none hover:bg-slate-50/50";
  } else {
    btn3d.className = "w-10 h-7 flex items-center justify-center border border-brand-primary bg-brand-primary text-white rounded-lg text-[10px] font-bold transition-all duration-200 focus:outline-none";
    btn2d.className = "w-10 h-7 flex items-center justify-center border border-slate-200 bg-white text-slate-400 rounded-lg text-[10px] font-bold transition-all duration-200 focus:outline-none hover:bg-slate-50/50";
  }
  
  showToast(`Switched format to ${format}`);
}

// Select Showtime
function selectTime(element, screenName, timeVal) {
  if (screenName === selectedScreen && timeVal === selectedTimeVal) return;
  
  selectedScreen = screenName;
  selectedTimeVal = timeVal;
  
  // Reset all time slot active styles
  const slots = document.querySelectorAll('.time-slot');
  slots.forEach(slot => {
    slot.className = "time-slot w-full py-2.5 text-center text-xs font-bold rounded-xl cursor-pointer transition-all duration-200 bg-white border border-brand-primary/20 text-brand-primary hover:bg-indigo-50/20";
  });
  
  // Apply active style to the selected time slot
  element.className = "time-slot w-full py-2.5 text-center text-xs font-bold rounded-xl cursor-pointer transition-all duration-200 bg-brand-primary border border-transparent text-white shadow-sm";
  
  showToast(`Selected ${timeVal} on ${screenName}`);
}

// Get Tickets click
function handleGetTickets() {
  showToast(`Loading seat selection...`);
  setTimeout(() => {
    window.location.href = `../selectseats/seats.html?theater=${encodeURIComponent(theaterParam)}&date=${encodeURIComponent(dateParam)}&format=${encodeURIComponent(selectedFormat)}&time=${encodeURIComponent(selectedTimeVal)}&screen=${encodeURIComponent(selectedScreen)}`;
  }, 800);
}

// Dynamic initial loading values from URL search params if present
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const theater = params.get('theater');
  const date = params.get('date');
  
  if (theater) {
    theaterParam = decodeURIComponent(theater);
    document.getElementById('theater-badge-text').textContent = theaterParam;
  }
  if (date) {
    dateParam = decodeURIComponent(date);
    document.getElementById('date-badge-text').textContent = dateParam;
  }
});
