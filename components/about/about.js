/**
 * About Section Interaction Module
 * Controls the collapsible white About panel, header styling state swaps,
 * responsive height updates, and scroll-to-work anchors.
 */

window.PortfolioAbout = {
  isOpen: false,
  container: null,
  aboutLink: null,
  workLink: null,

  init(container) {
    if (!container) return;
    this.container = container;
    
    // Core Navigation Selectors
    this.aboutLink = document.querySelector('.header-link[href="#about"]');
    this.workLink = document.querySelector('.header-link[href="#work"]');

    if (this.aboutLink) {
      this.aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    }

    if (this.workLink) {
      this.workLink.addEventListener('click', (e) => {
        // Smooth close and anchor scroll on Work link click
        if (this.isOpen) {
          e.preventDefault();
          this.close(() => {
            const workSection = document.getElementById('section-tracto');
            if (workSection) {
              workSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          });
        }
      });
    }

    // Handle responsive layout changes when open
    window.addEventListener('resize', () => {
      if (this.isOpen && this.container) {
        this.container.style.height = 'auto';
      }
    });
  },

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  },

  open() {
    if (this.isOpen || !this.container) return;
    this.isOpen = true;

    // Add state class to body for theme swap (white navigation backdrop)
    document.body.classList.add('about-open');

    // ── Seamless Height Animation ──────────────────────────────────────────
    // 1. Calculate actual scroll height
    const scrollHeight = this.container.scrollHeight;
    
    // 2. Set height in pixels to start transition
    this.container.style.height = `${scrollHeight}px`;

    // 3. Make it fully responsive after animation ends
    const onTransitionEnd = () => {
      if (this.isOpen) {
        this.container.style.height = 'auto';
      }
      this.container.removeEventListener('transitionend', onTransitionEnd);
    };
    this.container.addEventListener('transitionend', onTransitionEnd);
  },

  close(callback) {
    if (!this.isOpen || !this.container) {
      if (callback) callback();
      return;
    }
    this.isOpen = false;

    // ── Seamless Height Collapse ─────────────────────────────────────────
    // 1. Convert height back to absolute pixels from 'auto'
    const scrollHeight = this.container.scrollHeight;
    this.container.style.height = `${scrollHeight}px`;
    
    // 2. Force reflow to commit pixel height
    this.container.offsetHeight;

    // 3. Set height to 0 to trigger transition collapse
    this.container.style.height = '0px';

    // 4. Fire callbacks on complete
    const onTransitionEnd = () => {
      if (!this.isOpen) {
        // Remove state class from body ONLY after collapse animation completes
        document.body.classList.remove('about-open');
        if (callback) callback();
      }
      this.container.removeEventListener('transitionend', onTransitionEnd);
    };
    this.container.addEventListener('transitionend', onTransitionEnd);
  }
};
