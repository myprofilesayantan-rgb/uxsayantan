/**
 * Hero Module
 * Handles entry animations for the hero elements.
 * Exposed globally to support local file:// protocols.
 */

window.PortfolioHero = {
  init(container, onComplete) {
    if (!container) return;

    const avatar = container.querySelector('.hero-avatar');
    const heading = container.querySelector('.hero-heading');
    const signature = container.querySelector('.hero-signature-box');
    const cta = container.querySelector('.hero-cta-box');

    if (typeof gsap !== 'undefined' && heading) {
      const text = heading.textContent.trim();
      heading.innerHTML = '<span class="hero-text"></span><span class="hero-cursor">|</span>';
      const textSpan = heading.querySelector('.hero-text');
      const cursorSpan = heading.querySelector('.hero-cursor');

      // Blink the cursor continuously
      gsap.to(cursorSpan, {
        opacity: 0,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
        duration: 0.4
      });

      // Create a coordinated entrance timeline
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(avatar, 
        { opacity: 0, scale: 0.85 }, 
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.2)' }
      );

      // Make heading container visible with blinking cursor
      tl.fromTo(heading,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.4' // Overlap with avatar animation
      );

      // Typewriter character typing animation
      const textObj = { charIndex: 0 };
      tl.to(textObj, {
        charIndex: text.length,
        duration: 2.2, // Time taken to type the full sentence
        ease: 'none',
        onUpdate: () => {
          textSpan.textContent = text.substring(0, Math.floor(textObj.charIndex));
        },
        onComplete: () => {
          cursorSpan.style.display = 'none'; // Clean up cursor
        }
      });

      // Fade in signature and CTA button after typing is complete
      tl.fromTo([signature, cta], 
        { opacity: 0, y: 20 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.15, 
          ease: 'power2.out',
          onComplete: () => {
            if (typeof onComplete === 'function') {
              onComplete();
            }
          }
        }
      );

    } else {
      // Fallback if GSAP is missing
      if (avatar) avatar.style.opacity = '1';
      if (heading) heading.style.opacity = '1';
      if (signature) signature.style.opacity = '1';
      if (cta) cta.style.opacity = '1';
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }
  }
};
