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

    if (!modalOverlay || !triggerBtn || !closeBtn || !qrContainer) return;

    function openModal(e) {
      if (e) e.preventDefault();
      hideTooltip();
      modalOverlay.classList.add('active');
      
      // Generate QR only on first open to save resources
      if (!isQrGenerated && window.QRCodeStyling) {
        const qrCode = new QRCodeStyling({
          width: 240,
          height: 240,
          data: "https://myprofilesayantan-rgb.github.io/mobile-chat/",
          margin: 0,
          dotsOptions: {
            color: "#1a1a1a",
            type: "rounded"
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

    // Periodic Tooltip Attention Logic
    function showTooltip() {
      if (!tooltipBubble || modalOverlay.classList.contains('active')) return;
      tooltipBubble.classList.add('visible');
      
      // Auto hide after 4.5 seconds
      setTimeout(() => {
        hideTooltip();
      }, 4500);
    }

    function hideTooltip() {
      if (tooltipBubble) {
        tooltipBubble.classList.remove('visible');
      }
    }

    // Initial pop 2 seconds after page load, then cycle every 12 seconds
    setTimeout(() => {
      showTooltip();
      tooltipTimer = setInterval(showTooltip, 12000);
    }, 2000);

    triggerBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    // Show tooltip immediately on hover
    triggerBtn.addEventListener('mouseenter', () => {
      showTooltip();
    });

    triggerBtn.addEventListener('mouseleave', () => {
      hideTooltip();
    });

    if (tooltipBubble) {
      tooltipBubble.addEventListener('click', (e) => {
        hideTooltip();
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
