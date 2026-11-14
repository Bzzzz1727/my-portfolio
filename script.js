/**
 * ============================================================================
 * NEHA TRIVEDI — PORTFOLIO SCRIPT (script.js)
 * 
 * Subtle, restrained text interactions:
 * 1. Title ("Neha Trivedi"):
 *    - On hover: subtle scale & cursor-reactive tilt with optical horizontal shift.
 *    - Smoothly returns to neutral on mouse leave.
 *    - Subtle vertical scroll shift (clamped <= 8px).
 * 2. Subtitle ("Graphic Designer || Aspiring Filmmaker"):
 *    - Initial page load: smooth 800ms fade-in + 8px rise (CSS keyframes).
 *    - On mouse hover: subtle cursor-reactive movement <= 3.5px and faint glow.
 *    - On scroll: vertical parallax clamped strictly <= 5px (never drifts away).
 *    - Red "||" separator glows brighter red when subtitle is hovered.
 * 3. Keeps lettering completely intact (zero deformation).
 * 4. Full prefers-reduced-motion support.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const title = document.getElementById('hero-name-heading');
  const subtitle = document.getElementById('hero-subtitle');
  const heroWrapper = document.querySelector('.hero-content-wrapper') || document.body;
  const heroSection = document.querySelector('.hero-section');
  const spiralBottomRight = document.querySelector('.spiral-anchor-bottom-right');
  const spiralTopLeft = document.querySelector('.spiral-anchor-top-left');

  if (!title || !subtitle) return;

  // Accessibility: Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return;


  // --------------------------------------------------------------------------
  // Title ("Neha Trivedi") interaction state
  // --------------------------------------------------------------------------
  let targetTiltX = 0;
  let targetTiltY = 0;
  let targetShiftX = 0;
  let targetScale = 1.0;

  let currentTiltX = 0;
  let currentTiltY = 0;
  let currentShiftX = 0;
  let currentScale = 1.0;

  let isHovered = false;
  let targetScrollShiftY = 0;
  let currentScrollShiftY = 0;

  // --------------------------------------------------------------------------
  // Subtitle ("Graphic Designer || Aspiring Filmmaker") interaction state
  // --------------------------------------------------------------------------
  let isSubtitleHovered = false;
  let targetSubCursorX = 0;
  let targetSubCursorY = 0;
  let currentSubCursorX = 0;
  let currentSubCursorY = 0;

  let targetSubScrollY = 0;
  let currentSubScrollY = 0;

  // Coordinate initial CSS entrance (800ms) with interactive JS transforms
  let isIntroActive = true;
  subtitle.addEventListener('animationend', () => {
    isIntroActive = false;
  }, { once: true });
  setTimeout(() => {
    isIntroActive = false;
  }, 850);

  let rafId = null;

  // Title mouse move handler: calculates subtle 3D tilt and optical shift
  const onTitleMouseMove = (e) => {
    if (prefersReducedMotion.matches) return;

    const rect = title.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalized offset from title center (-1 to 1)
    const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (rect.width * 0.7)));
    const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (rect.height * 1.5)));

    // Restrained, subtle reaction values
    targetTiltX = -normY * 2.2; // Max 2.2deg vertical tilt
    targetTiltY = normX * 2.8;  // Max 2.8deg horizontal tilt
    targetShiftX = normX * 5.0; // Max 5px horizontal optical shift
    targetScale = 1.025;        // Subtle 2.5% scale
    isHovered = true;
  };

  // Title mouse leave handler: smoothly resets targets to neutral
  const onTitleMouseLeave = () => {
    isHovered = false;
    targetTiltX = 0;
    targetTiltY = 0;
    targetShiftX = 0;
    targetScale = 1.0;
  };

  heroWrapper.addEventListener('mousemove', onTitleMouseMove, { passive: true });
  heroWrapper.addEventListener('mouseleave', onTitleMouseLeave, { passive: true });

  // Subtitle mouse move handler: subtle cursor-reactive movement <= 3.5px
  const onSubtitleMouseMove = (e) => {
    if (prefersReducedMotion.matches) return;

    const rect = subtitle.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Offset relative to center (-1 to 1)
    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);

    // Limit cursor movement to strictly <= 3.5px (within the 3-4px requirement)
    const maxShift = 3.5;
    const rawX = normX * maxShift;
    const rawY = normY * 2.2;
    const dist = Math.hypot(rawX, rawY);

    if (dist > maxShift) {
      targetSubCursorX = (rawX / dist) * maxShift;
      targetSubCursorY = (rawY / dist) * maxShift;
    } else {
      targetSubCursorX = rawX;
      targetSubCursorY = rawY;
    }
    isSubtitleHovered = true;
  };

  // Subtitle mouse leave handler: smoothly returns to resting position
  const onSubtitleMouseLeave = () => {
    isSubtitleHovered = false;
    targetSubCursorX = 0;
    targetSubCursorY = 0;
  };

  subtitle.addEventListener('mousemove', onSubtitleMouseMove, { passive: true });
  subtitle.addEventListener('mouseleave', onSubtitleMouseLeave, { passive: true });

  // Scroll handler: subtle depth shifts for title/subtitle and instant smooth fade/scale for hero spirals
  const updateSpiralScroll = () => {
    if (prefersReducedMotion.matches) return;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const heroH = heroSection ? heroSection.offsetHeight : (window.innerHeight || 800);
    // Fully disappear before cassette section becomes the main viewport section (~35% of hero)
    const fadeDistance = Math.min(360, Math.max(200, heroH * 0.35));
    const progress = Math.min(1.0, Math.max(0.0, scrollY / fadeDistance));

    // Scale from 1.0 down to 0.40, opacity from 0.95 down to 0.0
    const scale = 1.0 - progress * 0.60;
    const opacity = 0.95 * (1.0 - progress);

    if (spiralBottomRight) {
      if (progress >= 1.0) {
        spiralBottomRight.style.opacity = '0';
        spiralBottomRight.style.visibility = 'hidden';
        spiralBottomRight.style.pointerEvents = 'none';
      } else {
        spiralBottomRight.style.visibility = 'visible';
        spiralBottomRight.style.pointerEvents = 'none';
        spiralBottomRight.style.opacity = opacity.toFixed(3);
        spiralBottomRight.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      }
    }

    if (spiralTopLeft) {
      if (progress >= 1.0) {
        spiralTopLeft.style.opacity = '0';
        spiralTopLeft.style.visibility = 'hidden';
        spiralTopLeft.style.pointerEvents = 'none';
      } else {
        spiralTopLeft.style.visibility = 'visible';
        spiralTopLeft.style.pointerEvents = 'none';
        spiralTopLeft.style.opacity = opacity.toFixed(3);
        spiralTopLeft.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      }
    }
  };

  const onScroll = () => {
    if (prefersReducedMotion.matches) return;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Title: shift vertically by a few pixels at most (clamped to max 8px)
    const maxTitleShift = 8.0;
    targetScrollShiftY = Math.min(maxTitleShift, Math.max(-maxTitleShift, scrollY * 0.06));

    // Subtitle: restrained vertical parallax strictly clamped to <= 5px
    const maxSubScroll = 5.0;
    targetSubScrollY = Math.min(maxSubScroll, Math.max(-maxSubScroll, scrollY * 0.025));

    // Update hero spirals on scroll
    updateSpiralScroll();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Initialize resting scroll offset

  // 60FPS Smooth Render Loop (Linear Interpolation)
  const animate = () => {
    if (!prefersReducedMotion.matches) {
      // Title ease factor: slightly responsive on hover, gentle damping on return
      const titleEase = isHovered ? 0.08 : 0.05;

      currentTiltX += (targetTiltX - currentTiltX) * titleEase;
      currentTiltY += (targetTiltY - currentTiltY) * titleEase;
      currentShiftX += (targetShiftX - currentShiftX) * titleEase;
      currentScale += (targetScale - currentScale) * titleEase;
      currentScrollShiftY += (targetScrollShiftY - currentScrollShiftY) * 0.07;

      // Apply 3D perspective transform to the red name
      title.style.transform = `perspective(1000px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg) translateX(${currentShiftX.toFixed(2)}px) translateY(${currentScrollShiftY.toFixed(2)}px) scale(${currentScale.toFixed(3)})`;

      // Subtitle transform: apply smoothly once initial CSS entrance animation (800ms) completes
      if (!isIntroActive) {
        const subEase = isSubtitleHovered ? 0.09 : 0.05;
        currentSubCursorX += (targetSubCursorX - currentSubCursorX) * subEase;
        currentSubCursorY += (targetSubCursorY - currentSubCursorY) * subEase;
        currentSubScrollY += (targetSubScrollY - currentSubScrollY) * 0.07;

        const totalSubX = currentSubCursorX;
        const totalSubY = currentSubCursorY + currentSubScrollY;
        subtitle.style.transform = `translate3d(${totalSubX.toFixed(2)}px, ${totalSubY.toFixed(2)}px, 0)`;
      }
    }

    rafId = requestAnimationFrame(animate);
  };

  animate();

  // Listen for reduced motion system toggles
  prefersReducedMotion.addEventListener('change', (e) => {
    if (e.matches) {
      cancelAnimationFrame(rafId);
      title.style.transform = '';
      subtitle.style.transform = '';
      if (spiralBottomRight) {
        spiralBottomRight.style.opacity = '';
        spiralBottomRight.style.transform = '';
        spiralBottomRight.style.visibility = '';
      }
      if (spiralTopLeft) {
        spiralTopLeft.style.opacity = '';
        spiralTopLeft.style.transform = '';
        spiralTopLeft.style.visibility = '';
      }
    } else {
      animate();
    }
  });

  // ==========================================================================
  // INTERACTIVE CHARACTER AVATAR: TOUCHSCREEN TOGGLE & PRELOAD
  // ==========================================================================
  const charWrapper = document.getElementById('hero-character');
  if (charWrapper) {
    // Instant preload cache
    const preDefault = new Image();
    preDefault.src = 'assets/images/character.png';
    const preHover = new Image();
    preHover.src = 'assets/images/png2.png';

    let touched = false;

    charWrapper.addEventListener('touchstart', () => {
      touched = true;
    }, { passive: true });

    // Touchscreen tap toggles between default and png2
    charWrapper.addEventListener('click', (e) => {
      if (touched || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0)) {
        charWrapper.classList.toggle('is-active');
      }
    });

    // Keyboard accessibility: Enter or Space toggles
    charWrapper.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        charWrapper.classList.toggle('is-active');
      }
    });
  }

  // ==========================================================================
  // CONTINUOUS CENTRE-FOCUSED CASSETTE CAROUSEL CONTROLLER
  // - Real-time dynamic center detection (always exactly ONE expanded cassette)
  // - Mathematical infinite toroidal loop in both directions
  // - Zero-overlap symmetrical spacing (center front never covers side spines)
  // - Manual scrolling: Trackpad/Wheel, Drag, Touch, Navigation Arrows & Direct Tap
  // - Automatic expansion on initial load (no hover or click required)
  // ==========================================================================
  const initCassetteCarousel = () => {
    const wallSection = document.getElementById('graphic-design');
    if (!wallSection) return;

    const stage = document.getElementById('cassette-stage');
    const track = document.getElementById('cassette-track');
    const prevBtn = document.getElementById('shelf-prev-btn');
    const nextBtn = document.getElementById('shelf-next-btn');
    const slots = Array.from(wallSection.querySelectorAll('.cassette-slot'));

    if (!stage || !track || slots.length === 0) return;

    const NUM_PROJECTS = 7;
    const TOTAL_ITEMS = slots.length; // 35 items (5 sets of 7)

    // ------------------------------------------------------------------------
    // Verified Data-Driven Graphic Design Project Registry (Strictly 7 Projects)
    // ------------------------------------------------------------------------
    const CASSETTE_PROJECTS = [
          {
                "id": "kabhi-kabhi",
                "badge": "CLIENT PROJECT",
                "title": "KABHI KABHI",
                "artist": "REYDOR",
                "category": "ALBUM COVER ARTWORK",
                "type": "Client Project",
                "role": "Creative Direction, Art Direction and Album Cover Design",
                "software": "Canva",
                "shortDescription": "A visual interpretation of the rage of love, translating the song's emotional intensity into a distinctive album cover.",
                "metadataLine": "ART DIRECTION · COVER DESIGN · CANVA",
                "caseStudyUrl": "case-study-kabhi-kabhi.html",
                "previewArtworkImage": "assets/images/kabhi-kabhi-cover.jpg",
                "artworkImage": "assets/images/kabhi-kabhi-front.png",
                "spineImage": "assets/images/kabhi-kabhi-spine.png"
          },
          {
                "id": "qawwali-ki-baithak",
                "badge": "PERSONAL PROJECT",
                "title": "QAWWALI KI BAITHAK",
                "artist": "FAREED AYAZ & ABU MUHAMMAD",
                "category": "ALBUM COVER REDESIGN",
                "type": "Personal Project",
                "role": "Art Direction, Album Cover Redesign, Typography and Visual Layout",
                "software": "Adobe Photoshop",
                "shortDescription": "“An archival-inspired reinterpretation of a traditional Qawwali album, combining textured paper, monochromatic imagery and distressed red typography.”",
                "metadataLine": "PHOTOSHOP · ART DIRECTION · ALBUM ARTWORK",
                "caseStudyUrl": "case-study-qawwali-ki-baithak.html",
                "previewArtworkImage": "assets/images/qawwali-cover.jpg",
                "artworkImage": "assets/images/qawwali-front.png",
                "spineImage": "assets/images/qawwali-spine.png"
          },
          {
                "id": "i-deserve-to-bleed",
                "badge": "PERSONAL PROJECT",
                "title": "I DESERVE TO BLEED",
                "artist": "SUSHI SOUCY",
                "category": "ALBUM COVER REDESIGN",
                "type": "Personal Project",
                "role": "Cover Artwork, Typography and Visual Direction",
                "software": "",
                "shortDescription": "“A personal reinterpretation of an existing song through distressed textures, expressive typography and unsettling imagery. The project explores the relationship between pain, beauty and visual intensity.”",
                "metadataLine": "ALBUM COVER REDESIGN · PERSONAL PROJECT · SPOTIFY",
                "caseStudyUrl": "case-study-i-deserve-to-bleed.html",
                "previewArtworkImage": "assets/images/bleed-tiles.jpg",
                "artworkImage": "assets/images/bleed-front.png",
                "spineImage": "assets/images/bleed-spine.png"
          },
          {
                "id": "art-against-fascists",
                "badge": "INDEPENDENT PROJECT",
                "title": "ART AGAINST FASCISTS",
                "artist": "2026",
                "category": "PROTEST POSTER SERIES",
                "year": "2026",
                "type": "Independent Project",
                "role": "Poster Design & Cassette Artwork",
                "software": "Digital Poster Design",
                "shortDescription": "An independent series of protest posters created in support of the Delhi protest in June–July 2026, as part of Art Against Fascists — an artistic expression of solidarity through different creative mediums.",
                "metadataLine": "INDEPENDENT PROJECT · DELHI · 2026",
                "caseStudyUrl": "case-study-art-against-fascists.html",
                "previewArtworkImage": "assets/images/fascists-poster-01.jpg",
                "artworkImage": "assets/images/fascists-front.png",
                "spineImage": "assets/images/fascists-spine.png"
          },
          {
                "id": "project-05",
                "badge": "ARCHIVE",
                "title": "PROJECT 05",
                "artist": "COMING SOON",
                "category": "GRAPHIC DESIGN",
                "type": "Archive Project",
                "role": "Graphic Design",
                "software": "Graphic Design",
                "shortDescription": "Upcoming graphic design archive project.",
                "metadataLine": "GRAPHIC DESIGN · VISUAL IDENTITY",
                "caseStudyUrl": "#",
                "previewArtworkImage": "assets/images/cassette-front-cropped.png",
                "artworkImage": "assets/images/cassette-front-cropped.png",
                "spineImage": "assets/images/cassette-spine-cropped.png"
          },
          {
                "id": "project-06",
                "badge": "ARCHIVE",
                "title": "PROJECT 06",
                "artist": "COMING SOON",
                "category": "GRAPHIC DESIGN",
                "type": "Archive Project",
                "role": "Graphic Design",
                "software": "Graphic Design",
                "shortDescription": "Upcoming graphic design archive project.",
                "metadataLine": "GRAPHIC DESIGN · VISUAL IDENTITY",
                "caseStudyUrl": "#",
                "previewArtworkImage": "assets/images/cassette-front-cropped.png",
                "artworkImage": "assets/images/cassette-front-cropped.png",
                "spineImage": "assets/images/cassette-spine-cropped.png"
          },
          {
                "id": "project-07",
                "badge": "ARCHIVE",
                "title": "PROJECT 07",
                "artist": "COMING SOON",
                "category": "GRAPHIC DESIGN",
                "type": "Archive Project",
                "role": "Graphic Design",
                "software": "Graphic Design",
                "shortDescription": "Upcoming graphic design archive project.",
                "metadataLine": "GRAPHIC DESIGN · VISUAL IDENTITY",
                "caseStudyUrl": "#",
                "previewArtworkImage": "assets/images/cassette-front-cropped.png",
                "artworkImage": "assets/images/cassette-front-cropped.png",
                "spineImage": "assets/images/cassette-spine-cropped.png"
          }
    ];

    // Expanded project preview modal DOM elements
    const modal = document.getElementById('project-preview-modal');
    const modalContainer = document.getElementById('preview-modal-container');
    const modalBackdrop = document.getElementById('preview-modal-backdrop');
    const modalClose = document.getElementById('preview-modal-close');
    const modalDismissBtn = document.getElementById('modal-dismiss-btn');
    const modalImg = document.getElementById('modal-project-img');
    const modalBadge = document.getElementById('modal-project-badge');
    const modalTitle = document.getElementById('modal-project-title');
    const modalArtist = document.getElementById('modal-project-artist');
    const modalCategory = document.getElementById('modal-project-category');
    const modalDescription = document.getElementById('modal-project-description');
    const modalRole = document.getElementById('modal-project-role');
    const modalSoftware = document.getElementById('modal-project-software');
    const modalTags = document.getElementById('modal-project-tags');
    const modalCaseLink = document.getElementById('modal-project-case-link');

    const OPEN_DELAY_MS = 600;
    const CLOSE_DELAY_MS = 180;

    let isPreviewOpen = false;
    let activeProjectId = null;
    let lastFocusedElement = null;

    // Hover state tracking for centre cassette and preview panel
    let isCursorOverCenter = false;
    let isCursorOverPreview = false;
    let closeTimer = null;
    let openTimer = null;
    let pendingOpenSlotIndex = null;

    const cancelClosePreview = () => {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    };

    const cancelOpenPreview = () => {
      if (openTimer) {
        clearTimeout(openTimer);
        openTimer = null;
      }
      pendingOpenSlotIndex = null;
    };

    const scheduleClosePreview = (delay = CLOSE_DELAY_MS) => {
      cancelClosePreview();
      closeTimer = setTimeout(() => {
        if (!isCursorOverCenter && !isCursorOverPreview) {
          closeExpandedPreview();
        }
        closeTimer = null;
      }, delay);
    };

    // Opens or updates the separate expanded project preview modal (floating overlay)
    const openExpandedPreview = (project, focusClose = false) => {
      if (!modal || !project) return;

      // Update project information and artwork if switching projects
      if (activeProjectId !== project.id) {
        activeProjectId = project.id;

        if (modalBadge) modalBadge.textContent = project.badge || project.type || 'PROJECT';
        if (modalTitle) modalTitle.textContent = project.title || '';
        if (modalArtist) modalArtist.textContent = project.artist || '';
        if (modalCategory) modalCategory.textContent = project.category || '';
        if (modalDescription) modalDescription.textContent = project.shortDescription || '';
        if (modalRole) modalRole.textContent = project.role || 'Graphic Design';
        if (modalSoftware) modalSoftware.textContent = project.software || 'Canva';
        if (modalTags) {
          modalTags.textContent = project.metadataLine || '';
          modalTags.style.display = project.metadataLine ? 'block' : 'none';
        }
        if (modalImg) {
          modalImg.src = project.previewArtworkImage || project.artworkImage || 'assets/images/kabhi-kabhi-cover.jpg';
          modalImg.alt = `${project.title} Artwork`;
          const frame = modalImg.closest('.preview-artwork-frame');
          if (frame) {
            if (project.id === 'satyajit-ray-tshirt') {
              frame.classList.add('is-portrait-frame');
            } else {
              frame.classList.remove('is-portrait-frame');
            }
          }
        }

        if (modalCaseLink) {
          if (project.caseStudyUrl && project.caseStudyUrl !== '#') {
            modalCaseLink.href = project.caseStudyUrl;
            modalCaseLink.innerHTML = `VIEW CASE STUDY <span class="arrow-glyph" aria-hidden="true">↗</span>`;
            modalCaseLink.style.pointerEvents = 'auto';
            modalCaseLink.style.opacity = '1';
            modalCaseLink.style.cursor = 'pointer';
          } else {
            modalCaseLink.href = 'javascript:void(0)';
            modalCaseLink.innerHTML = `VIEW CASE STUDY (COMING SOON)`;
            modalCaseLink.style.pointerEvents = 'none';
            modalCaseLink.style.opacity = '0.45';
            modalCaseLink.style.cursor = 'default';
          }
        }
      }

      if (!isPreviewOpen) {
        lastFocusedElement = document.activeElement;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.documentElement.classList.add('preview-modal-open');
        document.body.classList.add('preview-modal-open');
        isPreviewOpen = true;

        if (focusClose && modalClose) {
          setTimeout(() => modalClose.focus(), 60);
        }
      }
    };

    // Closes the expanded project preview smoothly returning to cassette archive
    const closeExpandedPreview = () => {
      if (!modal || !isPreviewOpen) return;
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('preview-modal-open');
      document.body.classList.remove('preview-modal-open');
      isPreviewOpen = false;
      activeProjectId = null;
      isCursorOverCenter = false;
      isCursorOverPreview = false;
      cancelClosePreview();
      cancelOpenPreview();

      // Preserves current carousel position and returns focus cleanly
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    };

    // Pointer capability tracking (touch vs mouse)
    let lastPointerType = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia('(pointer: coarse)').matches) ? 'touch' : 'mouse';

    window.addEventListener('pointerdown', (e) => {
      if (e.pointerType) lastPointerType = e.pointerType;
    }, { passive: true, capture: true });

    window.addEventListener('touchstart', () => {
      lastPointerType = 'touch';
    }, { passive: true, capture: true });

    window.addEventListener('mousemove', (e) => {
      if (e.movementX !== 0 || e.movementY !== 0) {
        lastPointerType = 'mouse';
      }
    }, { passive: true });

    // Modal container interaction: keeps preview open while hovering inside panel
    if (modalContainer) {
      modalContainer.addEventListener('mouseenter', () => {
        isCursorOverPreview = true;
        cancelClosePreview();
      });

      modalContainer.addEventListener('mouseleave', (e) => {
        if (e.relatedTarget && modalContainer.contains(e.relatedTarget)) {
          return;
        }
        isCursorOverPreview = false;
        if (!isCursorOverCenter) {
          scheduleClosePreview(CLOSE_DELAY_MS);
        }
      });

      // Stop touch gestures inside modal container from moving carousel stage
      modalContainer.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
      modalContainer.addEventListener('touchmove', (e) => e.stopPropagation(), { passive: true });
      modalContainer.addEventListener('touchend', (e) => e.stopPropagation(), { passive: true });
    }

    if (modalClose) {
      modalClose.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeExpandedPreview();
      });
      modalClose.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeExpandedPreview();
      });
    }

    if (modalDismissBtn) {
      modalDismissBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeExpandedPreview();
      });
      modalDismissBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeExpandedPreview();
      });
    }

    // Handles tapping outside the preview container (e.g. on backdrop or empty space)
    const handleOutsideInteraction = (e) => {
      if (!isPreviewOpen) return;
      if (modalContainer && modalContainer.contains(e.target)) return;

      const clientX = e.clientX ?? (e.changedTouches && e.changedTouches[0]?.clientX);
      const clientY = e.clientY ?? (e.changedTouches && e.changedTouches[0]?.clientY);

      let hitSlot = null;
      if (typeof clientX === 'number' && typeof clientY === 'number') {
        modal.style.pointerEvents = 'none';
        const elUnder = document.elementFromPoint(clientX, clientY);
        modal.style.pointerEvents = '';
        if (elUnder) {
          hitSlot = elUnder.closest('.cassette-slot');
        }
      }

      if (hitSlot) {
        const slotIdx = parseInt(hitSlot.dataset.index, 10);
        if (!isNaN(slotIdx) && typeof handleSlotAction === 'function') {
          if (slotIdx === activeCenterIndex) {
            // Tapping selected cassette again closes it
            closeExpandedPreview();
          } else {
            // Tapping different cassette closes current and opens newly selected
            handleSlotAction(slotIdx, true);
          }
          return;
        }
      }

      closeExpandedPreview();
    };

    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleOutsideInteraction(e);
      });
      modalBackdrop.addEventListener('touchend', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleOutsideInteraction(e);
      });
    }

    // Dismiss preview when clicking outside modal container
    document.addEventListener('click', (e) => {
      if (!isPreviewOpen) return;
      if (modalContainer && modalContainer.contains(e.target)) return;
      if (e.target.closest('.cassette-slot')) return;
      closeExpandedPreview();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isPreviewOpen) {
        e.preventDefault();
        closeExpandedPreview();
      }
    });

    // State: Start at middle set (item 14, Project 01: Kabhi Kabhi)
    let targetIndex = 14;
    let currentIndex = targetIndex;
    let isDragging = false;
    let hasDragged = false;
    let dragStartX = 0;
    let dragStartIndex = targetIndex;
    let activeCenterIndex = -1;

    // Layout metrics extraction with responsive breakpoint support matching CSS media queries
    const getMetrics = () => {
      const vw = window.innerWidth;
      let h, frontW, spineW, centerGap, sideGap;

      if (vw <= 520) {
        h = 155;
        frontW = 246;
        spineW = 24;
        centerGap = 20;
        sideGap = 14;
      } else if (vw <= 768) {
        h = 185;
        frontW = 294;
        spineW = 29;
        centerGap = 26;
        sideGap = 18;
      } else if (vw <= 1200) {
        h = 230;
        frontW = 366;
        spineW = 36;
        centerGap = 38;
        sideGap = 28;
      } else {
        h = 270;
        // In CSS: calc(var(--cassette-h) * var(--cassette-aspect)) = 270 * 1.5918 = 429.78px
        frontW = 429.78;
        spineW = 42; // Exact 89 / 577 * 270px natural aspect ratio of Kabhi Kabhi spine
        centerGap = 48;
        sideGap = 36;
      }

      // Distance from center item to first side spine
      const dCenter = (frontW / 2) + centerGap + (spineW / 2);
      // Distance between adjacent side spines
      const dSide = spineW + sideGap;

      return { h, frontW, spineW, centerGap, sideGap, dCenter, dSide };
    };

    // Calculate X coordinate offset from viewport center as a function of continuous relative index u
    const calcOffsetFromCenter = (u, metrics) => {
      const { dCenter, dSide } = metrics;
      if (Math.abs(u) <= 1) {
        return u * dCenter;
      } else if (u > 1) {
        return dCenter + (u - 1) * dSide;
      } else {
        return -dCenter + (u + 1) * dSide;
      }
    };

    // Cached slot layout width for 60fps performance without layout thrashing
    let cachedSlotW = 0;
    let lastVw = 0;

    // Main animation frame loop
    const render = () => {
      // Calculate position strictly relative to visible browser viewport width (50% center)
      const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
      const viewportCenterX = viewportWidth / 2;
      const stageRect = stage.getBoundingClientRect();
      // Exact position of viewport 50% line mapped into stage coordinate space
      const stageCenterX = viewportCenterX - stageRect.left;
      const metrics = getMetrics();

      if (window.innerWidth !== lastVw || cachedSlotW === 0) {
        lastVw = window.innerWidth;
        cachedSlotW = (slots[0] && slots[0].getBoundingClientRect().width) || metrics.frontW;
      }

      // Smooth interpolation toward targetIndex when not actively dragging
      if (!isDragging) {
        currentIndex += (targetIndex - currentIndex) * 0.14;
      }

      // Toroidal infinite wrap check for 5 sets of 7 projects (35 slots)
      // Keeps currentIndex smoothly in the middle set [14, 21)
      if (currentIndex >= NUM_PROJECTS * 3) {
        currentIndex -= NUM_PROJECTS;
        targetIndex -= NUM_PROJECTS;
      } else if (currentIndex < NUM_PROJECTS * 2) {
        currentIndex += NUM_PROJECTS;
        targetIndex += NUM_PROJECTS;
      }

      // Dynamic center detection:
      // The cassette closest to the exact horizontal centre of the viewport is expanded
      const currentCenterIndex = Math.round(currentIndex);

      if (currentCenterIndex !== activeCenterIndex) {
        if (activeCenterIndex >= 0 && slots[activeCenterIndex]) {
          slots[activeCenterIndex].classList.remove('is-center');
          slots[activeCenterIndex].setAttribute('aria-expanded', 'false');
        }
        if (slots[currentCenterIndex]) {
          slots[currentCenterIndex].classList.add('is-center');
          slots[currentCenterIndex].setAttribute('aria-expanded', 'true');
        }
        activeCenterIndex = currentCenterIndex;

        // Active center changed: cancel any open timer tied to the old center
        cancelOpenPreview();

        // Check if cursor is currently hovering over the newly centered cassette
        const newCenterSlot = slots[activeCenterIndex];
        let isHovered = false;
        if (newCenterSlot) {
          try {
            isHovered = newCenterSlot.matches(':hover');
          } catch (err) {
            isHovered = false;
          }
        }

        if (isHovered) {
          if (!isCarouselMoving()) {
            handleCenterMouseEnter(activeCenterIndex);
          }
        } else {
          isCursorOverCenter = false;
          if (isPreviewOpen && !isCursorOverPreview) {
            scheduleClosePreview(CLOSE_DELAY_MS);
          }
        }
      }

      // If carousel has settled and cursor is resting over center cassette, trigger hover handling
      if (!isCarouselMoving() && slots[activeCenterIndex]) {
        let isHovered = false;
        try {
          isHovered = slots[activeCenterIndex].matches(':hover');
        } catch (err) {
          isHovered = false;
        }
        if (isHovered && !isCursorOverCenter) {
          handleCenterMouseEnter(activeCenterIndex);
        }
      }

      // Position each slot across the shelf relative to viewport center
      // Displays exactly 7 cassette positions (3 Left, 1 Center, 3 Right) at rest
      const slotW = cachedSlotW || metrics.frontW;
      const halfFrontW = slotW / 2;
      for (let i = 0; i < TOTAL_ITEMS; i++) {
        const slot = slots[i];
        const u = i - currentIndex;
        const absU = Math.abs(u);

        // Slots within 3.8 units of center are processed; entering/exiting fade applies from 3.0 to 3.8
        if (absU <= 3.8) {
          const offset = calcOffsetFromCenter(u, metrics);
          const itemCenterX = stageCenterX + offset;
          const itemLeft = itemCenterX - halfFrontW;

          slot.style.display = 'block';
          slot.style.transform = `translateX(${itemLeft}px) translateZ(0)`;

          // Realistic depth falloff and entering/exiting transition
          let opacity = 1;
          let brightness = 1;

          if (absU <= 0.5) {
            brightness = 1;
            opacity = 1;
          } else if (absU <= 1.5) {
            brightness = 0.96;
            opacity = 1;
          } else if (absU <= 2.5) {
            brightness = 0.88;
            opacity = 1;
          } else if (absU <= 3.0) {
            brightness = 0.82;
            opacity = 1;
          } else {
            // Smooth entering/exiting fade as user scrolls
            const fade = Math.max(0, 1 - (absU - 3.0) / 0.8);
            opacity = fade;
            brightness = 0.74;
          }

          slot.style.opacity = opacity.toFixed(3);
          slot.style.filter = `brightness(${brightness})`;
        } else {
          slot.style.display = 'none';
          slot.style.opacity = '0';
        }
      }

      requestAnimationFrame(render);
    };

    // Start render loop immediately so center cassette is expanded on initial page load
    requestAnimationFrame(render);

    // ------------------------------------------------------------------------
    // 1. Centre-Only Cassette Hover Interaction
    // - ONLY the currently expanded center cassette triggers the project preview
    // - Six surrounding narrow vertical cassette spines must NOT open any preview
    // - Cursor moving from center cassette into preview panel keeps it open
    // - Cursor leaving BOTH center cassette and preview panel closes after ~180ms
    // - Returning to either cancels the closing action
    // - Accidental opening/closing prevented during carousel movement
    // ------------------------------------------------------------------------
    const isCarouselMoving = () => {
      return isDragging || hasDragged || Math.abs(targetIndex - currentIndex) > 0.08;
    };

    const handleCenterMouseEnter = (slotIndex) => {
      if (isCarouselMoving()) return;
      if (slotIndex !== activeCenterIndex) return;

      isCursorOverCenter = true;
      cancelClosePreview();

      const projectIndex = ((slotIndex % NUM_PROJECTS) + NUM_PROJECTS) % NUM_PROJECTS;
      const project = CASSETTE_PROJECTS[projectIndex];

      // If preview is already open and displaying this exact project, nothing more to do
      if (isPreviewOpen && activeProjectId === project.id) {
        cancelOpenPreview();
        return;
      }

      // If an open timer is already running for this exact slot, let it continue
      if (openTimer && pendingOpenSlotIndex === slotIndex) {
        return;
      }

      cancelOpenPreview();
      pendingOpenSlotIndex = slotIndex;

      openTimer = setTimeout(() => {
        openTimer = null;
        pendingOpenSlotIndex = null;
        if (isCarouselMoving()) return;
        if (isCursorOverCenter && slotIndex === activeCenterIndex) {
          openExpandedPreview(project, false);
        }
      }, OPEN_DELAY_MS);
    };

    const handleCenterMouseLeave = (slotIndex, e) => {
      // Ignore if moving within the same center cassette
      const slot = slots[slotIndex];
      if (slot && e && e.relatedTarget && slot.contains(e.relatedTarget)) {
        return;
      }

      if (slotIndex === activeCenterIndex) {
        cancelOpenPreview();
        isCursorOverCenter = false;
        if (!isCursorOverPreview) {
          scheduleClosePreview(CLOSE_DELAY_MS);
        }
      }
    };

    let lastTouchHandledTime = 0;

    handleSlotAction = (slotIndex, isTouch) => {
      if (isDragging || hasDragged) return;

      const projectIndex = ((slotIndex % NUM_PROJECTS) + NUM_PROJECTS) % NUM_PROJECTS;
      const project = CASSETTE_PROJECTS[projectIndex];

      if (isTouch) {
        // ------------------------------------------------------------------
        // MOBILE / TOUCH BEHAVIOUR
        // - Tapping a cassette should open its preview.
        // - The selected cassette should move to the centre and expand.
        // - Tapping the selected cassette again, or tapping outside, should close it.
        // - Tapping a different cassette should close current and open newly selected.
        // ------------------------------------------------------------------
        const isThisCenterAndOpen = (slotIndex === activeCenterIndex && isPreviewOpen && activeProjectId === project.id);

        if (isThisCenterAndOpen) {
          closeExpandedPreview();
        } else {
          cancelOpenPreview();
          cancelClosePreview();
          targetIndex = slotIndex;
          openExpandedPreview(project, false);
        }
      } else {
        // ------------------------------------------------------------------
        // DESKTOP BEHAVIOUR
        // - Preserve existing hover-to-preview behaviour.
        // - Keep click behaviour for opening the full case study.
        // ------------------------------------------------------------------
        cancelOpenPreview();
        cancelClosePreview();
        if (slotIndex === activeCenterIndex) {
          if (project.caseStudyUrl && project.caseStudyUrl !== '#') {
            window.location.href = project.caseStudyUrl;
          } else {
            openExpandedPreview(project, true);
          }
        } else {
          targetIndex = slotIndex;
        }
      }
    };

    slots.forEach((slot, i) => {
      const projectIndex = ((i % NUM_PROJECTS) + NUM_PROJECTS) % NUM_PROJECTS;
      const project = CASSETTE_PROJECTS[projectIndex];

      // Mouseenter on slot: ONLY active if this slot is the currently expanded center cassette on mouse
      slot.addEventListener('mouseenter', () => {
        if (lastPointerType === 'mouse' && i === activeCenterIndex && slot.classList.contains('is-center')) {
          handleCenterMouseEnter(i);
        }
      });

      // Mousemove on slot: ensures center cassette activates even if cursor was resting during scroll
      slot.addEventListener('mousemove', () => {
        if (lastPointerType === 'mouse' && i === activeCenterIndex && slot.classList.contains('is-center')) {
          if (!isCursorOverCenter) {
            handleCenterMouseEnter(i);
          }
        }
      });

      // Mouseleave on slot: ONLY active for center cassette
      slot.addEventListener('mouseleave', (e) => {
        if (lastPointerType === 'mouse' && i === activeCenterIndex) {
          handleCenterMouseLeave(i, e);
        }
      });

      // Front face: visible only when expanded in center
      const front = slot.querySelector('.cassette-front');
      if (front) {
        front.addEventListener('mouseenter', () => {
          if (lastPointerType === 'mouse' && i === activeCenterIndex && slot.classList.contains('is-center')) {
            handleCenterMouseEnter(i);
          }
        });
        front.addEventListener('mouseleave', (e) => {
          if (lastPointerType === 'mouse' && i === activeCenterIndex) {
            handleCenterMouseLeave(i, e);
          }
        });
      }

      // Touch tap handler on mobile: instant 0ms response without double-tap
      slot.addEventListener('touchend', (e) => {
        if (isDragging || hasDragged || touchMoved) return;
        const clientX = e.changedTouches[0]?.clientX ?? 0;
        const clientY = e.changedTouches[0]?.clientY ?? 0;
        const deltaX = Math.abs(clientX - touchStartX);
        const deltaY = Math.abs(clientY - touchStartY);
        if (deltaX > 8 || deltaY > 8) return;

        e.preventDefault();
        lastTouchHandledTime = Date.now();
        handleSlotAction(i, true);
      }, { passive: false });

      // Click handler: handles desktop clicks & touch fallback
      slot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (Date.now() - lastTouchHandledTime < 450) return;
        if (isDragging || hasDragged) return;

        const isTouch = (lastPointerType === 'touch') || (e.pointerType === 'touch') || window.matchMedia('(pointer: coarse)').matches;
        handleSlotAction(i, isTouch);
      });

      slot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          cancelOpenPreview();
          cancelClosePreview();
          targetIndex = i;
          openExpandedPreview(project, true);
        }
      });
    });

    // ------------------------------------------------------------------------
    // 2. Navigation Button Controls
    // ------------------------------------------------------------------------
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        cancelOpenPreview();
        targetIndex = Math.round(targetIndex) - 1;
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        cancelOpenPreview();
        targetIndex = Math.round(targetIndex) + 1;
      });
    }

    // ------------------------------------------------------------------------
    // 3. Mouse Click-and-Drag
    // ------------------------------------------------------------------------
    stage.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      cancelOpenPreview();
      cancelClosePreview();
      isDragging = true;
      hasDragged = false;
      stage.classList.add('is-dragging');
      dragStartX = e.clientX;
      dragStartIndex = currentIndex;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX;
      if (Math.abs(deltaX) > 5) {
        hasDragged = true;
      }
      const metrics = getMetrics();
      const deltaIndex = deltaX / metrics.dSide;
      currentIndex = dragStartIndex - deltaIndex;
      targetIndex = currentIndex;
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      stage.classList.remove('is-dragging');
      targetIndex = Math.round(currentIndex);
      setTimeout(() => {
        isDragging = false;
        hasDragged = false;
      }, 60);
    });

    // ------------------------------------------------------------------------
    // 4. Mobile / Tablet Touch Gestures (Direction-Locked Touch Scrolling)
    // ------------------------------------------------------------------------
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isHorizontalTouch = false;
    let touchMoved = false;

    stage.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        dragStartIndex = currentIndex;
        isHorizontalTouch = false;
        touchMoved = false;
        isDragging = false;
        hasDragged = false;
      }
    }, { passive: true });

    stage.addEventListener('touchmove', (e) => {
      if (e.touches.length === 0) return;
      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      const deltaX = clientX - touchStartX;
      const deltaY = clientY - touchStartY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (!touchMoved && (absX > 7 || absY > 7)) {
        touchMoved = true;
        if (absX > absY) {
          // Horizontal carousel swipe
          isHorizontalTouch = true;
          isDragging = true;
          hasDragged = true;
          cancelOpenPreview();
          cancelClosePreview();
        } else {
          // Vertical page scroll: don't lock
          isHorizontalTouch = false;
          isDragging = false;
          return;
        }
      }

      if (isHorizontalTouch && isDragging) {
        if (e.cancelable) e.preventDefault();
        const metrics = getMetrics();
        const deltaIndex = deltaX / metrics.dSide;
        currentIndex = dragStartIndex - deltaIndex;
        targetIndex = currentIndex;
      }
    }, { passive: false });

    stage.addEventListener('touchend', () => {
      if (isDragging) {
        targetIndex = Math.round(currentIndex);
        setTimeout(() => {
          isDragging = false;
          hasDragged = false;
          touchMoved = false;
        }, 50);
      } else {
        isDragging = false;
        hasDragged = false;
      }
    });

    // ------------------------------------------------------------------------
    // 5. Trackpad & Mouse Wheel Scrolling
    // ------------------------------------------------------------------------
    let wheelTimeout = null;
    stage.addEventListener('wheel', (e) => {
      cancelOpenPreview();
      const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = isHorizontal ? e.deltaX : (e.shiftKey ? e.deltaY : (Math.abs(e.deltaY) > 0 ? e.deltaY * 0.75 : 0));

      if (delta !== 0) {
        e.preventDefault();
        const metrics = getMetrics();
        targetIndex += (delta / metrics.dSide) * 0.35;

        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          targetIndex = Math.round(targetIndex);
        }, 180);
      }
    }, { passive: false });

    // ------------------------------------------------------------------------
    // 6. Keyboard Accessibility (Left & Right Arrow Keys)
    // ------------------------------------------------------------------------
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        cancelOpenPreview();
        targetIndex = Math.round(targetIndex) + 1;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        cancelOpenPreview();
        targetIndex = Math.round(targetIndex) - 1;
      }
    });

    // ------------------------------------------------------------------------
    // 7. Freelance Apparel Project Integration: Satyajit Ray T-Shirt
    // ------------------------------------------------------------------------
    const SATYAJIT_RAY_PROJECT = {
      id: "satyajit-ray-tshirt",
      badge: "FREELANCE PROJECT",
      title: "SATYAJIT RAY — T-SHIRT DESIGN",
      artist: "INSPIRATION: SATYAJIT RAY",
      category: "APPAREL & MERCHANDISE DESIGN",
      type: "Freelance Project",
      role: "Apparel Graphic Design",
      software: "Hand Illustration & Bengali Typography",
      shortDescription: "A T-shirt design inspired by Satyajit Ray, featuring Bengali typography and a hand-drawn character illustration.",
      metadataLine: "FREELANCE PROJECT · APPAREL & MERCHANDISE DESIGN · SATYAJIT RAY",
      artworkImage: "assets/images/satyajit-ray-tshirt.jpg",
      previewArtworkImage: "assets/images/satyajit-ray-tshirt.jpg",
      caseStudyUrl: "case-study-satyajit-ray-tshirt.html"
    };

    const freelanceCard = document.getElementById('satyajit-ray-tshirt-card');
    if (freelanceCard) {
      freelanceCard.addEventListener('click', (e) => {
        if (e.target.closest('#freelance-direct-case-link')) {
          return;
        }
        e.preventDefault();
        openExpandedPreview(SATYAJIT_RAY_PROJECT, true);
      });

      freelanceCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.closest('#freelance-direct-case-link')) return;
          e.preventDefault();
          openExpandedPreview(SATYAJIT_RAY_PROJECT, true);
        }
      });
    }

    // Expose clean helper for verification and integration
    window.__cassetteCarousel = {
      setIndex: (i) => {
        targetIndex = i;
        currentIndex = i;
        render();
      },
      getIndex: () => currentIndex,
      getCenterIndex: () => activeCenterIndex,
      getProjects: () => CASSETTE_PROJECTS,
      getFreelanceProject: () => SATYAJIT_RAY_PROJECT,
      openPreview: (p) => openExpandedPreview(p, true)
    };
  };

  initCassetteCarousel();

  // ==========================================================================
  // WEB & INTERACTIVE: EDITORIAL SCROLL REVEAL OBSERVER
  // - Clean, performant IntersectionObserver
  // - Subtle upward rise and opacity fade
  // - Automatic fallback if IntersectionObserver is unavailable
  // ==========================================================================
  const initWebInteractiveReveals = () => {
    const reveals = document.querySelectorAll('.web-reveal, .video-reveal, .contact-reveal');
    if (!reveals.length) return;

    if (!('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  };

  initWebInteractiveReveals();

  // ==========================================================================
  // 7. VIDEO GALLERY CONTROLLER & DATA REGISTRY
  // - Centralized data registry for future video & grade additions
  // - Inline 16:9 responsive video player
  // - Dedicated cinema viewing overlay with mutual exclusion (no concurrent audio)
  // - Interactive before/after split slider for colour grading
  // - Keyboard accessibility (Esc to close)
  // ==========================================================================
  window.VIDEO_GALLERY_DATA = {
    featured: {
      title: "The Last Goodbye",
      format: "Short Film",
      creator: "Neha",
      youtubeUrl: "https://youtu.be/tWZCrcvNcQo?si=FQqsfbGpHIR4OZ13",
      youtubeId: "tWZCrcvNcQo",
      thumbnail: "assets/images/the-last-goodbye-thumbnail.jpg",
      aspectRatio: "16:9",
      description: "A short film exploring memory, departure, and the quiet spaces left behind.",
      role: "",
      year: "",
      software: "",
      credits: "Creator: Neha"
    },
    // Video Editing Projects (Add new projects here; cards will render automatically)
    editing: [
      {
        id: "musichead",
        title: "Musichead",
        format: "VIDEO EDITING",
        software: "CapCut",
        src: "assets/videos/musichead.mp4",
        aspectRatio: "16:9",
        description: "A dynamic video edit created in CapCut."
      }
    ],
    // Colour Grading Studies (Add new grading items here)
    colourGrading: [
      /* Example with Before/After split slider:
      {
        title: "Low-Key Narrative Grade",
        format: "Colour Grading Study",
        gradedImage: "assets/images/grade-after-01.jpg",
        originalImage: "assets/images/grade-before-01.jpg", // optional: triggers slider if present
        software: "DaVinci Resolve Studio",
        description: "Contrast curve modeling and skin-tone preservation in shadow."
      }
      */
    ],
    // Visual Experiments (Section remains hidden until items are added here)
    experiments: [
      /* Example:
      {
        title: "Anamorphic Flare Study",
        format: "Camera Test",
        aspectRatio: "2.39:1",
        thumbnail: "assets/images/exp-01.jpg",
        youtubeId: "...",
        description: "Optical test on streak flare behavior."
      }
      */
    ]
  };

  const initVideoGalleryController = () => {
    const videoSection = document.getElementById('video-gallery');
    if (!videoSection) return;

    // Elements
    const posterLayer = document.getElementById('featured-poster-layer');
    const playBtn = document.getElementById('featured-play-btn');
    const iframeSlot = document.getElementById('featured-iframe-slot');
    const cinemaModal = document.getElementById('video-cinema-modal');
    const cinemaIframe = document.getElementById('cinema-iframe');
    const cinemaCloseBtn = document.getElementById('cinema-close-btn');
    const cinemaBackdrop = document.getElementById('cinema-backdrop');
    const cinemaTitle = document.getElementById('cinema-modal-title');
    const cinemaBadge = document.getElementById('cinema-modal-badge');
    const cinemaCaption = document.getElementById('cinema-modal-caption');
    const cinemaExternalLink = document.getElementById('cinema-external-link');
    const featuredCinemaTrigger = document.getElementById('featured-cinema-trigger');

    // 1. Featured Video Inline Playback
    let isInlinePlaying = false;

    const stopInlineVideo = () => {
      if (iframeSlot) {
        iframeSlot.innerHTML = '';
        iframeSlot.setAttribute('aria-hidden', 'true');
      }
      if (posterLayer) {
        posterLayer.classList.remove('is-hidden');
      }
      isInlinePlaying = false;
    };

    const startInlineVideo = () => {
      if (!iframeSlot || !posterLayer) return;
      // Close cinema modal if open to prevent simultaneous audio
      closeCinemaModal();
      // Pause any active editing video
      const nativeVid = document.getElementById('editing-video-01');
      if (nativeVid && !nativeVid.paused) {
        nativeVid.pause();
      }

      const ytid = window.VIDEO_GALLERY_DATA.featured.youtubeId || 'tWZCrcvNcQo';
      iframeSlot.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${ytid}?autoplay=1&rel=0&modestbranding=1" title="The Last Goodbye — A Short Film by Neha" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      iframeSlot.setAttribute('aria-hidden', 'false');
      posterLayer.classList.add('is-hidden');
      isInlinePlaying = true;
    };

    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startInlineVideo();
      });
    }

    if (posterLayer) {
      posterLayer.addEventListener('click', () => {
        startInlineVideo();
      });
      posterLayer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startInlineVideo();
        }
      });
    }

    // 2. Cinema Modal Controls
    const openCinemaModal = (item) => {
      if (!cinemaModal || !cinemaIframe) return;

      // Stop inline playback and native editing video
      stopInlineVideo();
      const nativeVid = document.getElementById('editing-video-01');
      if (nativeVid && !nativeVid.paused) {
        nativeVid.pause();
      }

      const title = item.title || 'Video Player';
      const badge = item.format || 'NOW SCREENING';
      const caption = item.description || (item.creator ? `Creator: ${item.creator}` : '');
      const url = item.youtubeUrl || (item.youtubeId ? `https://youtu.be/${item.youtubeId}` : '#');
      const embedSrc = item.youtubeId 
        ? `https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1&rel=0&modestbranding=1`
        : (item.videoUrl || '');

      if (cinemaTitle) cinemaTitle.textContent = title;
      if (cinemaBadge) cinemaBadge.textContent = badge;
      if (cinemaCaption) cinemaCaption.textContent = caption;
      if (cinemaExternalLink) {
        cinemaExternalLink.href = url;
        cinemaExternalLink.style.display = url !== '#' ? 'inline-flex' : 'none';
      }

      cinemaIframe.src = embedSrc;
      cinemaModal.classList.add('is-open');
      cinemaModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('cinema-modal-open');

      if (cinemaCloseBtn) cinemaCloseBtn.focus();
    };

    const closeCinemaModal = () => {
      if (!cinemaModal || !cinemaIframe) return;
      if (!cinemaModal.classList.contains('is-open')) return;

      cinemaIframe.src = ''; // Immediately halts playback & audio
      cinemaModal.classList.remove('is-open');
      cinemaModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('cinema-modal-open');
    };

    if (featuredCinemaTrigger) {
      featuredCinemaTrigger.addEventListener('click', () => {
        openCinemaModal(window.VIDEO_GALLERY_DATA.featured);
      });
    }

    if (cinemaCloseBtn) {
      cinemaCloseBtn.addEventListener('click', closeCinemaModal);
    }

    if (cinemaBackdrop) {
      cinemaBackdrop.addEventListener('click', closeCinemaModal);
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && cinemaModal && cinemaModal.classList.contains('is-open')) {
        closeCinemaModal();
      }
    });

    // 3. Video Editing Native Player Controller
    const initEditingVideoPlayers = () => {
      const vid01 = document.getElementById('editing-video-01');
      const overlay01 = document.getElementById('editing-overlay-01');
      const stage01 = document.getElementById('editing-stage-01');

      if (!vid01) return;

      const playVid01 = () => {
        // Halt any playing featured YouTube video or cinema modal
        stopInlineVideo();
        closeCinemaModal();

        vid01.controls = true;
        if (overlay01) overlay01.classList.add('is-hidden');
        vid01.play().catch(() => {});
      };

      if (overlay01) {
        overlay01.addEventListener('click', (e) => {
          e.stopPropagation();
          playVid01();
        });
        overlay01.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            playVid01();
          }
        });
      }

      if (stage01) {
        stage01.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (vid01.paused) {
              e.preventDefault();
              playVid01();
            }
          }
        });
      }

      vid01.addEventListener('play', () => {
        stopInlineVideo();
        closeCinemaModal();
      });

      vid01.addEventListener('ended', () => {
        if (overlay01) overlay01.classList.remove('is-hidden');
      });
    };

    const renderEditingGrid = () => {
      initEditingVideoPlayers();
    };

    // 4. Dynamic Colour Grading Rendering & Split Slider Engine
    const renderColourGrading = () => {
      const container = document.getElementById('video-grading-container');
      if (!container) return;

      const items = window.VIDEO_GALLERY_DATA.colourGrading || [];
      if (items.length === 0) {
        container.innerHTML = `
          <div class="video-curation-slate">
            <div class="slate-header">
              <span class="slate-film-dot" aria-hidden="true"></span>
              <span class="slate-film-text">DA VINCI RESOLVE &amp; PREMIERE PIPELINE</span>
              <span class="slate-code">LUT ARCHIVE // 01</span>
            </div>
            <div class="slate-body">
              <h4 class="slate-title">Colour Grading Studies In Preparation</h4>
              <p class="slate-desc">
                Before-and-after look comparisons, logarithmic transform curves, and film emulation studies are currently being assembled for gallery exhibition.
              </p>
              <div class="slate-tags">
                <span class="slate-tag">REC.709 TRANSFORMS</span>
                <span class="slate-tag">SPLIT-TONING STUDIES</span>
                <span class="slate-tag">COLOR TIMING</span>
                <span class="slate-tag">DAVINCI RESOLVE</span>
              </div>
            </div>
          </div>
        `;
        return;
      }

      container.innerHTML = items.map((item, idx) => {
        const hasBefore = Boolean(item.originalImage);
        return `
          <div class="grade-slider-card" data-grade-index="${idx}">
            <div class="grade-slider-stage" id="grade-stage-${idx}">
              <img src="${item.gradedImage}" alt="${item.title} Graded" class="grade-img grade-img-after">
              ${hasBefore ? `
                <div class="grade-clipped-layer" id="grade-clip-${idx}" style="width: 50%;">
                  <img src="${item.originalImage}" alt="${item.title} Original" class="grade-img grade-img-before">
                  <span class="grade-badge badge-before">ORIGINAL / REC.709</span>
                </div>
                <div class="grade-divider-line" id="grade-line-${idx}" style="left: 50%;">
                  <div class="grade-handle-knob" role="slider" aria-label="Color grade comparison slider" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" tabindex="0">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="15 18 9 12 15 6"></polyline>
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </div>
                </div>
              ` : ''}
              <span class="grade-badge badge-after">FINAL GRADE</span>
            </div>
            <div class="grade-info-row">
              <div class="grade-info-left">
                <span class="video-card-tag">${item.format || 'Colour Grading Study'}</span>
                <h4 class="video-card-title" style="margin-top: 4px; margin-bottom: 4px;">${item.title}</h4>
                ${item.description ? `<p class="video-card-desc">${item.description}</p>` : ''}
              </div>
              ${item.software ? `
                <div class="grade-info-right">
                  <span class="pill-label">SOFTWARE</span>
                  <span class="pill-value">${item.software}</span>
                </div>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');

      // Wire interactive split sliders for items with both before & after images
      items.forEach((item, idx) => {
        if (!item.originalImage) return;
        const stage = document.getElementById(`grade-stage-${idx}`);
        const clip = document.getElementById(`grade-clip-${idx}`);
        const line = document.getElementById(`grade-line-${idx}`);
        const knob = line ? line.querySelector('.grade-handle-knob') : null;
        if (!stage || !clip || !line) return;

        let isDragging = false;

        const updateSlider = (clientX) => {
          const rect = stage.getBoundingClientRect();
          const offsetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
          const pct = (offsetX / rect.width) * 100;
          clip.style.width = `${pct}%`;
          line.style.left = `${pct}%`;
          if (knob) knob.setAttribute('aria-valuenow', Math.round(pct));
        };

        stage.addEventListener('mousedown', (e) => {
          isDragging = true;
          updateSlider(e.clientX);
        });

        window.addEventListener('mousemove', (e) => {
          if (!isDragging) return;
          updateSlider(e.clientX);
        });

        window.addEventListener('mouseup', () => {
          isDragging = false;
        });

        // Touch support for mobile
        stage.addEventListener('touchstart', (e) => {
          if (e.touches && e.touches[0]) {
            isDragging = true;
            updateSlider(e.touches[0].clientX);
          }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
          if (!isDragging || !e.touches || !e.touches[0]) return;
          updateSlider(e.touches[0].clientX);
        }, { passive: true });

        window.addEventListener('touchend', () => {
          isDragging = false;
        });

        // Keyboard support (Left / Right arrow keys)
        if (knob) {
          knob.addEventListener('keydown', (e) => {
            let current = parseFloat(line.style.left) || 50;
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              current = Math.max(0, current - 5);
              clip.style.width = `${current}%`;
              line.style.left = `${current}%`;
              knob.setAttribute('aria-valuenow', Math.round(current));
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              current = Math.min(100, current + 5);
              clip.style.width = `${current}%`;
              line.style.left = `${current}%`;
              knob.setAttribute('aria-valuenow', Math.round(current));
            }
          });
        }
      });
    };

    // 5. Dynamic Visual Experiments Rendering (Only displayed when items exist)
    const renderExperiments = () => {
      const section = document.getElementById('video-subsection-experiments');
      const container = document.getElementById('video-experiments-grid');
      if (!section || !container) return;

      const items = window.VIDEO_GALLERY_DATA.experiments || [];
      if (items.length === 0) {
        section.style.display = 'none'; // Strictly hidden when empty
        return;
      }

      section.style.display = 'block';
      container.innerHTML = items.map((item, idx) => `
        <article class="video-card" data-exp-index="${idx}">
          <div class="video-card-thumb-wrap" role="button" tabindex="0" aria-label="View ${item.title}" style="aspect-ratio: ${item.aspectRatio === '2.39:1' ? '2.39 / 1' : '16 / 9'};">
            <img src="${item.thumbnail}" alt="${item.title} Experiment Preview" class="video-card-thumb" loading="lazy">
            <div class="video-card-play-overlay">
              <span class="play-btn-circle" style="width: 52px; height: 52px;">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <polygon points="6 3 20 12 6 21 6 3"></polygon>
                </svg>
              </span>
            </div>
          </div>
          <div class="video-card-body">
            <div class="video-card-meta">
              <span class="video-card-tag">${item.format || 'Visual Experiment'}</span>
              ${item.aspectRatio ? `<span class="pill-value" style="font-size: 10px; color: rgba(255,255,255,0.45); font-family: monospace;">${item.aspectRatio}</span>` : ''}
            </div>
            <h4 class="video-card-title">${item.title}</h4>
            ${item.description ? `<p class="video-card-desc">${item.description}</p>` : ''}
          </div>
        </article>
      `).join('');

      container.querySelectorAll('.video-card').forEach((card, idx) => {
        const item = items[idx];
        const thumb = card.querySelector('.video-card-thumb-wrap');
        if (thumb) {
          const handler = () => openCinemaModal(item);
          thumb.addEventListener('click', handler);
          thumb.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handler();
            }
          });
        }
      });
    };

    // Initial Dynamic Renders
    renderEditingGrid();
    renderColourGrading();
    renderExperiments();

    // Expose API for external additions and verification
    window.VIDEO_GALLERY_API = {
      renderEditing: renderEditingGrid,
      renderColourGrading: renderColourGrading,
      renderExperiments: renderExperiments,
      openCinema: openCinemaModal,
      closeCinema: closeCinemaModal
    };
  };

  initVideoGalleryController();

  // ==========================================================================
  // 8. BACK TO TOP CONTROLLER
  // - Smoothly scrolls to the top of the page / hero section
  // - Respects prefers-reduced-motion
  // ==========================================================================
  const initBackToTop = () => {
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (!backToTopBtn) return;

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: 0,
        behavior: isReduced ? 'auto' : 'smooth'
      });
      const hero = document.getElementById('hero') || document.querySelector('.hero-section');
      if (hero) {
        hero.setAttribute('tabindex', '-1');
        hero.focus({ preventScroll: true });
      }
    });
  };

  initBackToTop();
});
