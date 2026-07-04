/**
 * Widescreen Presentation Theater Dashboard Module
 * Uses PowerPoint slide images directly for exact visual representation.
 * Inherits tokens.css styling variables automatically for Dark & Light modes.
 * Uses native high-performance CSS transitions to prevent library load lockups.
 * Enforces progressive sequential slide reading (locking future slide jumps).
 * Integrated with Microsoft Clarity Custom Event API to track UX reading analytics.
 */

window.ProductStoryModal = (function() {
  let modalEl = null;
  let currentSlide = 0;
  const totalSlides = 16;
  let imagesPreloaded = false;
  let autoplayInterval = null;
  let isAutoplayActive = false;
  let isAnimating = false;
  let animationTimeout = null;
  
  // Track the highest slide index reached to restrict jumping ahead
  let maxSlideReached = 0;

  const insights = [
    "Analyzing elder movement patterns...",
    "Decoding caregiver alarm fatigue...",
    "Reconstructing timeline coordinates...",
    "Synthesizing qualitative observations...",
    "Balancing security against autonomy...",
    "Structuring passive check-in widgets..."
  ];

  // Safely log custom events directly to Microsoft Clarity
  function logClarityEvent(eventName) {
    if (typeof window.clarity === "function") {
      try {
        window.clarity("event", eventName);
      } catch (err) {
        console.warn("Clarity logging failed: ", err);
      }
    }
  }

  function createMarkup() {
    const overlay = document.createElement('div');
    overlay.className = 'story-overlay';
    overlay.id = 'product-story-modal';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    // Create 12 background grid lines
    let gridLinesHTML = '';
    for (let i = 0; i < 12; i++) {
      gridLinesHTML += '<div class="story-grid-line"></div>';
    }

    // Create thumbnail cards HTML with a lock icon SVG built-in
    let thumbnailsHTML = '';
    for (let i = 1; i <= totalSlides; i++) {
      const isLocked = i > 1;
      thumbnailsHTML += `
        <div class="thumbnail-card ${isLocked ? 'locked' : ''}" data-slide-index="${i - 1}">
          <img src="work/slides/Slide${i}.PNG" alt="Thumb ${i}" />
          <span class="thumbnail-number">${String(i).padStart(2, '0')}</span>
          <div class="thumbnail-lock-overlay">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
        </div>
      `;
    }

    overlay.innerHTML = `
      <!-- Background Texture Grid Lines -->
      <div class="story-bg-grid">${gridLinesHTML}</div>

      <!-- Main presentation stage (Left side) -->
      <div class="story-theater-stage">
        <header class="story-theater-header">
          <div class="story-logo">Sayantan Ghosh<span>.</span></div>
          <div style="display: flex; align-items: center; gap: 16px;">
            <button class="story-header-cta" id="story-dive-btn">
              View Case Study
              <svg xmlns="http://www.w3.org/2000/svg" height="15" width="15" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;margin-left:4px;"><path d="M5 13h11.86l-5.43 5.43L13 20l8-8-8-8-1.41 1.41 5.43 5.43H5v2z"/></svg>
            </button>
            <button class="story-control-btn" id="story-close-btn" aria-label="Close Presentation" style="border-radius:50%; width:40px; height:40px; margin: 0;">✕</button>
          </div>
        </header>

        <div class="story-viewport-wrapper">
          <!-- Floating ambient glow backing light -->
          <div class="story-stage-glow"></div>

          <div class="story-viewport" id="story-slide-viewport">
            <div class="theater-progress-bar">
              <div class="theater-progress-fill" id="story-progress-indicator"></div>
            </div>

            <!-- Preloader Container -->
            <div class="story-loader" id="story-modal-loader">
              <div class="loader-spinner-container">
                <div class="loader-spinner"></div>
                <span class="loader-percentage" id="loader-pct-text">0%</span>
              </div>
              <p class="loader-insight" id="loader-insight-text">Initializing presentation...</p>
            </div>
          </div>
        </div>

        <footer class="story-theater-footer">
          <div class="story-stage-controls">
            <button class="story-control-btn" id="story-prev-btn" aria-label="Previous Slide">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button class="story-control-btn" id="story-play-btn" aria-label="Play Autoplay">
              <svg id="play-btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </button>
            <button class="story-control-btn" id="story-next-btn" aria-label="Next Slide">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
          <span style="font-family: monospace; font-weight: 600;" id="story-counter-label">Slide 01 / 16</span>
        </footer>
      </div>

      <!-- Navigation Control Sidebar Dashboard (Right side) -->
      <aside class="story-nav-sidebar">
        <div class="sidebar-header-box">
          <h3 class="sidebar-title">Product Thinking</h3>
          <p style="font-size: var(--font-size-xs); color: var(--text-primary); line-height: 1.4; margin-top: -12px;">Interactive presentation detailing Tracto's UX methodology, behavioral logs, and wireframes.</p>
        </div>

        <div class="thumbnails-grid" id="story-thumbnails-container">
          ${thumbnailsHTML}
        </div>
      </aside>
    `;

    document.body.appendChild(overlay);
    modalEl = overlay;
  }

  function renderSlide(index, direction = 'next') {
    const container = document.getElementById('story-slide-viewport');
    if (!container) return;

    const imagePath = `work/slides/Slide${index + 1}.PNG`;

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

    // Update progress tracker index reached
    maxSlideReached = Math.max(maxSlideReached, index);

    // Update progress indicator fill
    const fillPercent = ((index + 1) / totalSlides) * 100;
    const progressFill = document.getElementById('story-progress-indicator');
    if (progressFill) progressFill.style.width = `${fillPercent}%`;

    // Highlight active thumbnail and adjust locking state dynamically
    const thumbnails = document.querySelectorAll('.thumbnail-card');
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

    // Custom relative scroll centering (vertical for desktop sidebar, horizontal for responsive bottom panel)
    const grid = document.getElementById('story-thumbnails-container');
    if (grid) {
      const activeThumb = grid.querySelector('.thumbnail-card.active');
      if (activeThumb) {
        if (window.innerWidth <= 1024) {
          // Horizontal scrolling for tablet/mobile bottom strip
          const leftOffset = activeThumb.offsetLeft - grid.offsetLeft;
          grid.scrollTo({
            left: leftOffset - (grid.clientWidth / 2) + (activeThumb.clientWidth / 2),
            behavior: 'smooth'
          });
        } else {
          // Vertical scrolling for desktop sidebar grid
          const topOffset = activeThumb.offsetTop - grid.offsetTop;
          grid.scrollTo({
            top: topOffset - (grid.clientHeight / 2) + (activeThumb.clientHeight / 2),
            behavior: 'smooth'
          });
        }
      }
    }

    // Update slide counter
    const formattedNum = String(index + 1).padStart(2, '0');
    const label = document.getElementById('story-counter-label');
    if (label) label.textContent = `Slide ${formattedNum} / ${totalSlides}`;

    // Log slide views to Microsoft Clarity (e.g. story_view_slide_05)
    logClarityEvent(`story_view_slide_${formattedNum}`);
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
    const playBtnIcon = document.getElementById('play-btn-icon');
    if (!playBtnIcon) return;

    if (isAutoplayActive) {
      clearInterval(autoplayInterval);
      isAutoplayActive = false;
      playBtnIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
      logClarityEvent('story_autoplay_pause');
    } else {
      isAutoplayActive = true;
      playBtnIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
      autoplayInterval = setInterval(() => {
        nextSlide();
      }, 4500);
      logClarityEvent('story_autoplay_start');
    }
  }

  function startInsightCycler() {
    const textEl = document.getElementById('loader-insight-text');
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
      img.src = `work/slides/Slide${i}.PNG`;
      
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

  function openModal() {
    if (!modalEl) {
      createMarkup();
      bindEvents();
      startInsightCycler();
      
      const pctText = document.getElementById('loader-pct-text');
      const loaderScreen = document.getElementById('story-modal-loader');
      
      preloadSlideImages(
        (pct) => {
          pctText.textContent = `${pct}%`;
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
    
    logClarityEvent('story_modal_open');
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
    
    logClarityEvent('story_modal_close');
  }

  function bindEvents() {
    modalEl.addEventListener('click', (e) => {
      // Close button
      if (e.target.closest('#story-close-btn')) {
        closeModal();
        return;
      }

      // Prev Slide button
      if (e.target.closest('#story-prev-btn')) {
        prevSlide();
        return;
      }

      // Play/Pause Autoplay button
      if (e.target.closest('#story-play-btn')) {
        toggleAutoplay();
        return;
      }

      // Next Slide button
      if (e.target.closest('#story-next-btn')) {
        nextSlide();
        return;
      }

      // Case study scroll CTA button
      if (e.target.closest('#story-dive-btn')) {
        closeModal();
        logClarityEvent('story_case_study_click');
        const researchSec = document.getElementById('section-tracto');
        if (researchSec) {
          setTimeout(() => {
            researchSec.scrollIntoView({ behavior: 'smooth' });
            // Activate "The real voice of user" tab (slide 0)
            setTimeout(() => {
              const firstTab = researchSec.querySelector('.tracto-tab-item[data-slide-to="0"]');
              if (firstTab) firstTab.click();
            }, 400);
          }, 350);
        }
        return;
      }



      // Thumbnail jump selector
      const thumbnailCard = e.target.closest('.thumbnail-card');
      if (thumbnailCard) {
        if (thumbnailCard.classList.contains('locked') || isAnimating) {
          logClarityEvent('story_thumbnail_locked_click');
          return;
        }
        
        const targetIndex = parseInt(thumbnailCard.getAttribute('data-slide-index'), 10);
        if (!isNaN(targetIndex) && targetIndex !== currentSlide) {
          const dir = targetIndex > currentSlide ? 'next' : 'prev';
          currentSlide = targetIndex;
          renderSlide(currentSlide, dir);
          logClarityEvent(`story_thumbnail_jump_to_${targetIndex + 1}`);
        }
        return;
      }
    });

    // Touch swipe support inside the theater viewport
    let touchstartX = 0;
    let touchendX = 0;
    const slideViewport = document.getElementById('story-slide-viewport');

    slideViewport.addEventListener('touchstart', e => {
      touchstartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slideViewport.addEventListener('touchend', e => {
      touchendX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      if (touchendX < touchstartX - 50) {
        nextSlide();
      }
      if (touchendX > touchstartX + 50) {
        prevSlide();
      }
    }
  }

  // Keyboard navigation
  window.addEventListener('keydown', e => {
    if (!modalEl || !modalEl.classList.contains('active')) return;
    
    if (e.key === 'ArrowRight' || e.key === ' ') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'Escape') {
      closeModal();
    }
  });

  return {
    init() {
      const heroBtn = document.getElementById('hero-research-btn');
      if (heroBtn) {
        heroBtn.addEventListener('click', (e) => {
          e.preventDefault();
          openModal();
        });
      }
    },
    open: openModal,
    close: closeModal
  };
})();
