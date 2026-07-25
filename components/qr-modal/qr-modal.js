/**
 * QR Modal Interaction and Generation
 * Handles modal toggling and sophisticated QR code rendering using qr-code-styling
 */

const QRModal = {
  init() {
    const modalOverlay = document.getElementById('qr-modal');
    const triggerBtn = document.getElementById('floating-ai-btn');
    const closeBtn = document.getElementById('qr-close-btn');
    const qrContainer = document.getElementById('qr-code-container');
    let isQrGenerated = false;

    if (!modalOverlay || !triggerBtn || !closeBtn || !qrContainer) return;

    function openModal(e) {
      if (e) e.preventDefault();
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
            color: "transparent",
          }
        });
        qrCode.append(qrContainer);
        isQrGenerated = true;
      }
    }

    function closeModal() {
      modalOverlay.classList.remove('active');
    }

    triggerBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

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
