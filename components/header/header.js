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
    const phone = container.querySelector('.header-phone');
    
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

      // 3. Reveal phone from the right
      if (phone) {
        tl.fromTo(phone,
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
      if (phone) phone.style.opacity = '1';
      links.forEach(link => {
        link.style.opacity = '1';
      });
    }
  }
};
