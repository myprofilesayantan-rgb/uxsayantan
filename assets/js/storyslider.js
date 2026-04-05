(function () {

  const track = document.querySelector('.moxo-track');

  if (!track) return;

  // DUPLICATE FOR LOOP
  track.innerHTML += track.innerHTML;

  const cards = document.querySelectorAll('.moxo-card');

  let index = 0;
  const originalLength = cards.length / 2;

  let isPaused = false;   // 🔥 key flag

  function update(animate = true) {

    track.style.transition = animate ? "transform 0.6s ease" : "none";

    cards.forEach(c => c.classList.remove('active','prev','next'));

    let prev = (index - 1 + cards.length) % cards.length;
    let next = (index + 1) % cards.length;

    cards[index].classList.add('active');
    cards[prev].classList.add('prev');
    cards[next].classList.add('next');

    let activeCard = cards[index];

    let offset = activeCard.offsetLeft 
               - track.offsetWidth / 2 
               + activeCard.offsetWidth / 2;

    track.style.transform = `translateX(${-offset}px)`;
  }

  function autoSlide() {

    if (isPaused) return; // 🔥 do nothing if paused

    index++;

    // LAST SLIDE PAUSE
    if (index === originalLength - 1) {

      update(true);

      setTimeout(() => {
        if (!isPaused) {
          index++;
          update(true);
        }
      }, 2000);

    }

    // LOOP RESET
    else if (index >= originalLength) {

      index = 0;

      update(false);

      setTimeout(() => {
        if (!isPaused) update(true);
      }, 50);

    }

    else {
      update(true);
    }
  }

  window.addEventListener('load', function () {

    index = 0;
    update(true);

    setInterval(autoSlide, 3500);

    // 🔥 TRUE PAUSE (no abrupt stop)
    track.addEventListener('mouseenter', () => {
      isPaused = true;
    });

    track.addEventListener('mouseleave', () => {
      isPaused = false;
    });

  });

})();