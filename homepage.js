const featuredProjects = [
    {
        title: "Clippy Is Here to Help",
        description:
            "An interactive Windows-inspired website combining digital art, frontend development, and a playable puzzle.",
        image: "img/stillfromproject1.jpg",
        alt: "Clippy Is Here to Help project preview",
        link: "interactive.html"
    },
    {
        title: "You Are the Player",
        description:
            "A video artwork exploring nostalgia, childhood memories, and the Minecraft end poem.",
        image: "img/stillfromproject4.jpg",
        alt: "Still from You Are the Player",
        link: "videoart.html"
    },
    {
        title: "3D Portfolio",
        description:
            "An interactive Three.js portfolio featuring 3D models, video work, music, and an explorable digital island.",
        image: "img/stillfromproject3.jpg",
        alt: "Preview of the 3D Portfolio project",
        link: "interactive.html"
    }
];

const featuredSection = document.querySelector(".home-featured");
const featuredCard = document.querySelector(".featured-project");

const featuredImage = document.querySelector("#featured-image");
const featuredTitle = document.querySelector("#featured-title");
const featuredDescription = document.querySelector(
    "#featured-description"
);
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
        dot.setAttribute(
            "aria-label",
            `Show featured project ${index + 1}`
        );

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

    featuredCard.classList.add("fade");

    window.setTimeout(() => {
        updateProjectContent();
        featuredCard.classList.remove("fade");
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

featuredSection.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
});

featuredSection.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
});

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