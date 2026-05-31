/**
 * Apple-Style Custom Context Menu Component
 * Manages right-click events globally and displays a macOS style frosted glass menu.
 */
window.PortfolioContextMenu = {
  init() {
    // ── 1. Create Menu DOM Elements Dynamically ─────────────────────────
    let menu = document.getElementById('custom-context-menu');
    if (!menu) {
      menu = document.createElement('div');
      menu.id = 'custom-context-menu';
      menu.className = 'apple-context-menu';
      menu.innerHTML = `
        <ul class="context-menu-list">
          <li class="context-menu-item" id="menu-download-resume">
            <span class="menu-icon">📄</span>
            <span class="menu-label">Download Resume</span>
          </li>
          <li class="context-menu-item" id="menu-download-case-study">
            <span class="menu-icon">📁</span>
            <span class="menu-label">Download Case Study</span>
          </li>
          <li class="context-menu-divider"></li>
          <li class="context-menu-item" id="menu-send-email">
            <span class="menu-icon">✉️</span>
            <span class="menu-label">Send Email</span>
          </li>
        </ul>
      `;
      document.body.appendChild(menu);
    }

    const closeMenu = () => {
      if (menu.style.display === 'block') {
        if (typeof gsap !== 'undefined') {
          gsap.to(menu, {
            opacity: 0,
            scale: 0.95,
            duration: 0.15,
            ease: 'power2.in',
            onComplete: () => {
              menu.style.display = 'none';
            }
          });
        } else {
          menu.style.display = 'none';
        }
      }
    };

    // ── 2. Intercept Global Right-Click ─────────────────────────────────
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();

      // Show menu briefly hidden to measure dimensions
      menu.style.display = 'block';
      menu.style.opacity = '0';
      menu.style.scale = '0.95';

      const menuWidth = menu.offsetWidth;
      const menuHeight = menu.offsetHeight;

      // Adjust coordinate positioning for scroll offsets and screen edges
      let x = e.pageX;
      let y = e.pageY;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      // Prevent horizontal overflow
      if (x + menuWidth > viewportWidth + scrollX) {
        x = viewportWidth + scrollX - menuWidth - 8;
      }
      // Prevent vertical overflow
      if (y + menuHeight > viewportHeight + scrollY) {
        y = viewportHeight + scrollY - menuHeight - 8;
      }

      // Safeguard values
      if (x < 0) x = 0;
      if (y < 0) y = 0;

      menu.style.left = `${x}px`;
      menu.style.top = `${y}px`;

      // GSAP animate reveal
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(menu, 
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.2, ease: 'power3.out' }
        );
      } else {
        menu.style.opacity = '1';
        menu.style.scale = '1';
      }
    });

    // ── 3. Bind Menu Actions ────────────────────────────────────────────
    const resumeBtn = document.getElementById('menu-download-resume');
    const caseStudyBtn = document.getElementById('menu-download-case-study');
    const emailBtn = document.getElementById('menu-send-email');

    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = 'work/SayantanGhosh_CV_Updated.pdf';
        link.download = 'SayantanGhosh_CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        closeMenu();
      });
    }

    if (caseStudyBtn) {
      caseStudyBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = 'images/sayantan_pic.png'; // Mock download file path, user can replace with actual study doc
        link.download = 'Healthcare_Case_Study.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        closeMenu();
      });
    }

    if (emailBtn) {
      emailBtn.addEventListener('click', () => {
        window.location.href = 'mailto:myprofile.sayantan@gmail.com';
        closeMenu();
      });
    }

    // ── 4. Dismiss Listeners ───────────────────────────────────────────
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('scroll', () => {
      closeMenu();
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    });
  }
};
