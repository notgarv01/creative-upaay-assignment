let selectedDateVal = "Fri 10";

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

// Select Date Action
function selectDate(element, dateVal) {
  if (dateVal === selectedDateVal) return;
  selectedDateVal = dateVal;

  // Remove active classes from all cards
  const cards = document.querySelectorAll('.date-card');
  cards.forEach(card => {
    // Reset label
    const dayLabel = card.querySelector('.day-text');
    dayLabel.className = "day-text text-xs font-semibold text-slate-400";
    // Reset box
    const dateBox = card.querySelector('.date-box');
    dateBox.className = "date-box w-7 h-7 flex items-center justify-center bg-white border border-slate-200 text-slate-600 rounded-md font-semibold transition-all duration-200";
  });

  // Add active classes to selected card
  const activeLabel = element.querySelector('.day-text');
  activeLabel.className = "day-text text-xs font-bold text-brand-primary";
  const activeBox = element.querySelector('.date-box');
  activeBox.className = "date-box w-7 h-7 flex items-center justify-center bg-brand-primary text-white rounded-md font-bold shadow-sm transition-all duration-200";

  showToast(`Selected date: ${dateVal}`);
}

// Select Theatre Action
function handleSelectTheatre(theatreName) {
  // Map shorthand selectedDateVal to full date format
  let fullDate = "Friday, October 10";
  if (selectedDateVal === 'Sat 11') fullDate = "Saturday, October 11";
  if (selectedDateVal === 'Sun 12') fullDate = "Sunday, October 12";
  if (selectedDateVal === 'Mon 13') fullDate = "Monday, October 13";
  if (selectedDateVal === 'Tue 13') fullDate = "Tuesday, October 13";
  if (selectedDateVal === 'Wed 13') fullDate = "Wednesday, October 13";
  if (selectedDateVal === 'Thu 13') fullDate = "Thursday, October 13";

  showToast(`Selected ${theatreName} for ${selectedDateVal}. Loading schedule...`);
  setTimeout(() => {
    window.location.href = `../schedulepage/schedule.html?theater=${encodeURIComponent(theatreName)}&date=${encodeURIComponent(fullDate)}`;
  }, 800);
}
