function toggleCategory(category) {
  const btnNow = document.getElementById('btn-now');
  const btnSoon = document.getElementById('btn-soon');
  
  if (category === 'now') {
    btnNow.className = "text-sm font-bold text-brand-primary relative pb-2 border-b-2 border-brand-primary transition-all duration-300";
    btnSoon.className = "text-sm font-bold text-brand-textGray pb-2 border-b-2 border-transparent hover:text-slate-500 transition-all duration-300";
    
    // Mock data switch simulation
    document.getElementById('movies-carousel').style.opacity = '0.5';
    setTimeout(() => {
      document.getElementById('movies-carousel').style.opacity = '1';
    }, 150);
  } else {
    btnSoon.className = "text-sm font-bold text-brand-primary relative pb-2 border-b-2 border-brand-primary transition-all duration-300";
    btnNow.className = "text-sm font-bold text-brand-textGray pb-2 border-b-2 border-transparent hover:text-slate-500 transition-all duration-300";
    
    document.getElementById('movies-carousel').style.opacity = '0.5';
    setTimeout(() => {
      document.getElementById('movies-carousel').style.opacity = '1';
    }, 150);
  }
}
