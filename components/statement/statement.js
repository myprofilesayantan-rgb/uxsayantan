/**
 * Final Statement Typewriter Module
 * Handles scroll-triggered (IntersectionObserver) character typing
 * of the core editorial statements with clean line breaks and fading cursor.
 */

window.PortfolioStatement = {
  text: "Driving provocative research.\nLeading high-stakes projects & providing expert mentorship.",
  container: null,
  textElement: null,
  cursorElement: null,
  currentIndex: 0,
  typingSpeed: 45, // Speed in milliseconds per character
  isTriggered: false,

  init(container) {
    if (!container) return;
    this.container = container;
    this.textElement = container.querySelector('#statement-text');
    this.cursorElement = container.querySelector('#typewriter-cursor');

    if (!this.textElement || !this.cursorElement) return;

    // Use IntersectionObserver to start writing only when scrolled into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isTriggered) {
          this.isTriggered = true;
          this.startTyping();
          observer.disconnect(); // Fire exactly once
        }
      });
    }, {
      rootMargin: '0px 0px -15% 0px', // Triggers when element is 15% inside viewport
      threshold: 0.1
    });

    observer.observe(this.container);
  },

  startTyping() {
    this.currentIndex = 0;
    this.textElement.innerHTML = "";
    this.typeNextCharacter();
  },

  typeNextCharacter() {
    if (this.currentIndex < this.text.length) {
      // 1. Extract next character substring
      const substring = this.text.substring(0, this.currentIndex + 1);
      
      // 2. Convert standard newlines (\n) to HTML line breaks (<br>)
      this.textElement.innerHTML = substring.replace(/\n/g, '<br>');
      
      // 3. Move pointer
      this.currentIndex++;
      
      // 4. Recurse with controlled speed
      setTimeout(() => {
        this.typeNextCharacter();
      }, this.typingSpeed);
    } else {
      // ── Typing Complete: Polished Cursor Fade-out ───────────────────────
      setTimeout(() => {
        if (this.cursorElement) {
          this.cursorElement.style.opacity = '0';
          // Completely hide cursor from layout after transition ends
          setTimeout(() => {
            if (this.cursorElement) {
              this.cursorElement.style.display = 'none';
            }
          }, 1000);
        }
      }, 3500); // Cursor blinks for 3.5 seconds post-typing, then fades away
    }
  }
};
