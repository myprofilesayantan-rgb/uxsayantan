/**
 * Tracto Component Module
 * Manages behavior, navigation, animations, and Speech Synthesis for the Tracto section.
 */
window.PortfolioTracto = {
  init(container) {
    if (!container) return;

    const tabItems   = container.querySelectorAll('.tracto-tab-item');
    const slides     = container.querySelectorAll('.tracto-slide');
    const track      = container.querySelector('.tracto-slider-track');
    let currentSlide = 0;
    let isLoaded = false;
    let activeTimeline = null;
    let activeTransitionTimeline = null;



    // ── Autoplay Slider Controller ──────────────────────────────────────
    let autoPlayTimer = null;
    const AUTO_PLAY_DELAY = 120000; // 2 minutes (120,000ms) delay

    function startAutoPlay() {
      stopAutoPlay();
      
      autoPlayTimer = setTimeout(() => {
        const nextIdx = (currentSlide + 1) % slides.length;
        goToSlide(nextIdx);
      }, AUTO_PLAY_DELAY);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearTimeout(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    // ── 0. Slick Tab Indicator Animator ──────────────────────────────────
    function updateTabIndicator(index) {
      const activeTab = tabItems[index];
      const indicator = container.querySelector('.tracto-tab-indicator');
      const bar = container.querySelector('.tracto-tab-indicator-bar');
      if (activeTab && indicator && bar) {
        const rect = activeTab.getBoundingClientRect();
        const barRect = bar.getBoundingClientRect();
        const leftOffset = rect.left - barRect.left;
        
        gsap.to(indicator, {
          left: leftOffset,
          width: rect.width,
          duration: 0.45,
          ease: 'power3.out',
          overwrite: 'auto'
        });
      }
    }

    // Update indicator on resize
    window.addEventListener('resize', () => {
      updateTabIndicator(currentSlide);
    }, { passive: true });

    // Initialize position once layout is fully ready
    setTimeout(() => {
      updateTabIndicator(0);
    }, 200);

    // ── 1. Measure & Fix Track Height (to avoid layout jumps) ─────────────
    function fixTrackHeight() {
      if (!track) return;
      
      // 1. Reset track minHeight before measuring
      track.style.minHeight = '0px';

      // 2. Measure active slide height
      const activeSlide = slides[currentSlide];
      if (activeSlide) {
        const h = activeSlide.scrollHeight;
        if (h > 0) {
          track.style.minHeight = h + 'px';
        }
      }

      // 3. Safely refresh ScrollTrigger to update heights in GSAP
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }

    fixTrackHeight();
    window.addEventListener('resize', fixTrackHeight, { passive: true });

    // ── 2.5 Quote Card Mouseover & Hover Animations ─────────────────────
    const notificationCards = container.querySelectorAll('.quote-card');
    notificationCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (!isLoaded) return; // Ignore hovers during initial reveal sequence

        // Visual hover scale and lift
        gsap.to(card, {
          scale: 1.025,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });

      card.addEventListener('mouseleave', () => {
        if (!isLoaded) return; // Ignore during initial reveal sequence

        // Reset visual scale
        gsap.to(card, {
          scale: 1,
          duration: 0.35,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    });

    // ── 3. Slide 1 Notification Animation ────────────────────────────────
    let slide1LoadedState = false;

    function playSlide1Notifications() {
      const cards = container.querySelectorAll('.quote-card');
      
      if (slide1LoadedState) {
        // If already loaded once, just ensure they remain visible and don't reset
        isLoaded = true;
        gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      // Clean up previous timelines
      if (activeTimeline) {
        activeTimeline.kill();
        activeTimeline = null;
      }

      isLoaded = false;

      // Reset card visual state to hidden
      gsap.set(cards, { opacity: 0, y: 35, scale: 0.88 });

      // Play pure visual timeline first
      activeTimeline = gsap.timeline({
        onComplete: () => {
          isLoaded = true;
          slide1LoadedState = true;
        }
      });

      // Animate cards in a natural, conversational staggered sequence:
      // Elders appear first, followed by their Caregiver responses.
      const entryOrder = [0, 2, 1, 4, 3, 6, 5, 8, 7];
      entryOrder.forEach((cardIdx, orderIdx) => {
        const card = cards[cardIdx];
        if (card) {
          activeTimeline.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.45,
            ease: 'back.out(1.4)'
          }, orderIdx === 0 ? 0.1 : `+=0.28`);
        }
      });
    }

    // ── 3.5 Slide 2 Research Stats & SVG Radar Chart animations ──────────
    function playSlide2Research() {
      // 1. Stats entry animation
      const statItems = container.querySelectorAll('.research-widgets-stack .widget-card');
      gsap.killTweensOf(statItems);
      gsap.set(statItems, { opacity: 0, y: 25, scale: 0.95 });
      
      gsap.to(statItems, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.65,
        ease: 'power2.out',
        stagger: 0.15
      });

      // 2. SVG Radar Chart Polygon & Marker animate outwards
      const userLevels = { v0: 0, v1: 0, v2: 0, v3: 0, v4: 0 };
      const careLevels = { v0: 0, v1: 0, v2: 0, v3: 0, v4: 0 };
      
      const CX = 250;
      const CY = 250;
      const R  = 160;
      
      const angles = [
        -Math.PI / 2,
        -Math.PI / 2 + 72 * Math.PI / 180,
        -Math.PI / 2 + 144 * Math.PI / 180,
        -Math.PI / 2 + 216 * Math.PI / 180,
        -Math.PI / 2 + 288 * Math.PI / 180
      ];

      const userPoly = container.querySelector('.radar-poly-user');
      const carePoly = container.querySelector('.radar-poly-care');
      
      const userDots = container.querySelectorAll('.marker-user');
      const careDots = container.querySelectorAll('.marker-care');

      function updatePolygons() {
        // User Profile
        const userPoints = [];
        for (let i = 0; i < 5; i++) {
          const level = userLevels[`v${i}`];
          const d = R * (level / 10);
          const x = CX + d * Math.cos(angles[i]);
          const y = CY + d * Math.sin(angles[i]);
          userPoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
          if (userDots[i]) {
            userDots[i].setAttribute('cx', x.toFixed(1));
            userDots[i].setAttribute('cy', y.toFixed(1));
          }
        }
        if (userPoly) userPoly.setAttribute('points', userPoints.join(' '));

        // Care Ecosystem
        const carePoints = [];
        for (let i = 0; i < 5; i++) {
          const level = careLevels[`v${i}`];
          const d = R * (level / 10);
          const x = CX + d * Math.cos(angles[i]);
          const y = CY + d * Math.sin(angles[i]);
          carePoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
          if (careDots[i]) {
            careDots[i].setAttribute('cx', x.toFixed(1));
            careDots[i].setAttribute('cy', y.toFixed(1));
          }
        }
        if (carePoly) carePoly.setAttribute('points', carePoints.join(' '));
      }

      // Reset targets before animating
      updatePolygons();

      // Kill any previous tweens
      gsap.killTweensOf(userLevels);
      gsap.killTweensOf(careLevels);

      // Animate User Profile
      gsap.to(userLevels, {
        v0: 8.7, v1: 7.8, v2: 5.7, v3: 4.8, v4: 9.6,
        duration: 1.3,
        ease: 'power3.out',
        onUpdate: updatePolygons
      });

      // Animate Care Ecosystem
      gsap.to(careLevels, {
        v0: 5.7, v1: 3.9, v2: 7.4, v3: 9.1, v4: 6.1,
        duration: 1.3,
        ease: 'power3.out'
      });
    }

    // ── 3.8 Slide 3 — Cinematic Video Playlist ───────────────────────────
    const empathyVideo  = document.getElementById('empathy-video');
    const playToggleBtn = document.getElementById('video-play-toggle');

    // ── Build playlist from data-playlist attribute ───────────────────────
    let playlist    = [];
    let playlistIdx = 0;
    let reelPaused  = false;

    if (empathyVideo) {
      const raw = empathyVideo.dataset.playlist || '';
      playlist  = raw.split(',').map(s => s.trim()).filter(Boolean);
    }

    function _syncPlayIcon() {
      if (!playToggleBtn) return;
      const playing = empathyVideo && !empathyVideo.paused;
      playToggleBtn.querySelector('.play-icon').style.display  = playing ? 'none' : '';
      playToggleBtn.querySelector('.pause-icon').style.display = playing ? ''     : 'none';
    }

    // ── Safe: play only after browser says it's ready ────────────────────
    function _playWhenReady(video, onPlaying) {
      // remove any stale listener first
      const handler = () => {
        video.removeEventListener('canplay', handler);
        video.play().then(() => {
          if (onPlaying) onPlaying();
        }).catch(() => {});
      };
      video.addEventListener('canplay', handler);
      // If already ready (readyState >= 3), fire immediately
      if (video.readyState >= 3) handler();
    }

    // ── Load and crossfade to a clip by index ────────────────────────────
    function _loadClip(idx) {
      if (!empathyVideo || playlist.length === 0) return;
      playlistIdx = idx % playlist.length;

      gsap.to(empathyVideo, {
        opacity: 0,
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => {
          empathyVideo.src = playlist[playlistIdx];
          empathyVideo.load();
          _playWhenReady(empathyVideo, () => {
            gsap.to(empathyVideo, { opacity: 1, duration: 0.55, ease: 'power2.out' });
            _syncPlayIcon();
          });
        }
      });
    }

    // ── When a clip ends → advance to next ───────────────────────────────
    if (empathyVideo) {
      empathyVideo.addEventListener('ended', () => {
        if (!reelPaused) _loadClip(playlistIdx + 1);
      });
      empathyVideo.addEventListener('play',  _syncPlayIcon);
      empathyVideo.addEventListener('pause', _syncPlayIcon);
    }

    // ── Play / Pause toggle ───────────────────────────────────────────────
    if (playToggleBtn && empathyVideo) {
      playToggleBtn.addEventListener('click', () => {
        if (empathyVideo.paused) {
          reelPaused = false;
          empathyVideo.play().catch(() => {});
        } else {
          reelPaused = true;
          empathyVideo.pause();
        }
      });
    }

    // ── Slide 3 entry ─────────────────────────────────────────────────────
    function playSlide3Empathy() {
      const frame = container.querySelector('.empathy-cinema-frame');
      const tags  = container.querySelectorAll('.empathy-tag');
      if (!frame) return;

      gsap.killTweensOf([frame, tags]);
      gsap.set(frame, { opacity: 0, y: 30, scale: 0.97 });
      gsap.set(tags,  { opacity: 0, y: 14 });

      const tl = gsap.timeline();

      tl.to(frame, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.85,
        ease: 'power3.out'
      }, 0);

      tl.to(tags, {
        opacity: 1, y: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power2.out'
      }, 0.45);

      // Load first clip and play when ready
      if (empathyVideo && playlist.length > 0) {
        reelPaused  = false;
        playlistIdx = 0;
        gsap.set(empathyVideo, { opacity: 1 });
        empathyVideo.src = playlist[0];
        empathyVideo.load();
        _playWhenReady(empathyVideo, _syncPlayIcon);
      }
    }

    // ── Slide 3 exit ──────────────────────────────────────────────────────
    function pauseEmpathyVideo() {
      reelPaused = true;
      if (empathyVideo && !empathyVideo.paused) empathyVideo.pause();
    }

    // ── Slide 4: Product Solution & Interactive Mobile UX Screens ────────
    const switcherBtns = container.querySelectorAll('.switcher-btn');
    const elderSubBtns = container.querySelectorAll('#elder-sub-selector .sub-sel-btn');
    const caregiverSubBtns = container.querySelectorAll('#caregiver-sub-selector .sub-sel-btn');
    const elderSubSelector = container.querySelector('#elder-sub-selector');
    const caregiverSubSelector = container.querySelector('#caregiver-sub-selector');
    
    const phoneScreenAsset = container.querySelector('#phone-screen-asset');
    
    let activeTab = 'elder'; // 'elder' or 'caregiver'
    let activeElderState = 'home';
    let activeCaregiverState = 'home';

    // All 10 screens mapped directly from `tracto mobileux/`
    const assets = {
      elder: {
        home: 'tracto mobileux/Elder _Home.png',
        med_notify: 'tracto mobileux/Elder- Med Push Notification.png',
        med_list: 'tracto mobileux/Elder _Medlist.png',
        learning: 'tracto mobileux/Elder _Learning Model.png',
        emergency: 'tracto mobileux/Elder- Emergency_Contact.png',
        help: 'tracto mobileux/Elder Help.png'
      },
      caregiver: {
        home: 'tracto mobileux/Caregiver Home.png',
        sos: 'tracto mobileux/Caregiver SOS.png',
        sos_detail: 'tracto mobileux/Caregiver SOS-1.png',
        rescue: 'tracto mobileux/Caregiver Rescue.png'
      }
    };

    function updateScreenDisplay(newSrc) {
      if (!phoneScreenAsset || !newSrc) return;
      gsap.to(phoneScreenAsset, {
        opacity: 0,
        duration: 0.15,
        ease: 'power1.out',
        onComplete: () => {
          phoneScreenAsset.src = newSrc;
          gsap.to(phoneScreenAsset, { opacity: 1, duration: 0.25, ease: 'power1.in' });
        }
      });
    }

    // Switch between Elder App and Caregiver App
    switcherBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-mockup-tab');
        if (tab === activeTab) return;
        
        activeTab = tab;
        
        switcherBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (activeTab === 'caregiver') {
          if (elderSubSelector) elderSubSelector.classList.add('hide-selector');
          if (caregiverSubSelector) caregiverSubSelector.classList.remove('hide-selector');
          
          const screen = assets.caregiver[activeCaregiverState] || assets.caregiver.home;
          updateScreenDisplay(screen);
        } else {
          if (elderSubSelector) elderSubSelector.classList.remove('hide-selector');
          if (caregiverSubSelector) caregiverSubSelector.classList.add('hide-selector');
          
          const screen = assets.elder[activeElderState] || assets.elder.home;
          updateScreenDisplay(screen);
        }
      });
    });

    // Switch elder sub-states
    elderSubBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const state = btn.getAttribute('data-elder-state');
        if (state === activeElderState) return;
        
        activeElderState = state;
        
        elderSubBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const screen = assets.elder[activeElderState] || assets.elder.home;
        updateScreenDisplay(screen);
      });
    });

    // Switch caregiver sub-states
    caregiverSubBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const state = btn.getAttribute('data-caregiver-state');
        if (state === activeCaregiverState) return;
        
        activeCaregiverState = state;
        
        caregiverSubBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const screen = assets.caregiver[activeCaregiverState] || assets.caregiver.home;
        updateScreenDisplay(screen);
      });
    });

    function playSlide4Solution() {
      // Reset states to default
      activeTab = 'elder';
      activeElderState = 'home';
      activeCaregiverState = 'home';
      
      switcherBtns.forEach(b => {
        if (b.getAttribute('data-mockup-tab') === 'elder') b.classList.add('active');
        else b.classList.remove('active');
      });
      
      elderSubBtns.forEach(b => {
        if (b.getAttribute('data-elder-state') === 'home') b.classList.add('active');
        else b.classList.remove('active');
      });

      caregiverSubBtns.forEach(b => {
        if (b.getAttribute('data-caregiver-state') === 'home') b.classList.add('active');
        else b.classList.remove('active');
      });

      if (elderSubSelector) elderSubSelector.classList.remove('hide-selector');
      if (caregiverSubSelector) caregiverSubSelector.classList.add('hide-selector');

      if (phoneScreenAsset) {
        phoneScreenAsset.src = assets.elder.home;
        gsap.set(phoneScreenAsset, { opacity: 1 });
      }

      // Animate left column elements
      const eyebrow = container.querySelector('.solution-eyebrow');
      const headline = container.querySelector('.solution-headline');
      const paragraphs = container.querySelectorAll('.solution-body p');
      const ctas = container.querySelectorAll('.solution-cta-row a');
      const phoneWrapper = container.querySelector('.solution-mockup-panel');

      gsap.killTweensOf([eyebrow, headline, paragraphs, ctas, phoneWrapper]);

      gsap.set([eyebrow, headline, paragraphs, ctas], { opacity: 0, x: -30 });
      gsap.set(phoneWrapper, { opacity: 0, scale: 0.95, y: 20 });

      const tl = gsap.timeline();
      tl.to(eyebrow, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 0.1);
      tl.to(headline, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }, 0.2);
      tl.to(paragraphs, { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out' }, 0.35);
      tl.to(ctas, { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }, 0.6);
      tl.to(phoneWrapper, { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.4);

      // Start scroll animation
      initAutoScroll();
    }

    function pauseSlide4Solution() {
      if (slide4Tween) {
        slide4Tween.kill();
        slide4Tween = null;
      }
      isDragging = false;
      if (phoneViewport) phoneViewport.style.cursor = 'grab';
    }

    function goToSlide(index) {
      if (index === currentSlide || index >= slides.length) return;

      const slideA = slides[currentSlide];
      const slideB = slides[index];
      
      // If leaving Slide 1, clean up its timeline immediately
      if (currentSlide === 0) {
        if (activeTimeline) {
          activeTimeline.kill();
          activeTimeline = null;
        }
      }

      currentSlide = index;

      // Update tab active status
      tabItems.forEach((tab, i) => {
        if (i === index) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });

      // Update moving underline indicator
      updateTabIndicator(index);

      // Kill any running transition
      if (activeTransitionTimeline) {
        activeTransitionTimeline.kill();
      }

      // Measure target slide height and animate track height change
      const targetHeight = slideB.scrollHeight;
      gsap.to(track, {
        minHeight: targetHeight,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: () => {
          if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
          }
        }
      });

      // Hide all other slides except A and B to ensure layout doesn't overlap
      slides.forEach((s, idx) => {
        if (idx !== index && idx !== currentSlide) {
          s.style.visibility = 'hidden';
          gsap.set(s, { opacity: 0, filter: 'blur(10px)' });
        }
      });

      // Set up target slide state
      gsap.set(slideB, {
        opacity: 0,
        filter: 'blur(10px)',
        visibility: 'visible'
      });

      activeTransitionTimeline = gsap.timeline({
        onComplete: () => {
          slides.forEach(s => s.classList.remove('active'));
          slideB.classList.add('active');

          slideA.style.visibility = 'hidden';
          gsap.set(slideA, { opacity: 0, filter: 'blur(10px)' });

          // Slide-specific triggers after cross-fade is done
          if (index === 0) {
            pauseEmpathyVideo();
            playSlide1Notifications();
            pauseSlide4Solution();
          } else if (index === 1) {
            pauseEmpathyVideo();
            playSlide2Research();
            pauseSlide4Solution();
          } else if (index === 2) {
            playSlide3Empathy();
            pauseSlide4Solution();
          } else if (index === 3) {
            pauseEmpathyVideo();
            playSlide4Solution();
          } else {
            pauseEmpathyVideo();
            pauseSlide4Solution();
          }
          startAutoPlay();
          fixTrackHeight();
        }
      });

      // Fade/blur out slide A
      activeTransitionTimeline.to(slideA, {
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.4,
        ease: 'power2.inOut'
      }, 0);

      // Fade/blur in slide B
      activeTransitionTimeline.to(slideB, {
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.5,
        ease: 'power2.out'
      }, 0.05);
    }

    // Step navigation click listeners are managed below inside ScrollTrigger setup

    // ── 4.5 Radar Zoom Modal Controller ────────────────────────────────────
    const zoomBtn = container.querySelector('#radar-zoom-btn');
    const modalOverlay = document.querySelector('#radar-zoom-modal');
    const modalCloseBtn = document.querySelector('#radar-modal-close-btn');

    if (zoomBtn && modalOverlay && modalCloseBtn) {
      let modalTimeline = null;

      function openModal() {
        modalOverlay.style.display = 'flex';
        modalOverlay.classList.add('active');
        modalOverlay.setAttribute('aria-hidden', 'false');
        
        // Disable body scroll when modal is open
        document.body.style.overflow = 'hidden';

        const card = modalOverlay.querySelector('.radar-modal-card');
        const header = modalOverlay.querySelector('.radar-modal-header');
        const close = modalOverlay.querySelector('.radar-modal-close');
        const svg = modalOverlay.querySelector('.modal-svg-wrapper');
        const legend = modalOverlay.querySelector('.modal-legend-container');

        gsap.killTweensOf([modalOverlay, card, header, close, svg, legend]);

        // 3D scale-tilt presets for Apple-style opening bounce
        gsap.set(modalOverlay, { opacity: 0 });
        gsap.set(card, { transformPerspective: 800 });
        gsap.set(card, { opacity: 0, scale: 0.82, y: 70, rotateX: 12 });
        gsap.set([header, svg, legend], { opacity: 0, y: 20 });
        gsap.set(close, { opacity: 0, scale: 0.5 });

        // Synchronized timeline
        modalTimeline = gsap.timeline({
          onComplete: () => {
            playModalRadarAnimation();
          }
        });

        // 1. Fade backdrop overlay
        modalTimeline.to(modalOverlay, {
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out'
        }, 0);

        // 2. Animate card 3D entry bounce
        modalTimeline.to(card, {
          opacity: 1,
          scale: 1,
          y: 0,
          rotateX: 0,
          duration: 0.75,
          ease: 'back.out(1.15)'
        }, 0.05);

        // 3. Stagger modal inner contents
        modalTimeline.to([header, svg, legend], {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out'
        }, 0.25);

        // 4. Pop close circle
        modalTimeline.to(close, {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          ease: 'back.out(1.4)'
        }, 0.35);
      }

      function closeModal() {
        const card = modalOverlay.querySelector('.radar-modal-card');
        
        gsap.killTweensOf([modalOverlay, card]);

        const closeTimeline = gsap.timeline({
          onComplete: () => {
            modalOverlay.classList.remove('active');
            modalOverlay.setAttribute('aria-hidden', 'true');
            modalOverlay.style.display = 'none';
            document.body.style.overflow = '';
          }
        });

        // Slide down card
        closeTimeline.to(card, {
          opacity: 0,
          scale: 0.9,
          y: 40,
          duration: 0.35,
          ease: 'power3.in'
        }, 0);

        // Fade backdrop overlay
        closeTimeline.to(modalOverlay, {
          opacity: 0,
          duration: 0.35,
          ease: 'power2.inOut'
        }, 0.05);
      }

      zoomBtn.addEventListener('click', openModal);
      modalCloseBtn.addEventListener('click', closeModal);

      // Dismiss on overlay backdrop click
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          closeModal();
        }
      });

      // Dismiss on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
          closeModal();
        }
      });

      // Modal Radar Animation logic (cloned from slide 2 chart animation)
      function playModalRadarAnimation() {
        const userLevels = { v0: 0, v1: 0, v2: 0, v3: 0, v4: 0 };
        const careLevels = { v0: 0, v1: 0, v2: 0, v3: 0, v4: 0 };

        const CX = 250;
        const CY = 250;
        const R  = 160;

        const angles = [
          -Math.PI / 2,
          -Math.PI / 2 + 72 * Math.PI / 180,
          -Math.PI / 2 + 144 * Math.PI / 180,
          -Math.PI / 2 + 216 * Math.PI / 180,
          -Math.PI / 2 + 288 * Math.PI / 180
        ];

        const userPoly = modalOverlay.querySelector('.modal-radar-poly-user');
        const carePoly = modalOverlay.querySelector('.modal-radar-poly-care');

        const userDots = modalOverlay.querySelectorAll('.modal-marker-user');
        const careDots = modalOverlay.querySelectorAll('.modal-marker-care');

        function updateModalPolygons() {
          // User Profile
          const userPoints = [];
          for (let i = 0; i < 5; i++) {
            const level = userLevels[`v${i}`];
            const d = R * (level / 10);
            const x = CX + d * Math.cos(angles[i]);
            const y = CY + d * Math.sin(angles[i]);
            userPoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
            if (userDots[i]) {
              userDots[i].setAttribute('cx', x.toFixed(1));
              userDots[i].setAttribute('cy', y.toFixed(1));
            }
          }
          if (userPoly) userPoly.setAttribute('points', userPoints.join(' '));

          // Care Ecosystem
          const carePoints = [];
          for (let i = 0; i < 5; i++) {
            const level = careLevels[`v${i}`];
            const d = R * (level / 10);
            const x = CX + d * Math.cos(angles[i]);
            const y = CY + d * Math.sin(angles[i]);
            carePoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
            if (careDots[i]) {
              careDots[i].setAttribute('cx', x.toFixed(1));
              careDots[i].setAttribute('cy', y.toFixed(1));
            }
          }
          if (carePoly) carePoly.setAttribute('points', carePoints.join(' '));
        }

        // Reset points
        updateModalPolygons();

        // Kill any ongoing tweens on userLevels/careLevels inside modal
        gsap.killTweensOf(userLevels);
        gsap.killTweensOf(careLevels);

        // Animate User levels
        gsap.to(userLevels, {
          v0: 8.7, v1: 7.8, v2: 5.7, v3: 4.8, v4: 9.6,
          duration: 1.2,
          delay: 0.1,
          ease: 'power3.out',
          onUpdate: updateModalPolygons
        });

        // Animate Care levels
        gsap.to(careLevels, {
          v0: 5.7, v1: 3.9, v2: 7.4, v3: 9.1, v4: 6.1,
          duration: 1.2,
          delay: 0.1,
          ease: 'power3.out'
        });
      }
    }

    // ── 5. Standard scroll pinning disabled ──────────────────────────────
    // Pinning has been removed to free the browser vertical scroll.

    // Animation triggers for all devices
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: container,
        start: 'top 70%',
        end: 'bottom 20%',
        onEnter: () => {
          startAutoPlay();
          if (currentSlide === 0) {
            playSlide1Notifications();
          } else if (currentSlide === 1) {
            playSlide2Research();
          } else if (currentSlide === 2) {
            playSlide3Empathy();
          } else if (currentSlide === 3) {
            playSlide4Solution();
          }
        },
        onLeave: () => {
          stopAutoPlay();
          pauseEmpathyVideo();
          pauseSlide4Solution();
        },
        onEnterBack: () => {
          startAutoPlay();
          if (currentSlide === 2) playSlide3Empathy();
          else if (currentSlide === 3) playSlide4Solution();
        },
        onLeaveBack: () => {
          stopAutoPlay();
          pauseEmpathyVideo();
          pauseSlide4Solution();
        }
      });
    } else {
      // Fallback if ScrollTrigger is missing
      startAutoPlay();
      if (currentSlide === 0) {
        playSlide1Notifications();
      } else if (currentSlide === 1) {
        playSlide2Research();
      } else if (currentSlide === 2) {
        playSlide3Empathy();
      } else if (currentSlide === 3) {
        playSlide4Solution();
      }
    }

    tabItems.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        stopAutoPlay();
        goToSlide(index);
        
        // Smoothly scroll the container to align with viewport top
        const rect = container.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetScroll = rect.top + scrollTop;

        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      });
    });

    // Pause autoplay on mouse hover over slider/nav to let user read
    const sliderViewport = container.querySelector('.tracto-slider-viewport');
    if (sliderViewport) {
      sliderViewport.addEventListener('mouseenter', stopAutoPlay, { passive: true });
      sliderViewport.addEventListener('mouseleave', () => {
        // Only resume if not speaking
        if (isMuted || typeof window.speechSynthesis === 'undefined' || !window.speechSynthesis.speaking) {
          startAutoPlay();
        }
      }, { passive: true });
    }
    const tabNav = container.querySelector('.tracto-tab-nav');
    if (tabNav) {
      tabNav.addEventListener('mouseenter', stopAutoPlay, { passive: true });
      tabNav.addEventListener('mouseleave', () => {
        if (isMuted || typeof window.speechSynthesis === 'undefined' || !window.speechSynthesis.speaking) {
          startAutoPlay();
        }
      }, { passive: true });
    }
  }
};
