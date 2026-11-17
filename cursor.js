/**
 * ============================================================================
 * CUSTOM INTERACTIVE CURSOR SYSTEM (DESKTOP ONLY)
 * Independent, modular controller.
 * Does not modify or re-bind any existing website components.
 * ============================================================================
 */
(function() {
  'use strict';

  const init = () => {
    // Only activate on desktop devices supporting hover and fine pointer
    const hasFinePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const isDesktopWidth = window.innerWidth > 768;
    if (!hasFinePointer || !isDesktopWidth) return;

    // Check if element already exists or create dynamically
    let cursor = document.getElementById('custom-cursor');
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.id = 'custom-cursor';
      cursor.className = 'custom-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      cursor.innerHTML = `
        <div class="cursor-body" id="cursor-body">
          <span class="cursor-label" id="cursor-label"></span>
        </div>
        <div class="cursor-crosshair" id="cursor-crosshair">
          <span class="crosshair-line crosshair-h"></span>
          <span class="crosshair-line crosshair-v"></span>
        </div>
      `;
      document.body.appendChild(cursor);
    }

    const cursorBody = cursor.querySelector('.cursor-body');
    const cursorLabel = cursor.querySelector('.cursor-label');
    const cursorCrosshair = cursor.querySelector('.cursor-crosshair');

    // Enable custom cursor styling & hide native cursor only after successful setup
    document.documentElement.classList.add('has-custom-cursor');

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let isVisible = false;
    let currentState = 'default';
    let currentLabel = '';
    let isDragging = false;
    let rafId = null;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isReducedMotion = reducedMotionQuery ? reducedMotionQuery.matches : false;
    if (reducedMotionQuery && reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener('change', (e) => {
        isReducedMotion = e.matches;
      });
    }

    // 60-120FPS Smooth Render Loop (Linear Interpolation)
    const render = () => {
      if (isVisible) {
        const ease = isReducedMotion ? 1.0 : 0.22;
        currentX += (targetX - currentX) * ease;
        currentY += (targetY - currentY) * ease;
        cursor.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
      }
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    // Precise geometric hit testing for the hidden spiral easter egg
    const checkSpiralHover = (clientX, clientY, target) => {
      // Do not trigger spiral easter egg if hovering an interactive button/link/character/text
      if (target && target.closest('#hero-character, .hero-subtitle, #hero-name-heading, .hero-scroll-indicator, a, button, [role="button"]')) {
        return false;
      }

      const hero = document.querySelector('.hero-section');
      if (!hero) return false;
      const heroRect = hero.getBoundingClientRect();
      // If hero is scrolled out of view, do not trigger
      if (heroRect.bottom <= 50 || heroRect.top >= window.innerHeight - 50) return false;

      const spirals = document.querySelectorAll('.hero-spiral-layer .spiral-anchor');
      for (let i = 0; i < spirals.length; i++) {
        const spiral = spirals[i];
        const style = window.getComputedStyle(spiral);
        if (style.visibility === 'hidden' || parseFloat(style.opacity) < 0.08) continue;

        const rect = spiral.getBoundingClientRect();
        if (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        ) {
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const radius = (rect.width / 2) * 0.95;
          const dx = clientX - cx;
          const dy = clientY - cy;
          if (dx * dx + dy * dy <= radius * radius) {
            return true;
          }
        }
      }
      return false;
    };

    // Evaluate cursor state based on element underneath pointer
    const updateCursorState = (target, clientX, clientY) => {
      let nextState = 'default';
      let nextLabel = '';

      if (isDragging) {
        nextState = 'badge';
        nextLabel = 'DRAG';
      } else if (target) {
        // 1. Video Previews -> PLAY
        const videoPreview = target.closest(
          '#featured-video-viewport, .video-viewport-169, .video-poster-layer, .video-play-btn, .editing-video-stage, .editing-video-poster-overlay, .editing-play-trigger, video'
        );
        if (videoPreview && !target.closest('.video-cinema-trigger, .video-youtube-link, .video-casestudy-link')) {
          nextState = 'badge';
          nextLabel = 'PLAY';
        }
        // 2. Project Previews & Cards -> VIEW
        else if (
          target.closest('.cassette-slot, .freelance-card, .freelance-card-frame, .freelance-card-image-box, .web-project-showcase, .browser-frame-wrapper, .browser-frame, .grading-card, .experiment-card, [data-cursor="view"]') &&
          !target.closest('.web-cta-btn, .freelance-case-study-link, .shelf-nav-btn')
        ) {
          nextState = 'badge';
          nextLabel = 'VIEW';
        }
        // 3. Draggable Carousels -> DRAG
        else if (
          target.closest('#cassette-stage, .cassette-stage, .cassette-carousel-wrapper, .grade-compare-stage, .grade-slider-handle, [data-cursor="drag"]') &&
          !target.closest('.shelf-nav-btn, .cassette-slot')
        ) {
          nextState = 'badge';
          nextLabel = 'DRAG';
        }
        // 4. Links and Buttons -> Red accent dot
        else if (
          target.closest('a, button, [role="button"], input, select, textarea, .shelf-nav-btn, .channel-link, .contact-channel-row, .back-to-top-btn, .web-cta-btn, .video-casestudy-link, .video-cinema-trigger, .video-youtube-link, .preview-modal-close, .cinema-modal-close, .modal-dismiss-btn, #hero-character, [data-cursor="link"]')
        ) {
          nextState = 'link';
          nextLabel = '';
        }
        // 5. Hidden Spiral Easter Egg -> Minimal White Crosshair
        else if (checkSpiralHover(clientX, clientY, target)) {
          nextState = 'spiral';
          nextLabel = '';
        }
      }

      if (nextState !== currentState || nextLabel !== currentLabel) {
        currentState = nextState;
        currentLabel = nextLabel;

        cursor.classList.remove('cursor-state-link', 'cursor-state-badge', 'cursor-state-spiral');
        if (currentState === 'link') {
          cursor.classList.add('cursor-state-link');
          if (cursorLabel) cursorLabel.textContent = '';
        } else if (currentState === 'badge') {
          cursor.classList.add('cursor-state-badge');
          if (cursorLabel) cursorLabel.textContent = currentLabel;
        } else if (currentState === 'spiral') {
          cursor.classList.add('cursor-state-spiral');
          if (cursorLabel) cursorLabel.textContent = '';
        } else {
          if (cursorLabel) cursorLabel.textContent = '';
        }
      }
    };

    // Mouse Move Listener
    const onMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        currentX = targetX;
        currentY = targetY;
        cursor.classList.add('cursor-visible');
        cursor.classList.remove('cursor-hidden');
      }

      updateCursorState(e.target, e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Click Interactions (subtle press feedback)
    window.addEventListener('mousedown', (e) => {
      cursor.classList.add('cursor-clicking');
      if (e.target && e.target.closest('#cassette-stage, .cassette-stage, .grade-compare-stage')) {
        isDragging = true;
        cursor.classList.add('cursor-dragging');
        updateCursorState(e.target, e.clientX, e.clientY);
      }
    });

    window.addEventListener('mouseup', (e) => {
      cursor.classList.remove('cursor-clicking', 'cursor-dragging');
      isDragging = false;
      updateCursorState(e.target, e.clientX, e.clientY);
    });

    // Viewport enter & exit
    document.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-visible');
      cursor.classList.add('cursor-hidden');
    });

    document.addEventListener('mouseenter', () => {
      cursor.classList.remove('cursor-hidden');
      if (isVisible) cursor.classList.add('cursor-visible');
    });

    window.addEventListener('blur', () => {
      cursor.classList.remove('cursor-visible');
      cursor.classList.add('cursor-hidden');
    });

    window.addEventListener('focus', () => {
      cursor.classList.remove('cursor-hidden');
      if (isVisible) cursor.classList.add('cursor-visible');
    });

    // Recheck state on scroll
    window.addEventListener('scroll', () => {
      if (isVisible) {
        const el = document.elementFromPoint(targetX, targetY);
        if (el) updateCursorState(el, targetX, targetY);
      }
    }, { passive: true });

    // Responsive resize handler
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        document.documentElement.classList.remove('has-custom-cursor');
        cursor.classList.remove('cursor-visible');
        cursor.classList.add('cursor-hidden');
      } else {
        document.documentElement.classList.add('has-custom-cursor');
        cursor.classList.remove('cursor-hidden');
      }
    });

    // Expose API for external testing/verification
    window.CUSTOM_CURSOR_API = {
      getState: () => currentState,
      getLabel: () => currentLabel,
      getCoords: () => ({ x: currentX, y: currentY, targetX, targetY }),
      isVisible: () => isVisible,
      isDragging: () => isDragging
    };
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
