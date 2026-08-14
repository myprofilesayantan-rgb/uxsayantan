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
      const callout = container.querySelector('#smartbi-callout');

      tl.fromTo([signature, cta], 
        { opacity: 0, y: 20 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.6, 
          stagger: 0.15, 
          ease: 'power2.out',
          onComplete: () => {
            // Animate and reveal fancy AI callout
            if (callout) {
              const productBtn = container.querySelector('#hero-product-btn');
              let autoDissolveTimeout;
              let hoverTimeout;
              let isVisible = false;
              let isHoveringBtn = false;
              let isHoveringCallout = false;

              const showCallout = () => {
                isVisible = true;
                clearTimeout(autoDissolveTimeout);
                clearTimeout(hoverTimeout);
                
                gsap.killTweensOf(callout);
                gsap.fromTo(callout,
                  { opacity: 0, scale: 0.8, y: -15 },
                  { 
                    opacity: 1, 
                    scale: 1, 
                    y: 0, 
                    duration: 0.5, 
                    ease: 'back.out(1.5)',
                    onStart: () => {
                      callout.style.pointerEvents = 'auto';
                    }
                  }
                );
              };

              const hideCallout = (instant = false) => {
                isVisible = false;
                clearTimeout(autoDissolveTimeout);
                
                gsap.killTweensOf(callout);
                gsap.to(callout, {
                  opacity: 0,
                  scale: 0.8,
                  y: -10,
                  duration: instant ? 0.1 : 0.4,
                  ease: 'power2.in',
                  onComplete: () => {
                    callout.style.pointerEvents = 'none';
                  }
                });
              };

              const handleMouseLeave = () => {
                // Short delay to allow moving cursor from button to callout container
                hoverTimeout = setTimeout(() => {
                  if (!isHoveringBtn && !isHoveringCallout) {
                    hideCallout();
                  }
                }, 120);
              };

              // 1. Initial Entrance Animation
              showCallout();

              // 2. Auto-dissolve after 6 seconds of entrance
              autoDissolveTimeout = setTimeout(() => {
                if (!isHoveringBtn && !isHoveringCallout) {
                  hideCallout();
                }
              }, 6000);

              // 3. Scroll Listener - dissolve callout as soon as user starts scrolling
              const handleScroll = () => {
                if (isVisible && window.scrollY > 30) {
                  hideCallout();
                }
              };
              window.addEventListener('scroll', handleScroll, { passive: true });

              // 4. Button Hover Listeners
              if (productBtn) {
                productBtn.addEventListener('mouseenter', () => {
                  isHoveringBtn = true;
                  showCallout();
                });
                productBtn.addEventListener('mouseleave', () => {
                  isHoveringBtn = false;
                  handleMouseLeave();
                });
              }

              // 5. Callout Hover Listeners (keeps callout open when cursor is over the card)
              callout.addEventListener('mouseenter', () => {
                isHoveringCallout = true;
                clearTimeout(hoverTimeout);
              });
              callout.addEventListener('mouseleave', () => {
                isHoveringCallout = false;
                handleMouseLeave();
              });

              // 6. Close button click handler
              const closeBtn = callout.querySelector('.callout-close');
              if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                  e.stopPropagation();
                  hideCallout();
                });
              }
            }

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

      const callout = container.querySelector('#smartbi-callout');
      if (callout) {
        const productBtn = container.querySelector('#hero-product-btn');
        let isHoveringBtn = false;
        let isHoveringCallout = false;
        let hoverTimeout;

        const show = () => {
          clearTimeout(hoverTimeout);
          callout.style.opacity = '1';
          callout.style.pointerEvents = 'auto';
          callout.style.transform = 'translateX(-50%) translateY(0)';
        };

        const hide = () => {
          callout.style.opacity = '0';
          callout.style.pointerEvents = 'none';
          callout.style.transform = 'translateX(-50%) translateY(10px)';
        };

        const checkLeave = () => {
          hoverTimeout = setTimeout(() => {
            if (!isHoveringBtn && !isHoveringCallout) {
              hide();
            }
          }, 120);
        };

        // Initial show and auto-dissolve
        show();
        setTimeout(() => {
          if (!isHoveringBtn && !isHoveringCallout) hide();
        }, 6000);

        // Scroll hide
        window.addEventListener('scroll', () => {
          if (window.scrollY > 30) hide();
        }, { passive: true });

        // Hover handlers
        if (productBtn) {
          productBtn.addEventListener('mouseenter', () => {
            isHoveringBtn = true;
            show();
          });
          productBtn.addEventListener('mouseleave', () => {
            isHoveringBtn = false;
            checkLeave();
          });
        }

        callout.addEventListener('mouseenter', () => {
          isHoveringCallout = true;
          clearTimeout(hoverTimeout);
        });
        callout.addEventListener('mouseleave', () => {
          isHoveringCallout = false;
          checkLeave();
        });

        const closeBtn = callout.querySelector('.callout-close');
        if (closeBtn) {
          closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hide();
          });
        }
      }

      if (typeof onComplete === 'function') {
        onComplete();
      }
    }
  }
};
