/**
 * Custom Creative Cursor Component — Antigravity Gravity Well
 * Inspired by Google Antigravity background physics.
 * Replaces trailing solid divs with a high-performance, full-screen canvas
 * particle attraction system. Particles swirl clockwise in a beautiful,
 * organic halo around the mouse cursor, leaving the immediate cursor vicinity
 * clear for standard precision click UX.
 */
window.PortfolioCursor = {
  init() {
    // Avoid running on touch devices to ensure standard touch scroll behavior
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return;
    }

    // Create the full-screen canvas layer
    const canvas = document.createElement('canvas');
    canvas.id = 'portfolio-particle-cursor-canvas';
    Object.assign(canvas.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '1', // Sits behind interactive text/content but above background lines
      opacity: '0.65',
      display: 'block'
    });
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const PARTICLE_COUNT = 220; // Perfect balance between visual density and peak rendering speed
    
    // Mouse state & gravity well variables
    const mouse = {
      x: -1000,
      y: -1000,
      active: false,
      targetRadius: 65,  // Radius of the orbital halo ring
      maxDist: 260,       // Distance at which particles feel the gravitational pull
      hovering: false
    };

    // Track window resize to ensure full-bleed canvas
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    // Track mouse coordinates
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });

    document.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    // Individual physics-enabled particle definition
    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        // Distribute randomly across full viewport
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        
        // Setup initial slow background drift velocity
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.35 + 0.1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.size = Math.random() * 1.6 + 0.8;    // Subtle star dust: 0.8px to 2.4px
        this.alpha = Math.random() * 0.5 + 0.25;  // Semi-transparent alphas
        this.colorType = Math.random() > 0.35 ? 'white' : 'blue'; // Multi-tone particles
      }

      update() {
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.maxDist) {
            // Stronger pull close to mouse, fading at the boundary
            const force = (mouse.maxDist - dist) / mouse.maxDist;
            
            // 1. Orbital shell attraction (pulls towards targetRadius, repels if inside it)
            const shellDist = dist - mouse.targetRadius;
            const attractionStrength = 0.05 * force;
            
            this.vx += (dx / dist) * shellDist * attractionStrength;
            this.vy += (dy / dist) * shellDist * attractionStrength;
            
            // 2. Swirling / Clockwise orbit force (tangent velocity vector)
            const swirlStrength = (mouse.hovering ? 0.07 : 0.035) * force;
            this.vx += (-dy / dist) * swirlStrength;
            this.vy += (dx / dist) * swirlStrength;
            
            // 3. Stabilization dampening under gravity
            this.vx *= 0.935;
            this.vy *= 0.935;
          } else {
            // Apply gentle drag outside mouse gravity field
            this.vx *= 0.98;
            this.vy *= 0.98;
            
            // Add tiny random walks to floating state to feel alive
            this.vx += (Math.random() - 0.5) * 0.02;
            this.vy += (Math.random() - 0.5) * 0.02;

            // Cap the drifting speed
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            const maxSpeed = 0.55;
            if (speed > maxSpeed) {
              this.vx = (this.vx / speed) * maxSpeed;
              this.vy = (this.vy / speed) * maxSpeed;
            }
          }
        } else {
          // Standard float when mouse is off-screen
          this.vx *= 0.98;
          this.vy *= 0.98;
          this.vx += (Math.random() - 0.5) * 0.015;
          this.vy += (Math.random() - 0.5) * 0.015;

          const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          const maxSpeed = 0.55;
          if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
          }
        }

        // Apply position update
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        let fillStyle;
        if (mouse.hovering) {
          // Dynamic color highlights on interactive element hovering
          if (this.colorType === 'white') {
            fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
          } else {
            fillStyle = `rgba(90, 164, 249, ${this.alpha + 0.25})`; // Primary blue glow highlight
          }
        } else {
          // Standard soft floating stardust
          fillStyle = `rgba(255, 255, 255, ${this.alpha * 0.6})`;
        }
        
        ctx.fillStyle = fillStyle;
        ctx.fill();
      }
    }

    // Initialize particle array
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    // Expand the gravity circle on interactive hover to provide rich micro-feedback
    document.body.addEventListener('mouseover', (e) => {
      const interactive = e.target.closest('a, button, .logo-item, [role="button"], .tracto-tab-item');
      if (interactive) {
        mouse.hovering = true;
        if (typeof gsap !== 'undefined') {
          gsap.to(mouse, {
            targetRadius: 105,
            maxDist: 330,
            duration: 0.5,
            ease: 'power2.out'
          });
        } else {
          mouse.targetRadius = 105;
          mouse.maxDist = 330;
        }
      }
    });

    document.body.addEventListener('mouseout', (e) => {
      const interactive = e.target.closest('a, button, .logo-item, [role="button"], .tracto-tab-item');
      if (interactive) {
        const related = e.relatedTarget;
        if (related && related.closest('a, button, .logo-item, [role="button"], .tracto-tab-item') === interactive) {
          return;
        }
        mouse.hovering = false;
        if (typeof gsap !== 'undefined') {
          gsap.to(mouse, {
            targetRadius: 65,
            maxDist: 260,
            duration: 0.5,
            ease: 'power2.out'
          });
        } else {
          mouse.targetRadius = 65;
          mouse.maxDist = 260;
        }
      }
    });

    // High-performance hardware accelerated render loop
    function renderLoop() {
      ctx.clearRect(0, 0, width, height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      requestAnimationFrame(renderLoop);
    }

    // Initiate loop
    renderLoop();
  }
};
