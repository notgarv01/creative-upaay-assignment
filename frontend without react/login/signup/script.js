let currentTab = 'login';

function switchTab(tab) {
  if (tab === currentTab) return;
  currentTab = tab;

  const highlight = document.getElementById('tab-highlight');
  const loginBtn = document.getElementById('tab-login');
  const signupBtn = document.getElementById('tab-signup');
  const slider = document.getElementById('forms-slider');
  const submitBtn = document.getElementById('submit-btn');

  if (tab === 'login') {
    // Slide highlight to Login
    highlight.style.transform = 'translateX(0)';
    
    // Update tab styles
    loginBtn.classList.remove('text-brand-textGray');
    loginBtn.classList.add('text-brand-dark');
    signupBtn.classList.remove('text-brand-dark');
    signupBtn.classList.add('text-brand-textGray');

    // Slide forms wrapper
    slider.style.transform = 'translateX(0)';

    // Update main button
    submitBtn.textContent = 'Login';
    submitBtn.setAttribute('form', 'form-login');
  } else {
    // Slide highlight to Sign Up
    highlight.style.transform = 'translateX(calc(100% + 8px))'; // Accounts for padding and offsets
    
    // Update tab styles
    signupBtn.classList.remove('text-brand-textGray');
    signupBtn.classList.add('text-brand-dark');
    loginBtn.classList.remove('text-brand-dark');
    loginBtn.classList.add('text-brand-textGray');

    // Slide forms wrapper
    slider.style.transform = 'translateX(-50%)';

    // Update main button
    submitBtn.textContent = 'Sign Up';
    submitBtn.setAttribute('form', 'form-signup');
  }
}

// Adjust highlight slider width/offset on window load for precision
window.addEventListener('load', () => {
  const highlight = document.getElementById('tab-highlight');
  highlight.style.width = 'calc(50% - 4px)';
});

// Password show/hide toggle
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4 text-brand-primary">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    `;
  } else {
    input.type = 'password';
    btn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    `;
  }
}

// Custom Toast triggering
function showToast(message, isSuccess = true) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  const iconEl = document.getElementById('toast-icon');
  
  msgEl.textContent = message;
  
  if (isSuccess) {
    iconEl.className = 'text-emerald-400';
    iconEl.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
      </svg>
    `;
  } else {
    iconEl.className = 'text-rose-400';
    iconEl.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
      </svg>
    `;
  }
  
  toast.classList.remove('-translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');
  
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('-translate-y-24', 'opacity-0');
  }, 3500);
}

// Handle Forms Submission
function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  showToast(`Welcome back, ${email.split('@')[0]}!`);
  setTimeout(() => {
    window.location.href = window.location.pathname.includes('/login/signup/') ? '../../homepage/home.html' : 'homepage/home.html';
  }, 1500);
}

function handleSignUp(event) {
  event.preventDefault();
  const password = document.getElementById('signup-password');
  const confirm = document.getElementById('signup-confirm');
  const name = document.getElementById('signup-name').value;

  if (password.value !== confirm.value) {
    // Shake matching elements
    password.parentElement.classList.add('shake');
    confirm.parentElement.classList.add('shake');
    showToast("Passwords do not match!", false);
    
    setTimeout(() => {
      password.parentElement.classList.remove('shake');
      confirm.parentElement.classList.remove('shake');
    }, 500);
    return;
  }

  showToast(`Account created for ${name}!`);
  setTimeout(() => {
    window.location.href = window.location.pathname.includes('/login/signup/') ? '../../homepage/home.html' : 'homepage/home.html';
  }, 1500);
}
