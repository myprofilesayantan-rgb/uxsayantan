/**
 * Background Grid Initializer
 * Generates vertical grid lines and assigns staggered animation delays.
 */

class GridInitializer {
  init() {
    this.setupBackgroundGrid();
  }

  /**
   * Appends vertical grid lines to background.
   */
  setupBackgroundGrid() {
    const gridContainer = document.createElement('div');
    gridContainer.className = 'bg-grid-lines';
    for (let i = 0; i < 23; i++) {
      const line = document.createElement('div');
      line.className = 'bg-grid-line';
      // Dynamically stagger the animation delays randomly between 0s and 10s
      line.style.animationDelay = `${(Math.random() * 10).toFixed(2)}s`;
      gridContainer.appendChild(line);
    }
    document.body.insertBefore(gridContainer, document.body.firstChild);
  }
}

class LazyMediaLoader {
  init() {
    this.setupLazyLoading();
  }

  setupLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy-load');
    const lazyVideos = document.querySelectorAll('video.lazy-load');

    const mediaObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const media = entry.target;
          
          if (media.tagName === 'IMG') {
            if (media.dataset.src) {
              media.src = media.dataset.src;
            }
            media.classList.add('lazy-loaded');
          } else if (media.tagName === 'VIDEO') {
            const sources = media.querySelectorAll('source');
            sources.forEach(source => {
              if (source.dataset.src) {
                source.src = source.dataset.src;
              }
            });
            media.load();
            media.classList.add('lazy-loaded');
          }
          
          observer.unobserve(media);
        }
      });
    }, {
      rootMargin: '200px 0px', // Pre-load 200px before coming in view
      threshold: 0.01
    });

    lazyImages.forEach(img => mediaObserver.observe(img));
    lazyVideos.forEach(video => mediaObserver.observe(video));
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  const grid = new GridInitializer();
  grid.init();

  const lazyLoader = new LazyMediaLoader();
  lazyLoader.init();
});
