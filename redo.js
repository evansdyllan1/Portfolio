
"use strict";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const crtMonitor = document.querySelector(".crt-monitor");
const crtScreen = document.querySelector(".crt-screen");
const crtOverlay = document.querySelector(".crt-overlay");
const landingContent = document.querySelector(".landing-content");
const scrollPrompt = document.querySelector(".scroll-prompt");
const workspace = document.querySelector("#workspace");

const projectsButton = document.querySelector("#projects-button");
const aboutButton = document.querySelector("#about-button");
const contactButton = document.querySelector("#contact-button");
const homeButton = document.querySelector("#home-button");

const landingPanel = document.querySelector("#landing-panel");
const panelTitle = document.querySelector("#panel-title");
const panelContent = document.querySelector("#panel-content");
const panelClose = document.querySelector("#panel-close");

const projects = [
  {
    title: "Line Notes",
    description:
      "An interactive web project that visualizes ancestry through technology using Three.js, WebGL, and frontend development.",
    image: "/img/linenotesbread.png",
    alt: "Line Notes project preview",
    link: "/linenotes.html"
  },
  {
    title: "The Art Market",
    description:
      "My 2026 capstone project. A full-stack web system designed around the idea of growth.",
    image: "/img/artmarket.png",
    alt: "The Art Market project preview",
    link: "/art-market.html"
  },
  {
    title: "Visual Field",
    description:
      "An interactive digital artwork where audiences manipulate a dynamic color space through gestures and movement.",
    image: "/img/Dyllan.png",
    alt: "Visual Field project preview",
    link: "/visual-field.html"
  }
];

const projectFolders = document.querySelectorAll(".project-folder");
const projectImage = document.querySelector("#project-image");
const projectTitle = document.querySelector("#project-title");
const projectDescription = document.querySelector("#project-description");
const projectLink = document.querySelector("#project-link");
const fileLabel = document.querySelector(".file-label");

// Update the preview and project details when a folder is selected.
function showProject(index) {
  const project = projects[index];

  projectImage.src = project.image;
  projectImage.alt = project.alt;
  projectTitle.textContent = project.title;
  projectDescription.textContent = project.description;
  projectLink.href = project.link;

  fileLabel.textContent =
    `SELECTED PROJECT / ${String(index + 1).padStart(3, "0")}`;

  projectFolders.forEach((folder, i) => {
    folder.classList.toggle("active", i === index);
    folder.setAttribute("aria-pressed", String(i === index));
  });
}

projectFolders.forEach((folder) => {
  folder.addEventListener("click", () => {
    showProject(Number(folder.dataset.project));
  });
});

// Animate the existing About and Contact popup.
// We can replace this with separate CRT screen states later.
function openPanel(title, content) {
  gsap.killTweensOf(landingPanel);

  panelTitle.textContent = title;
  panelContent.innerHTML = content;
  landingPanel.hidden = false;

  gsap.fromTo(
    landingPanel,
    {
      opacity: 0,
      scale: 0.95,
      y: 12
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.25,
      ease: "power2.out"
    }
  );
}

aboutButton.addEventListener("click", () => {
  openPanel(
    "ABOUT.TXT",
    `<p>Hi! I'm Dyllan Evans, a digital artist and frontend developer.</p>
     <p>I enjoy combining creative coding, interactive experiences, and digital art to build websites that feel playful and personal.</p>`
  );
});

contactButton.addEventListener("click", () => {
  openPanel(
    "CONTACT.TXT",
    `<p>Let's connect!</p>
     <p><a href="mailto:evansdyllan1@gmail.com">Email</a></p>
     <p><a href="https://www.linkedin.com/in/dyllan-evans/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
     <p><a href="https://github.com/evansdyllan1" target="_blank" rel="noopener noreferrer">GitHub</a></p>
     <p><a href="/Resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a></p>`
  );
});

panelClose.addEventListener("click", () => {
  gsap.killTweensOf(landingPanel);

  gsap.to(landingPanel, {
    opacity: 0,
    scale: 0.96,
    duration: 0.18,
    onComplete: () => {
      landingPanel.hidden = true;
    }
  });
});

// --------------------------------------------------
// INTERACTIVE PIXEL BACKGROUND
// --------------------------------------------------

// This is HTML Canvas 2D, not Three.js or GSAP.
// Each pixel is a small rectangle drawn using fillRect().
//
// Canvas drawing reference:
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect

const pixelCanvas = document.querySelector("#pixel-background");
const pixelContext = pixelCanvas.getContext("2d");

const pixelMouse = {
  x: -1000,
  y: -1000
};

let pixelCells = [];
let pixelWidth = 0;
let pixelHeight = 0;

// Change these values to experiment with pixel density and movement.
const pixelSpacing = 9;
const pixelSize = 1;
const pixelRadius = 105;
const pixelResponse = 0.16;

