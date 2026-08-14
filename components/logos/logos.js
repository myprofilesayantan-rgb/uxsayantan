/**
 * Logos Module
 * Handles entry animations for credibility logos and scroll indicator.
 * Exposed globally to support local file:// protocols.
 */

window.PortfolioLogos = {
  init(container) {
    if (!container) return;

    const groups = container.querySelectorAll('.logo-group');
    const scrollIcon = container.querySelector('.scroll-indicator');

    if (typeof gsap !== 'undefined') {
      // Stagger fade-in for logo groups immediately on init (chained to hero timeline end)
      gsap.fromTo(groups, 
        { opacity: 0, y: 25 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: 'power2.out', 
          stagger: 0.15 // Sequential stagger from left to right
        }
      );

      if (scrollIcon) {
        gsap.fromTo(scrollIcon, 
          { opacity: 0 }, 
          { 
            opacity: 1, 
            duration: 0.8,
            delay: 0.4, // Slight delay after logo stagger begins
            ease: 'power2.out'
          }
        );
      }
    } else {
      // Fallback if GSAP is not loaded
      groups.forEach(group => {
        group.style.opacity = '1';
      });
      if (scrollIcon) scrollIcon.style.opacity = '1';
    }
  }
};
