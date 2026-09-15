// ==========================================================================
// TUAN CHAU ATELIER - AR PHONE SIMULATOR
// Handles interactive AR tile selection inside the smartphone mockup
// ==========================================================================

window.initAppIntroSimulator = function() {
  const arFeed = document.getElementById('appArFeed');
  const thumbs = document.querySelectorAll('.app-tile-thumb');
  if (!arFeed || thumbs.length === 0) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      // 1. Remove active state from all thumbnails
      thumbs.forEach(t => t.classList.remove('active'));
      
      // 2. Set current thumbnail active
      thumb.classList.add('active');

      // 3. Smooth transition to new stone texture
      const imgSrc = thumb.getAttribute('src');
      if (!imgSrc) return;

      arFeed.style.opacity = '0.7';
      setTimeout(() => {
        arFeed.style.backgroundImage = `url('${imgSrc}')`;
        arFeed.style.opacity = '1';
      }, 150);
    });
  });
};
