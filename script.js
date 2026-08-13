/* =========================================================
   SCRIPT.JS — Página de Aquecimento Jardim das Gerais
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // 1. SCROLL ANIMATIONS (Intersection Observer)
  // ========================================
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    scrollObserver.observe(el);
  });

  // ========================================
  // 2. GALLERY — Carrossel Automático
  // ========================================
  const track = document.getElementById('gallery-track');
  const items = track ? track.querySelectorAll('.gallery-item') : [];
  const dotsContainer = document.getElementById('gallery-dots');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');

  let currentIndex = 0;
  let autoPlayInterval;
  const AUTO_PLAY_MS = 3500;

  function initGallery() {
    if (!track || items.length === 0) return;

    // Create dots
    items.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Foto ${i + 1}`);
      dot.addEventListener('click', () => scrollToItem(i));
      dotsContainer.appendChild(dot);
    });

    // Arrow events
    if (prevBtn) prevBtn.addEventListener('click', () => scrollToItem(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => scrollToItem(currentIndex + 1));

    // Auto-play
    startAutoPlay();

    // Pause on interaction
    track.addEventListener('pointerdown', stopAutoPlay);
    track.addEventListener('touchstart', stopAutoPlay, { passive: true });
    track.addEventListener('scroll', handleScroll, { passive: true });

    // Initial highlight
    updateCenterItem();
  }

  function scrollToItem(index) {
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    currentIndex = index;

    const item = items[index];
    const trackRect = track.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const offset = itemRect.left - trackRect.left + track.scrollLeft - (trackRect.width / 2) + (itemRect.width / 2);

    track.scrollTo({ left: offset, behavior: 'smooth' });
    updateDots();
    updateCenterItem();
  }

  function handleScroll() {
    const trackCenter = track.scrollLeft + track.offsetWidth / 2;
    let closest = 0;
    let closestDist = Infinity;

    items.forEach((item, i) => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const dist = Math.abs(trackCenter - itemCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = i;
      }
    });

    if (closest !== currentIndex) {
      currentIndex = closest;
      updateDots();
      updateCenterItem();
    }
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.gallery-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
  }

  function updateCenterItem() {
    items.forEach((item, i) => item.classList.toggle('is-center', i === currentIndex));
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayInterval = setInterval(() => {
      scrollToItem(currentIndex + 1);
    }, AUTO_PLAY_MS);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
    setTimeout(startAutoPlay, 8000);
  }

  initGallery();

  // ========================================
  // 3. COUNTER ANIMATION (Numbers Section)
  // ========================================
  const counterElements = document.querySelectorAll('.proof-stat-number[data-target]');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  counterElements.forEach(el => counterObserver.observe(el));

  function animateCounters() {
    counterElements.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'));
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        el.textContent = current.toLocaleString('pt-BR');

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target.toLocaleString('pt-BR');
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }



  // ========================================
  // 6. SMOOTH SCROLL FOR ANCHOR LINKS
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ========================================
  // 7. FLOATING WHATSAPP — Show after scroll
  // ========================================
  const floatingBtn = document.getElementById('floating-whatsapp');
  if (floatingBtn) {
    floatingBtn.style.opacity = '0';
    floatingBtn.style.pointerEvents = 'none';
    floatingBtn.style.transition = 'opacity 0.5s ease, transform 0.3s ease';

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        floatingBtn.style.opacity = '1';
        floatingBtn.style.pointerEvents = 'auto';
      } else {
        floatingBtn.style.opacity = '0';
        floatingBtn.style.pointerEvents = 'none';
      }
    }, { passive: true });
  }

  // ========================================
  // 8. CTA TRACKING
  // ========================================
  document.querySelectorAll('[id^="cta-"]').forEach(btn => {
    btn.addEventListener('click', () => {
      console.log(`[CTA Click] ${btn.id} — ${new Date().toISOString()}`);
    });
  });

});
