/**
 * Scrolling Marquee Module
 * Handles infinite, seamless horizontal text scroll from left to right.
 * Responsive sizing automatically updates on screen resize to maintain perfect alignment.
 * Exposed globally to support local file:// protocols.
 */

window.PortfolioMarquee = {
  init(container) {
    if (!container) return;

    const track = container.querySelector('.marquee-track');
    const firstItem = container.querySelector('.marquee-item');
    if (!track || !firstItem) return;

    let tween;
    let animationFrameId;

    function setupAnimation() {
      // Clean up any existing animations on this track to prevent duplicates/leaks
      if (tween) tween.kill();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      // Measure current text item width (including right padding spacing)
      const itemWidth = firstItem.offsetWidth;
      
      // Retrieve the fluid side padding dynamically to align text with desktop grid bounds on load
      const style = getComputedStyle(document.documentElement);
      const sidePadding = parseFloat(style.getPropertyValue('--side-padding-fluid')) || 0;

      // Calculate start and end offsets for right-to-left scrolling
      const startX = -itemWidth + sidePadding;
      const endX = -2 * itemWidth + sidePadding;

      if (typeof gsap !== 'undefined') {
        // Register ScrollTrigger plugin if available
        if (typeof ScrollTrigger !== 'undefined') {
          gsap.registerPlugin(ScrollTrigger);
        }

        // Set initial position statically on load so it's readable from 1st word
        gsap.set(track, { x: startX });

        // Smoothly fade in the wrapper only when scrolled into view
        const wrapper = container.querySelector('.marquee-wrapper') || container;
        gsap.fromTo(wrapper,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: container,
              start: "top 95%",
              toggleActions: "play none none none"
            }
          }
        );

        tween = gsap.to(track, {
          x: endX,
          ease: 'none',
          duration: 32,
          repeat: -1,
          delay: 1.5, // 1.5s delay before scrolling starts to let user read
          scrollTrigger: {
            trigger: container,
            start: 'top 95%', // Activates when the top of the marquee section enters 95% viewport height
            toggleActions: 'play none none none',
            once: true // Animate once
          }
        });
      } else {
        // Fade in wrapper on load for fallback path
        const wrapper = container.querySelector('.marquee-wrapper');
        if (wrapper) wrapper.style.opacity = '1';

        // Position statically on load
        track.style.transform = `translate3d(${startX}px, 0, 0)`;

        // RequestAnimationFrame fallback scroll with IntersectionObserver delay
        if (typeof IntersectionObserver !== 'undefined') {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                // Wait 1.5s for reader to read, then start scrolling loop
                setTimeout(() => {
                  let currentX = startX;
                  const speed = 0.85;
                  
                  function step() {
                    currentX -= speed;
                    if (currentX <= endX) {
                      currentX = startX;
                    }
                    track.style.transform = `translate3d(${currentX}px, 0, 0)`;
                    animationFrameId = requestAnimationFrame(step);
                  }
                  animationFrameId = requestAnimationFrame(step);
                }, 1500);

                observer.unobserve(container); // Trigger once
              }
            });
          }, { threshold: 0.1 });
          
          observer.observe(container);
        } else {
          // Absolute fallback if IntersectionObserver is missing
          let currentX = startX;
          const speed = 0.85;
          function step() {
            currentX -= speed;
            if (currentX <= endX) {
              currentX = startX;
            }
            track.style.transform = `translate3d(${currentX}px, 0, 0)`;
            animationFrameId = requestAnimationFrame(step);
          }
          animationFrameId = requestAnimationFrame(step);
        }
      }
    }

    // Run initial setup
    setupAnimation();

    // Listen to screen resize to dynamically adjust pixel positions and ratios
    window.addEventListener('resize', () => {
      clearTimeout(window.PortfolioMarquee._resizeTimeout);
      window.PortfolioMarquee._resizeTimeout = setTimeout(setupAnimation, 200);
    });
  }
};
