/* ========================================
   Thomas K. Moore — Portfolio Scripts
   ======================================== */

(function () {
  "use strict";

  // --- DOM refs ---
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.getElementById("main-nav");
  const backToTop = document.getElementById("back-to-top");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxPrev = document.querySelector(".lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  // --- Mobile nav toggle ---
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", !expanded);
    mainNav.classList.toggle("open");
  });

  // Close nav when a link is clicked
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      mainNav.classList.remove("open");
    });
  });

  // --- Back to top visibility ---
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  }, { passive: true });

  // --- Gallery filtering ---
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      galleryItems.forEach((item) => {
        if (filter === "all" || item.dataset.category === filter) {
          item.classList.remove("hidden");
        } else {
          item.classList.add("hidden");
        }
      });
    });
  });

  // --- Lightbox ---
  let currentImages = [];
  let currentIndex = 0;

  function getVisibleImages() {
    return Array.from(
      document.querySelectorAll(".gallery-item:not(.hidden) img")
    );
  }

  function openLightbox(img) {
    currentImages = getVisibleImages();
    currentIndex = currentImages.indexOf(img);
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    lightboxImg.src = "";
  }

  function navigate(dir) {
    if (currentImages.length === 0) return;
    currentIndex =
      (currentIndex + dir + currentImages.length) % currentImages.length;
    lightboxImg.src = currentImages[currentIndex].src;
    lightboxImg.alt = currentImages[currentIndex].alt;
  }

  // Open on gallery image click
  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      if (img) openLightbox(img);
    });
  });

  // Close button
  lightboxClose.addEventListener("click", closeLightbox);

  // Click outside image to close
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lightbox-content")) {
      closeLightbox();
    }
  });

  // Prev / Next buttons
  lightboxPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    navigate(-1);
  });
  lightboxNext.addEventListener("click", (e) => {
    e.stopPropagation();
    navigate(1);
  });

  // Keyboard nav
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navigate(-1);
    if (e.key === "ArrowRight") navigate(1);
  });

  // Touch swipe support for lightbox
  let touchStartX = 0;
  lightbox.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) {
      navigate(diff > 0 ? -1 : 1);
    }
  }, { passive: true });
})();
