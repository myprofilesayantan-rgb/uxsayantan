/**
 * Header Module
 * Governs navigation interaction and entry animations.
 * Exposed globally to support local file:// protocols.
 */

window.PortfolioHeader = {
  init(container) {
    if (!container) return;
    const logo = container.querySelector('.header-logo');
    const links = container.querySelectorAll('.header-link');
    const actions = container.querySelector('.header-actions');
    
    // Theme Toggle Logic
    const toggleBtn = container.querySelector('#theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        
        // Add a nice rotation pop micro-interaction on the active SVG icon
        const activeIcon = document.querySelector('html.light-mode') 
          ? toggleBtn.querySelector('.sun-icon') 
          : toggleBtn.querySelector('.moon-icon');
          
        if (typeof gsap !== 'undefined' && activeIcon) {
          gsap.fromTo(activeIcon,
            { rotate: -45, scale: 0.7 },
            { rotate: 0, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }
          );
        }
      });
    }

    // Scroll-revealed navigation CTA button logic
    const navCta = container.querySelector('.header-nav-cta');
    if (navCta) {
      // Toggle visibility based on scroll position
      const toggleNavCtaVisibility = () => {
        if (window.scrollY > 150) {
          navCta.classList.add('visible');
        } else {
          navCta.classList.remove('visible');
        }
      };

      window.addEventListener('scroll', toggleNavCtaVisibility);
      // Run once on load to catch initial page scroll states
      toggleNavCtaVisibility();
    }

    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline();
      
      // 1. Reveal logo from the left
      if (logo) {
        tl.fromTo(logo, 
          { 
            opacity: 0, 
            x: -20 
          }, 
          { 
            opacity: 1, 
            x: 0, 
            duration: 0.8, 
            ease: 'power2.out',
            delay: 0.1
          }
        );
      }
      
      // 2. Stagger middle links from the top
      if (links.length > 0) {
        tl.fromTo(links, 
          { 
            opacity: 0, 
            y: -15 
          }, 
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.6, 
            stagger: 0.1, 
            ease: 'power2.out'
          },
          "-=0.5" // Overlay stagger with logo reveal
        );
      }

      // 3. Reveal actions (toggle + phone) from the right
      if (actions) {
        tl.fromTo(actions,
          {
            opacity: 0,
            x: 20
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power2.out'
          },
          "-=0.5" // Overlay stagger with links reveal
        );
      }
    } else {
      // Fallback if GSAP is not loaded
      if (logo) logo.style.opacity = '1';
      if (actions) actions.style.opacity = '1';
      links.forEach(link => {
        link.style.opacity = '1';
      });
    }
  }
};
