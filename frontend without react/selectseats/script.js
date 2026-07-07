// Selected seats tracking set
let selectedSeats = new Set(["J-9", "J-10"]); // Default preset matching mockup
const ticketRate = 280; // Base cost per ticket

// Values extracted from URL query parameters
let theaterParam = "The Grandview";
let dateParam = "Friday, October 10";
let formatParam = "2D";
let timeParam = "10:00 AM";
let screenParam = "Screen 1";

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

// Redirect to Booking Summary Page
function handleViewSummary() {
  if (selectedSeats.size === 0) {
    showToast("Please select at least one seat first!");
    return;
  }

  const seatListArray = Array.from(selectedSeats).map(s => s.replace('-', '')).sort();
  const seatsQuery = seatListArray.join(', ');

  showToast("Preparing summary...");
  setTimeout(() => {
    window.location.href = `../booksummarypage/summary.html?theater=${encodeURIComponent(theaterParam)}&date=${encodeURIComponent(dateParam)}&format=${encodeURIComponent(formatParam)}&time=${encodeURIComponent(timeParam)}&screen=${encodeURIComponent(screenParam)}&seats=${encodeURIComponent(seatsQuery)}`;
  }, 800);
}

// Toggle individual seat selection
function handleSeatClick(seatNode, seatId) {
  if (selectedSeats.has(seatId)) {
    // Deselect
    selectedSeats.delete(seatId);
    seatNode.className = "w-6 h-6 flex items-center justify-center bg-white border border-slate-200 text-slate-500 rounded-md text-[9px] font-semibold cursor-pointer transition-all hover:border-brand-primary hover:text-brand-primary active:scale-95";
  } else {
    // Select
    selectedSeats.add(seatId);
    seatNode.className = "w-6 h-6 flex items-center justify-center bg-brand-primary text-white rounded-md text-[9px] font-bold cursor-pointer shadow-sm transition-all duration-150 active:scale-95";
  }
  
  // Recalculate price
  const seatCount = selectedSeats.size;
  const totalAmount = seatCount * ticketRate;
  document.getElementById('price-total-tag').textContent = `₹${totalAmount}`;
}

// Construct Seats layout programmatically
function initializeSeatMap() {
  // Rows configurations
  const rowsAtoG = ["A", "B", "C", "D", "E", "F", "G"];
  const rowH = "H";
  const rowsJtoM = ["J", "K", "L", "M"];

  // Setup occupied sets
  const occupiedSeats = new Set([
    "H-7", "H-8", "H-9", "H-10", 
    "J-11", "J-12"
  ]);

  // Populating A-G (seats 1-10)
  rowsAtoG.forEach(row => {
    const rowDiv = document.getElementById(`row-${row}`);
    
    // Prepend Row Label element (sticky on horizontal scrolling)
    const label = document.createElement('div');
    label.className = "w-4 text-center text-xs font-bold text-slate-400 select-none mr-2 shrink-0 sticky left-0 bg-[#F8F9FD] pr-1 z-10";
    label.textContent = row;
    rowDiv.appendChild(label);
    
    for(let col = 1; col <= 10; col++) {
      const seatId = `${row}-${col}`;
      rowDiv.appendChild(createSeatNode(row, col, seatId, occupiedSeats));
    }
  });

  // Populating H (seats 1-10)
  const rowHDiv = document.getElementById(`row-H`);
  const labelH = document.createElement('div');
  labelH.className = "w-4 text-center text-xs font-bold text-slate-400 select-none mr-2 shrink-0 sticky left-0 bg-[#F8F9FD] pr-1 z-10";
  labelH.textContent = "H";
  rowHDiv.appendChild(labelH);
  for(let col = 1; col <= 10; col++) {
    const seatId = `H-${col}`;
    rowHDiv.appendChild(createSeatNode("H", col, seatId, occupiedSeats));
  }

  // Populating J-M (seats 1-12)
  rowsJtoM.forEach(row => {
    const rowDiv = document.getElementById(`row-${row}`);
    
    // Prepend Row Label element (sticky on horizontal scrolling)
    const label = document.createElement('div');
    label.className = "w-4 text-center text-xs font-bold text-slate-400 select-none mr-2 shrink-0 sticky left-0 bg-[#F8F9FD] pr-1 z-10";
    label.textContent = row;
    rowDiv.appendChild(label);
    
    for(let col = 1; col <= 12; col++) {
      const seatId = `${row}-${col}`;
      rowDiv.appendChild(createSeatNode(row, col, seatId, occupiedSeats));
    }
  });
}

// Helper node creator
function createSeatNode(row, col, seatId, occupiedSet) {
  const seat = document.createElement('div');
  
  if (occupiedSet.has(seatId)) {
    // Occupied state
    seat.className = "w-6 h-6 flex items-center justify-center bg-slate-400 text-white rounded-md text-[9px] font-semibold cursor-not-allowed select-none";
    seat.textContent = col;
  } else if (selectedSeats.has(seatId)) {
    // Preset selected state
    seat.className = "w-6 h-6 flex items-center justify-center bg-brand-primary text-white rounded-md text-[9px] font-bold cursor-pointer shadow-sm transition-all duration-150 active:scale-95";
    seat.textContent = col;
    seat.onclick = () => handleSeatClick(seat, seatId);
  } else {
    // Available state
    seat.className = "w-6 h-6 flex items-center justify-center bg-white border border-slate-200 text-slate-500 rounded-md text-[9px] font-semibold cursor-pointer transition-all hover:border-brand-primary hover:text-brand-primary active:scale-95";
    seat.textContent = col;
    seat.onclick = () => handleSeatClick(seat, seatId);
  }
  
  return seat;
}

// Load search query variables
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const urlTheater = params.get('theater');
  const urlDate = params.get('date');
  const urlFormat = params.get('format');
  const urlTime = params.get('time');
  const urlScreen = params.get('screen');

  if (urlTheater) theaterParam = decodeURIComponent(urlTheater);
  if (urlDate) dateParam = decodeURIComponent(urlDate);
  if (urlFormat) formatParam = decodeURIComponent(urlFormat);
  if (urlTime) timeParam = decodeURIComponent(urlTime);
  if (urlScreen) screenParam = decodeURIComponent(urlScreen);

  // Render headings
  document.getElementById('screen-badge-text').textContent = screenParam;
  document.getElementById('time-badge-text').textContent = timeParam;

  // Update back button query link so they can return to the schedule page with options preset
  document.getElementById('back-link').href = `../schedulepage/schedule.html?theater=${encodeURIComponent(theaterParam)}&date=${encodeURIComponent(dateParam)}`;

  // Setup Seat Nodes
  initializeSeatMap();
});
