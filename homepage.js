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
    image: "img/linenotesbread.png",
    alt: "Line Notes project preview",
    link: "linenotes.html",
  },
  {
    title: "The Art Market",
    description:
      "Capstone Project 2026, Planned and built a full stack web system with the simple idea of growth.",
    image: "img/artmarket.png",
    alt: "The Art Market",
    link: "videoart.html",
  },
  {
    title: "Visual Field",
    description:
      "Audiences shape a dynamic color space rendered with lines evoking topographical maps and nautical charts. Guided by visible gestures, participants expand, contract, and manipulate the central orb, engaging in a real-time dialogue of action and reflection.",
    image: "img/Dyllan.png",
    alt: "Visual Field project preview",
    link: "interactive.html",
  },
];

const featuredImage = document.querySelector("#featured-image");
const featuredTitle = document.querySelector("#featured-title");
const featuredDescription = document.querySelector("#featured-description");
const featuredLink = document.querySelector("#featured-link");

const previousButton = document.querySelector(".previous-project");
const nextButton = document.querySelector(".next-project");
const dotsContainer = document.querySelector(".slider-dots");

// Pick a random project whenever the page loads
let currentProject = Math.floor(Math.random() * featuredProjects.length);

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
