"use strict";

const titleElement = document.getElementById("typewriter-text");
const descriptionElement = document.getElementById("typewriter-description");

const titleText = "Hi! I'm Dyllan Evans";
const descriptionText = "Digital Artist & Frontend Developer";

function typeText(element, text, speed, callback) {
  let characterIndex = 0;

  function typeNextCharacter() {
    if (characterIndex < text.length) {
      element.textContent += text[characterIndex];
      characterIndex++;

      setTimeout(typeNextCharacter, speed);
    } else if (callback) {
      callback();
    }
  }

  typeNextCharacter();
}

typeText(titleElement, titleText, 100, () => {
  typeText(descriptionElement, descriptionText, 40);
});

const icons = document.querySelectorAll(".contact a img");

icons.forEach((icon) => {
  icon.addEventListener("mouseover", () => {
    icon.style.transform = "scale(1.1)";
  });

  icon.addEventListener("mouseout", () => {
    icon.style.transform = "scale(1)";
  });
});

const skillTags = document.querySelectorAll(".skill-list li");

skillTags.forEach((tag) => {
  tag.addEventListener("mouseenter", () => {
    tag.style.transform = "scale(1.1)";
  });

  tag.addEventListener("mouseleave", () => {
    tag.style.transform = "scale(1)";
  });
});

const featuredProjects = [
  {
    title: "Line Notes",
    description:
      "An interactive web project that visualized ancestory through technology using Three.js, WebGL, and Frontend development.",
    image: "img/linenotes.png",
    alt: "Line Notes project preview",
    link: "linenotes.html",
  },
  {
    title: "The Art Market",
    description: "Capstone Project 2025-2026",
    image: "img/stillfromproject4.jpg",
    alt: "Still from You Are the Player",
    link: "videoart.html",
  },
  {
    title: "",
    description:
      "An interactive Three.js portfolio featuring 3D models, video work, music, and an explorable digital island.",
    image: "img/stillfromproject3.jpg",
    alt: "Preview of the 3D Portfolio project",
    link: "interactive.html",
  },
];

const featuredSection = document.querySelector(".home-featured");
const featuredCard = document.querySelector(".featured-project");

const featuredImage = document.querySelector("#featured-image");
const featuredTitle = document.querySelector("#featured-title");
const featuredDescription = document.querySelector("#featured-description");
const featuredLink = document.querySelector("#featured-link");

const previousButton = document.querySelector(".previous-project");
const nextButton = document.querySelector(".next-project");
const dotsContainer = document.querySelector(".slider-dots");

let currentProject = 0;
let touchStartX = 0;
let touchEndX = 0;

function createDots() {
  featuredProjects.forEach((project, index) => {
    const dot = document.createElement("button");

    dot.type = "button";
    dot.classList.add("slider-dot");
    dot.setAttribute("aria-label", `Show featured project ${index + 1}`);

    dot.addEventListener("click", () => {
      showProject(index);
    });

    dotsContainer.appendChild(dot);
  });
}

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
}

function handleTouchMove(event) {
  touchEndX = event.touches[0].clientX;
}

function handleTouchEnd() {
  handleSwipe();
}

featuredCard.addEventListener("touchstart", handleTouchStart);
featuredCard.addEventListener("touchmove", handleTouchMove);
featuredCard.addEventListener("touchend", handleTouchEnd);


function updateDots() {
  const dots = document.querySelectorAll(".slider-dot");

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentProject);
  });
}

function updateProjectContent() {
  const project = featuredProjects[currentProject];

  featuredImage.src = project.image;
  featuredImage.alt = project.alt;

  featuredTitle.textContent = project.title;
  featuredDescription.textContent = project.description;
  featuredLink.href = project.link;

  updateDots();
}

function showProject(index) {
  currentProject = index;

  if (currentProject < 0) {
    currentProject = featuredProjects.length - 1;
  }

  if (currentProject >= featuredProjects.length) {
    currentProject = 0;
  }

  window.setTimeout(() => {
    updateProjectContent();
  }, 200);
}

function showPreviousProject() {
  showProject(currentProject - 1);
}

function showNextProject() {
  showProject(currentProject + 1);
}

function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;
  const minimumSwipeDistance = 50;

  if (swipeDistance > minimumSwipeDistance) {
    showPreviousProject();
  }

  if (swipeDistance < -minimumSwipeDistance) {
    showNextProject();
  }
}

previousButton.addEventListener("click", showPreviousProject);
nextButton.addEventListener("click", showNextProject);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    showPreviousProject();
  }

  if (event.key === "ArrowRight") {
    showNextProject();
  }
});

createDots();
updateProjectContent();
