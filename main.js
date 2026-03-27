/* ============================================
   AUTOSHINE - JavaScript Principal
============================================ */

// ===== AOS INIT =====
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 700,
    once: true,
    offset: 80,
    easing: 'ease-out-cubic'
  });

  initNavbar();
  initHeroParticles();
  initCounters();
  initTestimonialsSlider();
  initContactForm();
  initScrollTop();
  initSmoothScroll();
  initActiveLinkHighlight();
});

/* ===========================
   NAVBAR
=========================== */
function initNavbar() {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // Scroll effect
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ===========================
   ACTIVE LINK HIGHLIGHT
=========================== */
function initActiveLinkHighlight() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, {
    threshold: 0.4,
    rootMargin: '-70px 0px -40% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/* ===========================
   SMOOTH SCROLL
=========================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ===========================
   HERO PARTICLES
=========================== */
function initHeroParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const count = window.innerWidth < 768 ? 15 : 30;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 15 + 10;
    const opacity = Math.random() * 0.4 + 0.1;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -10px;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      opacity: ${opacity};
      background: ${Math.random() > 0.5 ? '#00d4ff' : '#0d6efd'};
    `;

    container.appendChild(p);
  }
}

/* ===========================
   COUNTERS ANIMATION
=========================== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  let started = false;

  const startCounting = () => {
    if (started) return;
    const heroStats = document.querySelector('.hero-stats');
    if (!heroStats) return;
    const rect = heroStats.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      started = true;
      counters.forEach(counter => animateCounter(counter));
    }
  };

  window.addEventListener('scroll', startCounting, { passive: true });
  setTimeout(startCounting, 500); // try immediately too
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    current = Math.min(Math.round(increment * step), target);

    // Easing
    const progress = step / steps;
    const eased = 1 - Math.pow(1 - progress, 3);
    current = Math.round(target * eased);

    el.textContent = current.toLocaleString('pt-BR');

    if (step >= steps) {
      el.textContent = target.toLocaleString('pt-BR');
      clearInterval(timer);
    }
  }, duration / steps);
}

/* ===========================
   TESTIMONIALS SLIDER
=========================== */
function initTestimonialsSlider() {
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('sliderDots');

  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let currentIndex = 0;
  let autoPlayInterval;

  const getVisibleCount = () => {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  let visibleCount = getVisibleCount();
  const totalSlides = cards.length;
  const maxIndex = totalSlides - visibleCount;

  // Create dots
  const createDots = () => {
    dotsContainer.innerHTML = '';
    const dotCount = maxIndex + 1;
    for (let i = 0; i <= Math.max(0, maxIndex); i++) {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      if (i === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  };

  const updateDots = () => {
    dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  };

  const goTo = (index) => {
    visibleCount = getVisibleCount();
    const max = totalSlides - visibleCount;
    currentIndex = Math.max(0, Math.min(index, max));

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 24;
    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  };

  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);

  nextBtn.addEventListener('click', () => { next(); resetAutoPlay(); });
  prevBtn.addEventListener('click', () => { prev(); resetAutoPlay(); });

  const startAutoPlay = () => {
    autoPlayInterval = setInterval(() => {
      const max = totalSlides - getVisibleCount();
      if (currentIndex >= max) {
        goTo(0);
      } else {
        next();
      }
    }, 4500);
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  };

  // Init
  createDots();
  startAutoPlay();

  // Recalc on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      visibleCount = getVisibleCount();
      createDots();
      goTo(0);
    }, 200);
  });

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
      resetAutoPlay();
    }
  }, { passive: true });
}

/* ===========================
   CONTACT FORM
=========================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successDiv = document.getElementById('formSuccess');
  if (!form) return;

  // Phone mask
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      let v = phoneInput.value.replace(/\D/g, '');
      if (v.length > 11) v = v.slice(0, 11);

      let masked = '';
      if (v.length > 0) masked = '(' + v.slice(0, 2);
      if (v.length >= 2) masked += ') ' + v.slice(2, 7);
      if (v.length >= 7) masked += '-' + v.slice(7, 11);

      phoneInput.value = masked;
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;

    // Simulate API call / form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Save to local storage as backup
    const formData = {
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      vehicle: document.getElementById('vehicle').value,
      service: document.getElementById('service').value,
      message: document.getElementById('message').value,
      date: new Date().toLocaleString('pt-BR')
    };

    const requests = JSON.parse(localStorage.getItem('autoshine_requests') || '[]');
    requests.push(formData);
    localStorage.setItem('autoshine_requests', JSON.stringify(requests));

    // Show success
    form.style.display = 'none';
    if (successDiv) successDiv.style.display = 'block';
  });
}

function validateForm() {
  let valid = true;

  const fields = [
    { id: 'name', errorId: 'nameError', msg: 'Por favor, informe seu nome.' },
    { id: 'phone', errorId: 'phoneError', msg: 'Por favor, informe seu WhatsApp.' },
    { id: 'vehicle', errorId: 'vehicleError', msg: 'Por favor, informe seu veículo.' },
    { id: 'service', errorId: 'serviceError', msg: 'Por favor, selecione um serviço.' },
  ];

  fields.forEach(({ id, errorId, msg }) => {
    const input = document.getElementById(id);
    const error = document.getElementById(errorId);
    if (!input || !error) return;

    if (!input.value.trim()) {
      input.classList.add('error');
      error.textContent = msg;
      error.classList.add('visible');
      valid = false;
    } else {
      input.classList.remove('error');
      error.classList.remove('visible');
    }

    // Live validation
    input.addEventListener('input', () => {
      if (input.value.trim()) {
        input.classList.remove('error');
        error.classList.remove('visible');
      }
    }, { once: false });
  });

  // Email validation (optional field)
  const emailInput = document.getElementById('email');
  if (emailInput && emailInput.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      emailInput.classList.add('error');
      valid = false;
    } else {
      emailInput.classList.remove('error');
    }
  }

  return valid;
}

// Reset form function (called from HTML)
window.resetForm = function(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const successDiv = document.getElementById('formSuccess');
  if (form && successDiv) {
    form.reset();
    form.style.display = 'flex';
    successDiv.style.display = 'none';

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Solicitação';
    submitBtn.disabled = false;
  }
};

/* ===========================
   SCROLL TO TOP
=========================== */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===========================
   CARD HOVER EFFECTS
=========================== */
document.querySelectorAll('.service-card, .plan-card, .diferencial-item').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transition = 'all 0.3s ease';
  });
});

/* ===========================
   KEYBOARD ACCESSIBILITY
=========================== */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    if (navLinks && navLinks.classList.contains('open')) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});