// Match the canvas drawing resolution to the CRT screen.
// devicePixelRatio helps keep the tiny squares sharp.
function resizePixels() {
  const density = Math.min(window.devicePixelRatio || 1, 2);

  pixelWidth = crtScreen.clientWidth;
  pixelHeight = crtScreen.clientHeight;

  pixelCanvas.width = Math.round(pixelWidth * density);
  pixelCanvas.height = Math.round(pixelHeight * density);

  pixelContext.setTransform(density, 0, 0, density, 0, 0);

  pixelCells = [];

  // Nested loops generate evenly spaced pixel coordinates.
  for (let y = 1; y < pixelHeight; y += pixelSpacing) {
    for (let x = 1; x < pixelWidth; x += pixelSpacing) {
      pixelCells.push({
        x,
        y,
        intensity: 0,
        brightness: Math.random()
      });
    }
  }
}

// Convert pointer coordinates from browser space into canvas space.
// This also accounts for the CRT being scaled during scrolling.
crtScreen.addEventListener("pointermove", (event) => {
  const bounds = pixelCanvas.getBoundingClientRect();

  pixelMouse.x =
    (event.clientX - bounds.left) * (pixelWidth / bounds.width);

  pixelMouse.y =
    (event.clientY - bounds.top) * (pixelHeight / bounds.height);
});

crtScreen.addEventListener("pointerleave", () => {
  pixelMouse.x = -1000;
  pixelMouse.y = -1000;
});

// requestAnimationFrame repeatedly draws the background.
// The frame interval below limits drawing to approximately 30 FPS.
//
// Reference:
// https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame

let lastPixelFrame = 0;

function animatePixels(time) {
  requestAnimationFrame(animatePixels);

  if (time - lastPixelFrame < 1000 / 30) return;

  lastPixelFrame = time;

  const bounds = crtScreen.getBoundingClientRect();

  if (bounds.bottom < 0 || bounds.top > window.innerHeight) {
    return;
  }

  pixelContext.clearRect(0, 0, pixelWidth, pixelHeight);

  for (const pixel of pixelCells) {
    // Calculate the distance between this pixel and the mouse.
    // Math.hypot(dx, dy) calculates the length of that distance.
    const distance = Math.hypot(
      pixelMouse.x - pixel.x,
      pixelMouse.y - pixel.y
    );

    // A nearby pixel has a higher target brightness.
    // Pixels outside pixelRadius have a target of zero.
    const target = Math.max(0, 1 - distance / pixelRadius);

    // Gradually move the current brightness toward the target.
    // This is interpolation, which creates the fading trail.
    pixel.intensity +=
      (target - pixel.intensity) * pixelResponse;

    const intensity = pixel.intensity;

    if (intensity > 0.65) {
      pixelContext.fillStyle = "#f9f9f9";
    } else if (intensity > 0.3) {
      pixelContext.fillStyle = "#3a4255";
    } else if (intensity > 0.04) {
      pixelContext.fillStyle = "#7464ff";
    } else {
      pixelContext.fillStyle =
        `rgba(116, 100, 255, ${0.12 + pixel.brightness * 0.35})`;
    }

    const size = pixelSize + intensity * 2;

    pixelContext.fillRect(
      pixel.x,
      pixel.y,
      size,
      size
    );
  }
}

// ResizeObserver redraws the grid if the CRT dimensions change.
// Reference:
// https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
const pixelResizeObserver = new ResizeObserver(resizePixels);

pixelResizeObserver.observe(crtScreen);

resizePixels();
requestAnimationFrame(animatePixels);

// --------------------------------------------------
// GSAP SCROLL-CONTROLLED CRT ZOOM
// --------------------------------------------------

// GSAP ScrollTrigger reference:
// https://gsap.com/docs/v3/Plugins/ScrollTrigger/
//
// pin holds the CRT on screen while scrolling.
// scrub ties the animation's progress to scroll position.
// scale enlarges the CRT instead of using the black shutter.
//
// This is the initial zoom experiment. The workspace still
// follows the pinned section in normal document flow.

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

let transition;

if (!reducedMotion) {
  transition = gsap.timeline({
    defaults: {
      ease: "none"
    },
    scrollTrigger: {
      trigger: ".crt-transition",
      start: "top top",
      end: "+=100%",
      scrub: 0.8,
      pin: ".crt-stage",
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });

  transition
    .to(crtMonitor, {
      scale: 1.4,
      duration: 1
    }, 0)
    .to(landingContent, {
      opacity: 0,
      duration: 0.35
    }, 0.3)
    .to(crtOverlay, {
      opacity: 0,
      duration: 0.4
    }, 0.5)
    .to(scrollPrompt, {
      opacity: 0,
      duration: 0.2
    }, 0);
}

// The Projects button scrolls to the actual workspace position.
// ScrollTrigger adds pin spacing, so we use the element's position
// instead of assuming the end of the animation is the destination.
projectsButton.addEventListener("click", () => {
  landingPanel.hidden = true;

  window.scrollTo({
    top: workspace.getBoundingClientRect().top + window.scrollY,
    behavior: reducedMotion ? "instant" : "smooth"
  });
});

homeButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: reducedMotion ? "instant" : "smooth"
  });
});

showProject(0);
