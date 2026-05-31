/**
 * Hidden Friction Component Module
 * Smooth fade-and-blur cross-fade slider with no layout jerk.
 *
 * Key design: ALL slides are always position:absolute so the parent height
 * never jumps. The track height is measured once on init and fixed in JS.
 */
window.PortfolioFriction = {
  init(container) {
    if (!container) return;

    if (typeof gsap === "undefined") {
      console.warn("GSAP not loaded — skipping slider animations.");
      return;
    }

    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    const track   = container.querySelector(".friction-slider-track");
    const dots    = container.querySelectorAll(".teapot-pagination .pagination-dot");
    const slides  = container.querySelectorAll(".friction-slide");
    let currentSlide = 0;
    let transitioning = false;

    // ── 1. Measure & fix track height (prevents layout jerk) ──────────────
    // Temporarily make every slide visible, measure its full height, then hide.
    function fixTrackHeight() {
      let maxH = 0;

      slides.forEach(slide => {
        // Briefly expose to get natural height
        slide.style.visibility  = "visible";
        slide.style.opacity     = "1";
        slide.style.position    = "absolute";

        const h = slide.scrollHeight;
        if (h > maxH) maxH = h;

        // Restore
        if (!slide.classList.contains("active")) {
          slide.style.visibility = "hidden";
          slide.style.opacity    = "0";
        }
      });

      if (track && maxH > 0) {
        track.style.minHeight = maxH + "px";
      }
    }

    // Run once on load
    fixTrackHeight();
    // Re-run on resize (handles font-size fluid changes)
    window.addEventListener("resize", fixTrackHeight, { passive: true });

    // ── 2. Entrance animation for Slide 1 ─────────────────────────────────
    const slide1 = container.querySelector('.friction-slide[data-slide-index="0"]');
    if (slide1) {
      const teapotContainers = slide1.querySelectorAll(".teapot-container");
      const caption          = slide1.querySelector(".teapot-caption");

      if (teapotContainers.length > 0) {
        gsap.fromTo(
          teapotContainers,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (caption) {
        const htmlContent = caption.innerHTML;
        const lines = htmlContent.split(/<br\s*\/?>/i);

        if (lines.length >= 2) {
          caption.innerHTML = `
            <div class="caption-line" style="display:block;overflow:hidden;margin-bottom:6px;padding:2px 0;">
              <span class="line-content" style="display:inline-block;transform:translate3d(0,110%,0);opacity:0;filter:blur(5px);will-change:transform,opacity,filter;">
                ${lines[0]}
              </span>
            </div>
            <div class="caption-line" style="display:block;overflow:hidden;padding:2px 0;">
              <span class="line-content" style="display:inline-block;transform:translate3d(0,110%,0);opacity:0;filter:blur(5px);will-change:transform,opacity,filter;">
                ${lines[1]}
              </span>
            </div>
          `;

          const lineContents = caption.querySelectorAll(".line-content");
          gsap.to(lineContents, {
            y: "0%",
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.4,
            stagger: 0.3,
            ease: "power4.out",
            scrollTrigger: {
              trigger: container,
              start: "top 80%",
              toggleActions: "play none none none",
            },
            onComplete: () => {
              caption.innerHTML = htmlContent;
              gsap.set(caption, { opacity: 1, filter: "none" });
            },
          });
        }
      }
    }

    // ── 3. Dots entrance ──────────────────────────────────────────────────
    if (dots.length > 0) {
      gsap.fromTo(
        dots,
        { opacity: 0, y: 10, scale: 0.6 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.8)",
          delay: 0.6,
          scrollTrigger: {
            trigger: container,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // ── 4. Autoplay timer ─────────────────────────────────────────────────
    let autoPlayTimer;
    const AUTO_PLAY_DELAY = 7500;

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setTimeout(() => {
        goToSlide((currentSlide + 1) % slides.length);
      }, AUTO_PLAY_DELAY);
    }

    function stopAutoPlay() {
      clearTimeout(autoPlayTimer);
    }

    // ── 5. Standard mobile/fallback triggers (Autoplay everywhere) ────────
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.create({
        trigger: container,
        start: "top 90%",
        end: "bottom 10%",
        onEnter: () => startAutoPlay(),
        onLeave: () => stopAutoPlay(),
        onEnterBack: () => startAutoPlay(),
        onLeaveBack: () => stopAutoPlay(),
      });
    } else {
      startAutoPlay();
    }

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        stopAutoPlay();
        goToSlide(index);
      });
    });

    // ── 6. goToSlide — pure opacity+blur cross-fade, NO position toggling ─
    function goToSlide(index) {
      if (index === currentSlide || index >= slides.length || transitioning) return;
      transitioning = true;

      const slideA = slides[currentSlide];
      const slideB = slides[index];
      currentSlide = index;

      // Update dots
      dots.forEach((d, i) =>
        i === index ? d.classList.add("active") : d.classList.remove("active")
      );

      // Prepare incoming slide (already absolute, just hidden)
      gsap.set(slideB, {
        opacity: 0,
        filter: "blur(14px)",
        visibility: "visible",
      });

      const teapotsB = slideB.querySelectorAll(".teapot-container");
      const captionB  = slideB.querySelector(".teapot-caption");

      // Slight "lift in" starting offset
      if (teapotsB.length > 0) gsap.set(teapotsB, { y: 18, scale: 0.97 });
      if (captionB)             gsap.set(captionB,  { y: 10 });

      const tl = gsap.timeline({
        onComplete: () => {
          // Update classes — no position change needed
          slides.forEach(s => s.classList.remove("active"));
          slideB.classList.add("active");

          slideA.style.visibility = "hidden";
          gsap.set(slideA, { opacity: 0, filter: "blur(14px)" });

          transitioning = false;
          startAutoPlay();
        },
      });

      // Out: blur & fade slide A
      tl.to(
        slideA,
        { opacity: 0, filter: "blur(14px)", duration: 0.6, ease: "power2.inOut" },
        0
      );

      // In: focus & fade slide B
      tl.to(
        slideB,
        { opacity: 1, filter: "blur(0px)", duration: 0.75, ease: "power2.out" },
        0.1
      );

      // Elements float up slightly
      if (teapotsB.length > 0) {
        tl.to(
          teapotsB,
          { y: 0, scale: 1, duration: 0.75, stagger: 0.1, ease: "power2.out" },
          0.1
        );
      }
      if (captionB) {
        tl.to(captionB, { y: 0, duration: 0.75, ease: "power2.out" }, 0.2);
      }
    }
  },
};
