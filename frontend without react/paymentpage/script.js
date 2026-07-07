let activePaymentTab = "card";
let selectedWalletName = "";
let isCheckboxChecked = false;

// URL Query parameters storage variables
let theaterParam = "The Grandview";
let dateParam = "Friday, October 10";
let formatParam = "2D";
let timeParam = "10:00 AM";
let screenParam = "Screen 1";
let seatsParam = "J9, J10";

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

// Toggle save details checkbox
function toggleSaveDetails(box) {
  isCheckboxChecked = !isCheckboxChecked;
  const svg = box.querySelector('svg');
  
  if (isCheckboxChecked) {
    box.classList.remove('bg-white', 'border-slate-300');
    box.classList.add('bg-brand-primary', 'border-transparent');
    svg.classList.remove('hidden');
  } else {
    box.classList.remove('bg-brand-primary', 'border-transparent');
    box.classList.add('bg-white', 'border-slate-300');
    svg.classList.add('hidden');
  }
}

// Toggle Card/Wallet Tab options
function togglePaymentTab(tab) {
  if (tab === activePaymentTab) return;
  activePaymentTab = tab;

  const cardRadio = document.getElementById('radio-card');
  const walletRadio = document.getElementById('radio-wallet');
  const cardForm = document.getElementById('card-payment-form');
  const walletForm = document.getElementById('wallet-payment-form');

  if (tab === 'card') {
    // Active card selector style
    cardRadio.parentElement.className = "flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800";
    cardRadio.className = "w-4.5 h-4.5 rounded-full border-2 border-brand-primary flex items-center justify-center";
    cardRadio.querySelector('div').className = "w-2.5 h-2.5 rounded-full bg-brand-primary";

    // Inactive wallet selector style
    walletRadio.parentElement.className = "flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-400";
    walletRadio.className = "w-4.5 h-4.5 rounded-full border-2 border-slate-300 flex items-center justify-center";
    walletRadio.querySelector('div').className = "w-2.5 h-2.5 rounded-full bg-transparent";

    // Switch containers visibility
    cardForm.classList.remove('hidden');
    cardForm.classList.add('flex');
    walletForm.classList.add('hidden');
    walletForm.classList.remove('flex');
  } else {
    // Active wallet selector style
    walletRadio.parentElement.className = "flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800";
    walletRadio.className = "w-4.5 h-4.5 rounded-full border-2 border-brand-primary flex items-center justify-center";
    walletRadio.querySelector('div').className = "w-2.5 h-2.5 rounded-full bg-brand-primary";

    // Inactive card selector style
    cardRadio.parentElement.className = "flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-400";
    cardRadio.className = "w-4.5 h-4.5 rounded-full border-2 border-slate-300 flex items-center justify-center";
    cardRadio.querySelector('div').className = "w-2.5 h-2.5 rounded-full bg-transparent";

    // Switch containers visibility
    walletForm.classList.remove('hidden');
    walletForm.classList.add('flex');
    cardForm.classList.add('hidden');
    cardForm.classList.remove('flex');
  }
}

// Select wallet provider option
function selectWallet(provider) {
  selectedWalletName = provider;
  
  const options = document.querySelectorAll('.wallet-option');
  options.forEach(opt => {
    opt.className = "wallet-option flex items-center justify-between border border-slate-200 bg-white p-3 rounded-xl cursor-pointer hover:border-brand-primary transition-all";
    opt.querySelector('.select-dot').className = "w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center select-dot";
    opt.querySelector('.select-dot').innerHTML = '';
  });

  const activeOpt = event.currentTarget;
  activeOpt.className = "wallet-option flex items-center justify-between border border-brand-primary bg-indigo-50/10 p-3 rounded-xl cursor-pointer transition-all";
  const dot = activeOpt.querySelector('.select-dot');
  dot.className = "w-4 h-4 rounded-full border border-brand-primary flex items-center justify-center bg-brand-primary select-dot";
  dot.innerHTML = `<div class="w-1.5 h-1.5 rounded-full bg-white"></div>`;

  showToast(`Selected wallet: ${provider}`);
}

// Dynamic field auto format formatting inputs
// Format card input to split numbers 4x4
window.addEventListener('DOMContentLoaded', () => {
  const cardInput = document.getElementById('card-number-input');
  if (cardInput) {
    cardInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let matches = value.match(/\d{4,16}/g);
      let match = matches && matches[0] || '';
      let parts = [];

      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }

      if (parts.length > 0) {
        e.target.value = parts.join(' ');
      } else {
        e.target.value = value;
      }
    });
  }

  // Format Expiry inputs with dynamic slash
  const expiryInput = document.getElementById('card-expiry-input');
  if (expiryInput) {
    expiryInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        e.target.value = value.slice(0, 2) + '/' + value.slice(2, 4);
      } else {
        e.target.value = value;
      }
    });
  }

  // Format CVV CVC inputs numbers only
  const cvcInput = document.getElementById('card-cvc-input');
  if (cvcInput) {
    cvcInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
  }

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

  // Populate Back button link back to seats page with query params intact
  document.getElementById('back-link').href = `../booksummarypage/summary.html?theater=${encodeURIComponent(theaterParam)}&date=${encodeURIComponent(dateParam)}&format=${encodeURIComponent(formatParam)}&time=${encodeURIComponent(timeParam)}&screen=${encodeURIComponent(screenParam)}&seats=${encodeURIComponent(seatsParam)}`;

  // Split seats parameter to count billing totals
  const seatsArr = seatsParam.split(', ').filter(s => s.trim() !== "");
  const count = seatsArr.length;

  document.getElementById('summary-qty-label').textContent = `${count}x Tickets`;
  
  const ticketCost = count * ticketRate;
  document.getElementById('summary-cost-text').textContent = `₹${ticketCost}`;
  document.getElementById('summary-total-text').textContent = `₹${ticketCost + bookingFee}`;
});

// Validate inputs & Complete Payment trigger
function handleCompleteCheckout() {
  if (activePaymentTab === 'card') {
    const nameVal = document.getElementById('card-name-input').value.trim();
    const numVal = document.getElementById('card-number-input').value.trim();
    const expVal = document.getElementById('card-expiry-input').value.trim();
    const cvcVal = document.getElementById('card-cvc-input').value.trim();

    if (!nameVal || !numVal || !expVal || !cvcVal) {
      showToast("Please fill in all credit card details!");
      shakeForm();
      return;
    }
    
    if (numVal.length < 19) {
      showToast("Invalid card number length!");
      return;
    }

    if (expVal.length < 5) {
      showToast("Invalid expiry format (MM/YY)!");
      return;
    }

    if (cvcVal.length < 3) {
      showToast("Invalid CVV length!");
      return;
    }
  } else {
    if (!selectedWalletName) {
      showToast("Please select a wallet provider!");
      return;
    }
  }

  showToast("Processing payment...");
  setTimeout(() => {
    window.location.href = `../successpaymentpage/success.html?theater=${encodeURIComponent(theaterParam)}&date=${encodeURIComponent(dateParam)}&format=${encodeURIComponent(formatParam)}&time=${encodeURIComponent(timeParam)}&screen=${encodeURIComponent(screenParam)}&seats=${encodeURIComponent(seatsParam)}`;
  }, 1200);
}

// Shake helper on checkout input error
function shakeForm() {
  const container = document.getElementById('card-payment-form');
  container.classList.add('animate-bounce');
  setTimeout(() => {
    container.classList.remove('animate-bounce');
  }, 500);
}
