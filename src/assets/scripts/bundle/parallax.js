// parallax.js
// Approche requestAnimationFrame — performante, pas de lib externe

(function () {
  const bg = document.querySelector('.hero-parallax__bg');
  if (!bg) return;

  // Respect de prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let ticking = false;
  const INTENSITY = 0.6; // 0 = aucun effet, 1 = effet maximal

  function updateParallax() {
    const scrollY = window.scrollY;
    const hero = bg.closest('.hero-parallax');
    const heroRect = hero.getBoundingClientRect();

    // N'animer que si le hero est visible
    if (heroRect.bottom < 0 || heroRect.top > window.innerHeight) {
      ticking = false;
      return;
    }

    const offset = scrollY * INTENSITY;
    bg.style.transform = `translateY(${offset}px)`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  // Position initiale
  updateParallax();
})();
