/* Gallery lightbox for 133 ROTC photo pages */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var grids = document.querySelectorAll('.openblock.photo-grid');
    if (!grids.length) return;

    /* ---- Build overlay ---- */
    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML =
      '<div class="lightbox-container">' +
        '<img class="lightbox-img" alt="">' +
      '</div>' +
      '<button class="lightbox-close" aria-label="닫기">&times;</button>' +
      '<button class="lightbox-prev" aria-label="이전">&#8249;</button>' +
      '<button class="lightbox-next" aria-label="다음">&#8250;</button>' +
      '<div class="lightbox-counter"></div>';
    document.body.appendChild(overlay);

    var img     = overlay.querySelector('.lightbox-img');
    var counter = overlay.querySelector('.lightbox-counter');
    var images  = [];
    var current = 0;

    /* Shared display update — called by openLightbox, prev, next */
    function updateDisplay() {
      img.src = images[current];
      counter.textContent = (current + 1) + ' / ' + images.length;
    }

    /* Collect all grid images */
    document.querySelectorAll('.openblock.photo-grid .imageblock img').forEach(function (el) {
      var idx = images.length;
      images.push(el.src);
      el.addEventListener('click', function () { openLightbox(idx); });
    });

    function openLightbox(idx) {
      current = idx;
      updateDisplay();
      overlay.classList.add('is-active');
      document.documentElement.style.overflowY = 'hidden';
    }

    function closeLightbox() {
      overlay.classList.remove('is-active');
      document.documentElement.style.overflowY = '';
      img.removeAttribute('src');
    }

    function prev() {
      current = (current - 1 + images.length) % images.length;
      updateDisplay();
    }

    function next() {
      current = (current + 1) % images.length;
      updateDisplay();
    }

    overlay.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    overlay.querySelector('.lightbox-prev').addEventListener('click', prev);
    overlay.querySelector('.lightbox-next').addEventListener('click', next);

    /* Click backdrop to close */
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeLightbox();
    });

    /* Keyboard */
    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('is-active')) return;
      if (e.key === 'Escape' || e.key === 'Esc') closeLightbox();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    });

    /* Touch swipe */
    var touchStartX = 0;
    overlay.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    overlay.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
    });
  });
})();
