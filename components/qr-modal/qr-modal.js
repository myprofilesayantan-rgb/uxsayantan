/**
 * QR Modal Interaction and Generation
 * Handles modal toggling, QR code rendering, and periodic attention-grabbing AI tooltip popups
 */

const QRModal = {
  init() {
    const modalOverlay = document.getElementById('qr-modal');
    const triggerBtn = document.getElementById('floating-ai-btn');
    const closeBtn = document.getElementById('qr-close-btn');
    const qrContainer = document.getElementById('qr-code-container');
    const tooltipBubble = document.getElementById('ai-tooltip-bubble');
    let isQrGenerated = false;
    let tooltipTimer = null;
    let autoHideTimeout = null;
    let isHovering = false;

    if (!modalOverlay || !triggerBtn || !closeBtn || !qrContainer) return;

    function openModal(e) {
      if (e) e.preventDefault();
      forceHideTooltip();
      modalOverlay.classList.add('active');
      
      // Generate QR only on first open to save resources
      if (!isQrGenerated && window.QRCodeStyling) {
        const qrCode = new QRCodeStyling({
          width: 240,
          height: 240,
          data: "https://myprofilesayantan-rgb.github.io/mobile-chat/",
          image: "images/sayantan_pic.png",
          margin: 0,
          dotsOptions: {
            color: "#1a1a1a",
            type: "rounded"
          },
          imageOptions: {
            hideBackgroundDots: true,
            imageSize: 0.28,
            margin: 4
          },
          cornersSquareOptions: {
            color: "#1a1a1a",
            type: "extra-rounded"
          },
          cornersDotOptions: {
            color: "#1a1a1a",
            type: "dot"
          },
          backgroundOptions: {
            color: "#ffffff",
          }
        });
        qrCode.append(qrContainer);
        isQrGenerated = true;
      }
    }

    function closeModal() {
      modalOverlay.classList.remove('active');
    }

    function clearHideTimeout() {
      if (autoHideTimeout) {
        clearTimeout(autoHideTimeout);
        autoHideTimeout = null;
      }
    }

    // Periodic Tooltip Attention Logic
    function showTooltip(duration = 6000) {
      if (!tooltipBubble || modalOverlay.classList.contains('active')) return;
      clearHideTimeout();
      tooltipBubble.classList.add('visible');
      
      // Auto hide after duration if user is not hovering
      if (!isHovering) {
        autoHideTimeout = setTimeout(() => {
          if (!isHovering) {
            hideTooltip();
          }
        }, duration);
      }
    }

    function hideTooltip() {
      clearHideTimeout();
      if (tooltipBubble && !isHovering) {
        tooltipBubble.classList.remove('visible');
      }
    }

    function forceHideTooltip() {
      clearHideTimeout();
      isHovering = false;
      if (tooltipBubble) {
        tooltipBubble.classList.remove('visible');
      }
    }

    // Initial pop 2 seconds after page load, then cycle every 14 seconds
    setTimeout(() => {
      showTooltip(6000);
      tooltipTimer = setInterval(() => {
        showTooltip(6000);
      }, 14000);
    }, 2000);

    triggerBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    // Hover handling for both Button and Tooltip Bubble
    const interactiveElements = [triggerBtn, tooltipBubble].filter(Boolean);

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        isHovering = true;
        clearHideTimeout();
        if (!modalOverlay.classList.contains('active')) {
          tooltipBubble.classList.add('visible');
        }
      });

      el.addEventListener('mouseleave', (e) => {
        const related = e.relatedTarget;
        if (related && interactiveElements.some(item => item === related || item.contains(related))) {
          return; // Still hovering within button/tooltip group
        }
        isHovering = false;
        // Graceful delay before hiding so reading isn't interrupted abruptly
        autoHideTimeout = setTimeout(() => {
          if (!isHovering) {
            tooltipBubble.classList.remove('visible');
          }
        }, 1200);
      });
    });

    if (tooltipBubble) {
      tooltipBubble.addEventListener('click', (e) => {
        forceHideTooltip();
        openModal(e);
      });
    }

    // Close on outside click
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
      }
    });
  }
};
