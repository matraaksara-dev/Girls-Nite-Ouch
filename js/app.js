/* =========================================================
   Nebula Arena — Interactions
   ========================================================= */
const TARGET_DATE = new Date('2026-08-14T20:00:00+07:00').getTime();

// --- Supabase Config ---
const SUPABASE_URL = 'https://kfvkmksksbignydwlawe.supabase.co';
const SUPABASE_KEY = 'sb_publishable_yG1jjzbaVC6soXhwLLb-uw_XA3pxC13';
const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

/* ---------- Nebula particle background ---------- */
function initNebulaBg() {
  const canvas = document.getElementById('nebula-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;
  let mouse = { x: null, y: null };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Stars + soft nebula dots
  const COUNT = Math.min(70, Math.floor((w * h) / 18000));
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      alpha: Math.random() * 0.45 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    });
  }

  // Occasional larger “nebula blob” glow
  const blobs = Array.from({ length: 4 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 80 + Math.random() * 120,
    vx: (Math.random() - 0.5) * 0.05,
    vy: (Math.random() - 0.5) * 0.05,
    hue: Math.random() > 0.5 ? 270 : 320,
  }));

  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  function animate() {
    ctx.clearRect(0, 0, w, h);

    // Soft blobs
    blobs.forEach((b) => {
      b.x += b.vx;
      b.y += b.vy;
      if (b.x < -b.r || b.x > w + b.r) b.vx *= -1;
      if (b.y < -b.r || b.y > h + b.r) b.vy *= -1;
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      g.addColorStop(0, `hsla(${b.hue}, 70%, 55%, 0.07)`);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    });

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      // gentle mouse attract
      if (mouse.x != null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x += dx * 0.0008;
          p.y += dy * 0.0008;
        }
      }

      const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(177, 78, 255, ${a})`;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }
  animate();
}

/* ---------- Mobile nav overlay ---------- */
function initNav() {
  const btn = document.getElementById('hamburgerBtn');
  const overlay = document.getElementById('navOverlay');
  const icon = document.getElementById('menuIcon');
  if (!btn || !overlay) return;

  function openMenu() {
    overlay.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    if (window.lucide) {
      icon.setAttribute('data-lucide', 'x');
      lucide.createIcons();
    }
  }
  function closeMenu() {
    overlay.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    if (window.lucide) {
      icon.setAttribute('data-lucide', 'menu');
      lucide.createIcons();
    }
  }

  btn.addEventListener('click', () => {
    if (overlay.classList.contains('open')) closeMenu();
    else openMenu();
  });

  overlay.querySelectorAll('[data-nav]').forEach((el) => {
    el.addEventListener('click', () => closeMenu());
  });

  // Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeMenu();
  });
}

/* ---------- Countdown ---------- */
function startCountdown() {
  const update = () => {
    const now = Date.now();
    const diff = TARGET_DATE - now;
    const wrap = document.getElementById('countdown');
    if (!wrap) return;

    if (diff < 0) {
      wrap.innerHTML = '<p class="text-gold font-display" style="grid-column:1/-1;padding:0.5rem;">WAKTU PENDAFTARAN BERAKHIR</p>';
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(val).padStart(2, '0');
    };
    set('cd-days', days);
    set('cd-hours', hours);
    set('cd-mins', mins);
    set('cd-secs', secs);
  };
  update();
  setInterval(update, 1000);
}

/* ---------- Reveal on scroll ---------- */
function observeReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  els.forEach((el) => io.observe(el));
}

/* ---------- Sticky CTA (mobile) ---------- */
function initStickyCta() {
  const sticky = document.getElementById('stickyCta');
  const hero = document.getElementById('hero');
  if (!sticky || !hero) return;

  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) sticky.classList.remove('visible');
      else sticky.classList.add('visible');
    },
    { threshold: 0.15 }
  );
  io.observe(hero);
}

/* ---------- Demo form ---------- */
function initForm() {
  const form = document.getElementById('demoForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const required = [
      'robloxUsername', 'robloxId', 'discordId', 'tiktokLink',
      'tiktokFollowConsent', 'genderVerificationConsent', 'rulesAgreement'
    ];

    required.forEach((name) => {
      const field = form.elements[name];
      const err = form.querySelector(`.error-msg[data-for="${name}"]`);
      if (!field) return;
      
      let isFieldValid = true;

      if (field.type === 'checkbox') {
        isFieldValid = field.checked;
      } else if (field.name === 'tiktokLink') {
        let val = field.value.trim();
        if (val) {
          // If it doesn't start with http, assume it's a username
          if (!val.startsWith('http://') && !val.startsWith('https://')) {
            if (val.startsWith('@')) val = val.substring(1);
            val = 'https://www.tiktok.com/@' + val;
            field.value = val; // Update the input so it saves correctly
          }
          // Validate if it's a proper URL now
          try {
            new URL(val);
            isFieldValid = true;
          } catch (_) {
            isFieldValid = false;
          }
        } else {
          isFieldValid = false;
        }
      } else if (field.type === 'url') {
        // Basic URL validation for any other url fields
        try {
          new URL(field.value);
          isFieldValid = true;
        } catch (_) {
          isFieldValid = false;
        }
      } else {
        isFieldValid = !!field.value && (field.minLength <= 0 || field.value.length >= field.minLength);
      }

      if (!isFieldValid) {
        if (err) err.style.display = 'block';
        valid = false;
      } else {
        if (err) err.style.display = 'none';
      }
    });

    if (!valid) return;

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled = true;

    // Save to Supabase
    const newEntry = {
      id: Date.now().toString(), // Using timestamp as simple unique ID
      robloxUsername: form.elements['robloxUsername'].value,
      robloxId: form.elements['robloxId'].value,
      discordId: form.elements['discordId'].value,
      tiktokLink: form.elements['tiktokLink'].value,
      status: 'Pending'
    };
    
    if (supabase) {
      supabase.from('participants').insert([newEntry]).then(({ error }) => {
        submitBtn.innerHTML = originalBtnContent;
        submitBtn.disabled = false;
        
        if (error) {
          console.error(error);
          alert('Gagal mengirim data. Silakan coba lagi.');
          return;
        }

        updateSlotCount();
        document.getElementById('successModal').classList.add('active');
        fireConfetti();
        form.reset();
      });
    } else {
      // Fallback local if supabase fails to load
      let participants = JSON.parse(localStorage.getItem('gno_participants') || '[]');
      participants.push({...newEntry, timestamp: Date.now()});
      localStorage.setItem('gno_participants', JSON.stringify(participants));
      submitBtn.innerHTML = originalBtnContent;
      submitBtn.disabled = false;
      updateSlotCount();
      document.getElementById('successModal').classList.add('active');
      fireConfetti();
      form.reset();
    }
  });

  form.querySelectorAll('.form-control').forEach((input) => {
    input.addEventListener('input', () => {
      const err = form.querySelector(`.error-msg[data-for="${input.name}"]`);
      if (err) err.style.display = 'none';
    });
  });
}

async function updateSlotCount() {
  let count = 0;
  if (supabase) {
    const { count: sbCount, error } = await supabase.from('participants').select('*', { count: 'exact', head: true });
    if (!error) count = sbCount;
  } else {
    const participants = JSON.parse(localStorage.getItem('gno_participants') || '[]');
    count = participants.length;
  }
  
  const maxSlots = 8;
  
  const slotText = document.getElementById('slotCount');
  const progressBar = document.getElementById('progressBar');
  
  if (slotText) {
    slotText.textContent = `${count} / ${maxSlots} terisi`;
  }
  
  if (progressBar) {
    const percentage = Math.min((count / maxSlots) * 100, 100);
    progressBar.style.width = `${percentage}%`;
  }
}

function fireConfetti() {
  if (typeof confetti !== 'function') return;
  const end = Date.now() + 1400;
  const colors = ['#FF3D9A', '#FFD23F', '#B14EFF', '#D4AF37'];
  (function frame() {
    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function closeModal() {
  document.getElementById('successModal').classList.remove('active');
}

/* ---------- Raffle demo animation ---------- */
function initRaffle() {
  const btn = document.getElementById('raffleBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    btn.disabled = true;
    const original = btn.innerHTML;
    btn.innerHTML = '<span class="font-mono">Mengundi…</span>';
    let n = 0;
    const tick = setInterval(() => {
      n++;
      btn.innerHTML = `<span class="font-mono">🎲 ${Math.floor(Math.random() * 90 + 10)}</span>`;
      if (n > 12) {
        clearInterval(tick);
        btn.innerHTML = original;
        btn.disabled = false;
        if (window.lucide) lucide.createIcons();
        alert('Pengundian selesai! (demo)\n8 utama + cadangan telah dipilih.');
      }
    }, 120);
  });
}

/* ---------- Init ---------- */
window.addEventListener('DOMContentLoaded', () => {
  initNebulaBg();
  initNav();
  startCountdown();
  observeReveal();
  initStickyCta();
  initForm();
  initRaffle();
  updateSlotCount();
  if (window.lucide) lucide.createIcons();
});

// Expose for inline onclick
window.closeModal = closeModal;
