/**
 * RummyCircle Presentation Theater Dashboard Module
 * Manages slide rendering, autoplay, progressive unlocking, and analytics for RC web slides.
 */
window.RummycircleStoryModal = (function() {
  let modalEl = null;
  let currentSlide = 0;
  const totalSlides = 8;
  let imagesPreloaded = false;
  let autoplayInterval = null;
  let isAutoplayActive = false;
  let isAnimating = false;
  let animationTimeout = null;
  
  let maxSlideReached = 0;

  const insights = [
    "Analyzing gameplay drop-off patterns...",
    "Redesigning real-money table lobbies...",
    "Optimizing card sorting cognitive load...",
    "Structuring reward & tournament flows...",
    "Enhancing real-time multiplayer UX..."
  ];

  function logClarityEvent(eventName) {
    if (typeof window.clarity === "function") {
      try {
        window.clarity("event", eventName);
      } catch (err) {
        console.warn("Clarity logging failed: ", err);
      }
    }
  }

  async function createMarkup() {
    if (modalEl) return modalEl;

    try {
      const res = await fetch('components/rummycircle-story/rummycircle-story.html');
      if (res.ok) {
        const text = await res.text();
        const temp = document.createElement('div');
        temp.innerHTML = text.trim();
        const overlayNode = temp.firstElementChild;
        document.body.appendChild(overlayNode);
        modalEl = overlayNode;
        return modalEl;
      }
    } catch (e) {
      console.warn("Component fetch fallback: ", e);
    }

    const overlay = document.createElement('div');
    overlay.className = 'story-overlay';
    overlay.id = 'rummycircle-story-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    let gridLinesHTML = '';
    for (let i = 0; i < 12; i++) {
      gridLinesHTML += '<div class="story-grid-line"></div>';
    }

    let thumbnailsHTML = '';
    for (let i = 1; i <= totalSlides; i++) {
      const isLocked = i > 1;
      thumbnailsHTML += `
        <div class="thumbnail-card ${isLocked ? 'locked' : ''}" data-slide-index="${i - 1}">
          <img src="RC web/${i}.png" alt="Thumb ${i}" />
          <span class="thumbnail-number">${String(i).padStart(2, '0')}</span>
          <div class="thumbnail-lock-overlay">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
        </div>
      `;
    }

    overlay.innerHTML = `
      <div class="story-bg-grid">${gridLinesHTML}</div>
      <div class="story-theater-stage">
        <header class="story-theater-header">
          <div class="story-logo">Sayantan Ghosh<span>.</span></div>
          <div style="display: flex; align-items: center; gap: 16px;">
            <button class="story-header-cta" id="rc-dive-btn">
              View Case Study
              <svg xmlns="http://www.w3.org/2000/svg" height="15" width="15" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;margin-left:4px;"><path d="M5 13h11.86l-5.43 5.43L13 20l8-8-8-8-1.41 1.41 5.43 5.43H5v2z"/></svg>
            </button>
            <button class="story-control-btn" id="rc-close-btn" aria-label="Close Presentation" style="border-radius:50%; width:40px; height:40px; margin: 0;">✕</button>
          </div>
        </header>

        <div class="story-viewport-wrapper">
          <div class="story-stage-glow"></div>
          <div class="story-viewport" id="rc-slide-viewport">
            <div class="theater-progress-bar">
              <div class="theater-progress-fill" id="rc-progress-indicator"></div>
            </div>
            <div class="story-loader" id="rc-modal-loader">
              <div class="loader-spinner-container">
                <div class="loader-spinner"></div>
                <span class="loader-percentage" id="rc-pct-text">0%</span>
              </div>
              <p class="loader-insight" id="rc-insight-text">Initializing RummyCircle presentation...</p>
            </div>
          </div>
        </div>

        <footer class="story-theater-footer">
          <div class="story-stage-controls">
            <button class="story-control-btn" id="rc-prev-btn" aria-label="Previous Slide">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button class="story-control-btn" id="rc-play-btn" aria-label="Play Autoplay">
              <svg id="rc-play-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </button>
            <button class="story-control-btn" id="rc-next-btn" aria-label="Next Slide">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
          <span style="font-family: monospace; font-weight: 600;" id="rc-counter-label">Slide 01 / 08</span>
        </footer>
      </div>

      <aside class="story-nav-sidebar">
        <div class="sidebar-header-box">
          <h3 class="sidebar-title">RummyCircle UX</h3>
          <p style="font-size: var(--font-size-xs); color: var(--text-primary); line-height: 1.4; margin-top: -12px;">Real-money gaming UX architecture, table lobby redesign, and reward flow presentation.</p>
        </div>
        <div class="thumbnails-grid" id="rc-thumbnails-container">
          ${thumbnailsHTML}
        </div>
      </aside>
    `;

    document.body.appendChild(overlay);
    modalEl = overlay;
    return modalEl;
  }

  function renderSlide(index, direction = 'next') {
    const container = document.getElementById('rc-slide-viewport');
    if (!container) return;

    const imagePath = `RC web/${index + 1}.png`;

    const newSlide = document.createElement('div');
    newSlide.className = 'slide-layout';
    newSlide.innerHTML = `<img src="${imagePath}" alt="Slide ${index + 1}" class="story-slide-img" />`;

    const oldSlide = container.querySelector('.slide-layout');

    if (!oldSlide) {
      container.appendChild(newSlide);
      isAnimating = false;
    } else {
      isAnimating = true;

      const enterClass = direction === 'next' ? 'slide-enter-next' : 'slide-enter-prev';
      const exitClass = direction === 'next' ? 'slide-exit-next' : 'slide-exit-prev';

      newSlide.classList.add(enterClass);
      container.appendChild(newSlide);

      newSlide.offsetHeight;

      newSlide.classList.remove(enterClass);
      oldSlide.classList.add(exitClass);

      clearTimeout(animationTimeout);

      animationTimeout = setTimeout(() => {
        if (oldSlide && oldSlide.parentNode) oldSlide.remove();
        container.querySelectorAll('.slide-layout').forEach(el => {
          if (el !== newSlide) el.remove();
        });
        isAnimating = false;
      }, 500);
    }

    maxSlideReached = Math.max(maxSlideReached, index);

    const fillPercent = ((index + 1) / totalSlides) * 100;
    const progressFill = document.getElementById('rc-progress-indicator');
    if (progressFill) progressFill.style.width = `${fillPercent}%`;

    const thumbnails = document.querySelectorAll('#rc-thumbnails-container .thumbnail-card');
    thumbnails.forEach((thumb, i) => {
      if (i <= maxSlideReached) {
        thumb.classList.remove('locked');
      } else {
        thumb.classList.add('locked');
      }

      if (i === index) {
        thumb.classList.add('active');
      } else {
        thumb.classList.remove('active');
      }
    });

    const grid = document.getElementById('rc-thumbnails-container');
    if (grid) {
      const activeThumb = grid.querySelector('.thumbnail-card.active');
      if (activeThumb) {
        if (window.innerWidth <= 1024) {
          const leftOffset = activeThumb.offsetLeft - grid.offsetLeft;
          grid.scrollTo({
            left: leftOffset - (grid.clientWidth / 2) + (activeThumb.clientWidth / 2),
            behavior: 'smooth'
          });
        } else {
          const topOffset = activeThumb.offsetTop - grid.offsetTop;
          grid.scrollTo({
            top: topOffset - (grid.clientHeight / 2) + (activeThumb.clientHeight / 2),
            behavior: 'smooth'
          });
        }
      }
    }

    const formattedNum = String(index + 1).padStart(2, '0');
    const label = document.getElementById('rc-counter-label');
    if (label) label.textContent = `Slide ${formattedNum} / 08`;

    logClarityEvent(`rc_view_slide_${formattedNum}`);
  }

  function nextSlide() {
    if (isAnimating) return;
    if (currentSlide < totalSlides - 1) {
      currentSlide++;
      renderSlide(currentSlide, 'next');
    } else {
      if (isAutoplayActive) {
        currentSlide = 0;
        renderSlide(currentSlide, 'next');
      }
    }
  }

  function prevSlide() {
    if (isAnimating) return;
    if (currentSlide > 0) {
      currentSlide--;
      renderSlide(currentSlide, 'prev');
    }
  }

  function toggleAutoplay() {
    const playBtnIcon = document.getElementById('rc-play-icon');
    if (!playBtnIcon) return;

    if (isAutoplayActive) {
      clearInterval(autoplayInterval);
      isAutoplayActive = false;
      playBtnIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
      logClarityEvent('rc_autoplay_pause');
    } else {
      isAutoplayActive = true;
      playBtnIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
      autoplayInterval = setInterval(() => {
        nextSlide();
      }, 4500);
      logClarityEvent('rc_autoplay_start');
    }
  }

  function startInsightCycler() {
    const textEl = document.getElementById('rc-insight-text');
    let idx = 0;
    
    const interval = setInterval(() => {
      if (!textEl || imagesPreloaded) {
        clearInterval(interval);
        return;
      }
      
      idx = (idx + 1) % insights.length;
      textEl.textContent = insights[idx];
    }, 1500);
  }

  function preloadSlideImages(onProgress, onComplete) {
    let loaded = 0;
    
    for (let i = 1; i <= totalSlides; i++) {
      const img = new Image();
      img.src = `RC web/${i}.png`;
      
      img.onload = img.onerror = () => {
        loaded++;
        onProgress(Math.floor((loaded / totalSlides) * 100));
        
        if (loaded === totalSlides) {
          imagesPreloaded = true;
          onComplete();
        }
      };
    }
  }

  async function openModal() {
    if (!modalEl) {
      await createMarkup();
      initThumbnails();
      bindEvents();
      startInsightCycler();
      
      const pctText = document.getElementById('rc-pct-text');
      const loaderScreen = document.getElementById('rc-modal-loader');
      
      preloadSlideImages(
        (pct) => {
          if (pctText) pctText.textContent = `${pct}%`;
        },
        () => {
          if (loaderScreen) {
            loaderScreen.style.opacity = '0';
            setTimeout(() => {
              loaderScreen.remove();
            }, 500);
          }
        }
      );
    }
    
    currentSlide = 0;
    isAnimating = false;
    renderSlide(currentSlide);
    modalEl.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    logClarityEvent('rc_modal_open');
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.classList.remove('active');
    document.body.style.overflow = '';
    
    if (isAutoplayActive) {
      toggleAutoplay();
    }
    
    isAnimating = false;
    clearTimeout(animationTimeout);
    
    logClarityEvent('rc_modal_close');
  }

  function bindEvents() {
    modalEl.addEventListener('click', (e) => {
      if (e.target.closest('#rc-close-btn')) {
        const btn = e.target.closest('#rc-close-btn');
        if (btn && btn.tagName === 'A') return;
        closeModal();
        return;
      }

      if (e.target.closest('#rc-prev-btn')) {
        prevSlide();
        return;
      }

      if (e.target.closest('#rc-play-btn')) {
        toggleAutoplay();
        return;
      }

      if (e.target.closest('#rc-next-btn')) {
        nextSlide();
        return;
      }

      if (e.target.closest('#rc-dive-btn')) {
        const btn = e.target.closest('#rc-dive-btn');
        if (btn && btn.tagName === 'A') return;
        closeModal();
        logClarityEvent('rc_case_study_click');
        return;
      }

      const thumbnailCard = e.target.closest('.thumbnail-card');
      if (thumbnailCard) {
        if (thumbnailCard.classList.contains('locked') || isAnimating) {
          logClarityEvent('rc_thumbnail_locked_click');
          return;
        }
        
        const targetIndex = parseInt(thumbnailCard.getAttribute('data-slide-index'), 10);
        if (!isNaN(targetIndex) && targetIndex !== currentSlide) {
          const dir = targetIndex > currentSlide ? 'next' : 'prev';
          currentSlide = targetIndex;
          renderSlide(currentSlide, dir);
          logClarityEvent(`rc_thumbnail_jump_to_${targetIndex + 1}`);
        }
        return;
      }
    });

    let touchstartX = 0;
    let touchendX = 0;
    const slideViewport = document.getElementById('rc-slide-viewport');
    if (slideViewport) {
      slideViewport.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
      }, { passive: true });

      slideViewport.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        if (touchendX < touchstartX - 50) nextSlide();
        if (touchendX > touchstartX + 50) prevSlide();
      }, { passive: true });
    }
  }

  function initThumbnails() {
    const grid = document.getElementById('rc-thumbnails-container');
    if (!grid || grid.children.length > 0) return;
    let thumbnailsHTML = '';
    for (let i = 1; i <= totalSlides; i++) {
      const isLocked = i > 1;
      thumbnailsHTML += `
        <div class="thumbnail-card ${isLocked ? 'locked' : ''}" data-slide-index="${i - 1}">
          <img src="RC web/${i}.png" alt="Thumb ${i}" />
          <span class="thumbnail-number">${String(i).padStart(2, '0')}</span>
          <div class="thumbnail-lock-overlay">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
        </div>
      `;
    }
    grid.innerHTML = thumbnailsHTML;
  }

  window.addEventListener('keydown', e => {
    if (!modalEl || !modalEl.classList.contains('active')) return;
    
    if (e.key === 'ArrowRight' || e.key === ' ') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'Escape') {
      const closeBtn = document.getElementById('rc-close-btn');
      if (closeBtn && closeBtn.tagName === 'A') {
        window.location.href = closeBtn.getAttribute('href') || 'index.html';
      } else {
        closeModal();
      }
    }
  });

  return {
    init() {
      const existingModal = document.getElementById('rummycircle-story-modal');
      if (existingModal) {
        modalEl = existingModal;
        initThumbnails();
        bindEvents();
        startInsightCycler();

        const pctText = document.getElementById('rc-pct-text');
        const loaderScreen = document.getElementById('rc-modal-loader');

        preloadSlideImages(
          (pct) => {
            if (pctText) pctText.textContent = `${pct}%`;
          },
          () => {
            if (loaderScreen) {
              loaderScreen.style.opacity = '0';
              setTimeout(() => {
                loaderScreen.remove();
              }, 500);
            }
          }
        );

        currentSlide = 0;
        isAnimating = false;
        renderSlide(currentSlide);
        logClarityEvent('rc_page_open');
      } else {
        const btn = document.getElementById('rummycircle-story-btn');
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
          });
        }
      }
    },
    open: openModal,
    close: closeModal
  };
})();
