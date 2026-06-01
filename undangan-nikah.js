// ======== Carousel/Slider Functionality ========
const carouselContainer = document.querySelector(".carousel-container");
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const currentSlideSpan = document.querySelector(".current-slide");
const bgMusic = document.getElementById("bgMusic");

let currentSlide = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;

// ======== Initialize Carousel ========
const initCarousel = () => {
  updateDots();
  updateSlideCounter();
  const totalSpan = document.querySelector(".total-slides");
  if (totalSpan) totalSpan.textContent = slides.length;
};

// ======== Update Dots ========
const updateDots = () => {
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
};

// ======== Update Slide Counter ========
const updateSlideCounter = () => {
  if (currentSlideSpan) {
    currentSlideSpan.textContent = currentSlide + 1;
  }
};

// ======== Scroll to Slide ========
const scrollToSlide = (slideIndex) => {
  const slideWidth = carouselContainer.clientWidth;
  carouselContainer.scrollLeft = slideIndex * slideWidth;
  currentSlide = slideIndex;
  updateDots();
  updateSlideCounter();
};

// ======== Dot Click Navigation ========
dots.forEach((dot) => {
  dot.addEventListener("click", (e) => {
    const slideIndex = parseInt(e.target.getAttribute("data-slide"));
    scrollToSlide(slideIndex);
  });
});

// ======== Touch Swipe Functionality ========
carouselContainer.addEventListener(
  "touchstart",
  (e) => {
    startX = e.touches[0].clientX;
  },
  false,
);

carouselContainer.addEventListener(
  "touchend",
  (e) => {
    currentX = e.changedTouches[0].clientX;
    handleSwipe();
  },
  false,
);

// ======== Mouse Drag Functionality ========
carouselContainer.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX;
});

carouselContainer.addEventListener("mouseup", (e) => {
  if (!isDragging) return;
  isDragging = false;
  currentX = e.clientX;
  handleSwipe();
});

carouselContainer.addEventListener("mouseleave", () => {
  isDragging = false;
});

// ======== Handle Swipe Logic ========
const handleSwipe = () => {
  const diff = startX - currentX;

  if (Math.abs(diff) > 50) {
    if (diff > 0 && currentSlide < slides.length - 1) {
      // Swipe left - next slide
      scrollToSlide(currentSlide + 1);
    } else if (diff < 0 && currentSlide > 0) {
      // Swipe right - previous slide
      scrollToSlide(currentSlide - 1);
    }
  }
};

// ======== Keyboard Navigation ========
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" && currentSlide < slides.length - 1) {
    scrollToSlide(currentSlide + 1);
  } else if (e.key === "ArrowLeft" && currentSlide > 0) {
    scrollToSlide(currentSlide - 1);
  }
});

// ======== Scroll Listener for Dots Update ========
carouselContainer.addEventListener("scroll", () => {
  const slideWidth = carouselContainer.clientWidth;
  const scrollPosition = carouselContainer.scrollLeft;
  const newSlide = Math.round(scrollPosition / slideWidth);

  if (newSlide !== currentSlide) {
    currentSlide = newSlide;
    updateDots();
    updateSlideCounter();
  }
});

// ======== Background Music Control ========
if (bgMusic) {
  bgMusic.volume = 0.15;
  bgMusic.loop = true;
}

const playAudio = async () => {
  if (!bgMusic) return;
  try {
    await bgMusic.play();
    return true;
  } catch (err) {
    return false;
  }
};

// Try to autoplay on load; if blocked, show a small overlay prompting the user
window.addEventListener("load", async () => {
  const ok = await playAudio();
  if (!ok) {
    // create small unobtrusive prompt
    const prompt = document.createElement("div");
    prompt.className = "audio-prompt";
    prompt.innerHTML =
      '<button class="audio-prompt-btn">▶️ Putar Musik</button>';
    document.body.appendChild(prompt);

    const btn = prompt.querySelector(".audio-prompt-btn");
    btn.addEventListener("click", async () => {
      const success = await playAudio();
      if (success) prompt.remove();
    });
  }
});

// also attempt a single user-click to start music (fallback)
document.addEventListener("click", playAudio, { once: true });

// ======== Page Visibility - Pause Music (disabled to keep audio looping) ========
// intentionally left blank so music keeps looping even when page hidden

// ======== RSVP Button Enhanced Feedback ========
const rsvpButton = document.querySelector(".rsvp-button");
if (rsvpButton) {
  rsvpButton.addEventListener("click", function (e) {
    // Create ripple effect
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.style.position = "absolute";
    ripple.style.borderRadius = "50%";
    ripple.style.backgroundColor = "rgba(255,255,255,0.5)";
    ripple.style.pointerEvents = "none";
    ripple.style.animation = "rippleAnimation 0.6s ease-out";

    this.style.position = "relative";
    this.style.overflow = "hidden";
    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
}

// ======== Confetti on Page Load ========
const createConfetti = () => {
  const colors = ["#f4a78a", "#e8947d", "#d9a696", "#b8756d"];
  const confettiPiece = document.createElement("div");

  confettiPiece.style.position = "fixed";
  confettiPiece.style.width = "10px";
  confettiPiece.style.height = "10px";
  confettiPiece.style.backgroundColor =
    colors[Math.floor(Math.random() * colors.length)];
  confettiPiece.style.borderRadius = "50%";
  confettiPiece.style.pointerEvents = "none";
  confettiPiece.style.left = Math.random() * 100 + "%";
  confettiPiece.style.top = "-10px";
  confettiPiece.style.opacity = Math.random() * 0.5 + 0.5;
  confettiPiece.style.zIndex = "-1";

  document.body.appendChild(confettiPiece);

  const duration = Math.random() * 2 + 2;
  const keyframes = `
    @keyframes fall-${Math.random()} {
      to {
        transform: translateY(${window.innerHeight + 20}px) rotate(360deg);
        opacity: 0;
      }
    }
  `;

  const style = document.createElement("style");
  style.textContent = keyframes;
  document.head.appendChild(style);

  confettiPiece.style.animation = `fall-${Math.random()} ${duration}s ease-in forwards`;

  setTimeout(() => confettiPiece.remove(), duration * 1000);
};

// Spawn confetti occasionally
window.addEventListener("load", () => {
  for (let i = 0; i < 20; i++) {
    setTimeout(createConfetti, i * 50);
  }
});

// ======== Initialize ========
window.addEventListener("load", () => {
  initCarousel();
});
