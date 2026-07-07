let activeFormat = '2D';
let isFavorite = false;

// Toast Notification Utility
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

// Toggle Favorite Action
function toggleFavorite(btn) {
  isFavorite = !isFavorite;
  const heartIcon = document.getElementById('heart-icon');
  
  if (isFavorite) {
    heartIcon.setAttribute('fill', 'currentColor');
    heartIcon.className.baseVal = 'w-6 h-6 text-rose-500 fill-rose-500 stroke-rose-500 scale-110 transition-all duration-300';
    showToast("Added to Favorites!");
  } else {
    heartIcon.removeAttribute('fill');
    heartIcon.className.baseVal = 'w-6 h-6 text-white transition-all duration-300';
    showToast("Removed from Favorites.");
  }
}

// Select Format Action
function selectFormat(format) {
  if (format === activeFormat) return;
  activeFormat = format;

  const btn2d = document.getElementById('format-2d');
  const btn3d = document.getElementById('format-3d');

  if (format === '2D') {
    btn2d.className = "w-12 h-9 flex items-center justify-center border border-brand-primary text-brand-primary rounded-xl text-xs font-bold bg-white transition-all duration-200 focus:outline-none";
    btn3d.className = "w-12 h-9 flex items-center justify-center border border-slate-200 text-slate-400 rounded-xl text-xs font-bold bg-white transition-all duration-200 focus:outline-none";
  } else {
    btn3d.className = "w-12 h-9 flex items-center justify-center border border-brand-primary text-brand-primary rounded-xl text-xs font-bold bg-white transition-all duration-200 focus:outline-none";
    btn2d.className = "w-12 h-9 flex items-center justify-center border border-slate-200 text-slate-400 rounded-xl text-xs font-bold bg-white transition-all duration-200 focus:outline-none";
  }
  showToast(`Selected format: ${format}`);
}

// Handle Tickets booking click
function handleGetTickets() {
  showToast(`Booking initiated for ${activeFormat} format!`);
}
