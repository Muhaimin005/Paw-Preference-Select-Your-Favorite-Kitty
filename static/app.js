document.addEventListener("DOMContentLoaded", () => {
  let cats = [];
let index = 0;
let startX = 0;
let currentX = 0;
let isDragging = false;

const SWIPE_THRESHOLD = 50;
const card = document.querySelector(".card");

// Fetch all cats
fetch("/api/cats")
  .then(res => res.json())
  .then(data => {
    cats = data;
    preloadAllImages(cats).then(() => {
      document.getElementById("loading").style.display = "none";
      document.querySelector(".app").style.display = "block";
      showCat();
    });
  });

// Preload all images
function preloadAllImages(catList) {
  const promises = catList.map(cat => {
    return new Promise(resolve => {
      const img = new Image();
      img.src = cat.url;
      img.onload = resolve;
      img.onerror = resolve;
    });
  });
  return Promise.all(promises);
}

// Show current cat
function showCat() {
  document.getElementById("catImage").src = cats[index].url;
}

document.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});


document.addEventListener("contextmenu", e => e.preventDefault());

function swipe(direction) {
  const currentCat = cats[index];
  // Save likes in frontend
  if (!window.likedCats) window.likedCats = [];
  if (direction === "right") window.likedCats.push(currentCat);

  index++;
  if (index >= cats.length) {
    showResults();
  } else {
    showCat();
  }
}

function getX(event) {
  return event.touches ? event.touches[0].clientX : event.clientX;
}

function startDrag(e) {
  isDragging = true;
  startX = getX(e);
  card.classList.remove("animate");
  card.classList.add("dragging");
}

function onDrag(e) {
  if (!isDragging) return;

  currentX = getX(e);
  const diff = currentX - startX;

  const rotate = diff / 15;
  card.style.transform = `translateX(${diff}px) rotate(${rotate}deg)`;
}

function endDrag() {
  if (!isDragging) return;
  isDragging = false;

  const diff = currentX - startX;
  card.classList.remove("dragging");
  card.classList.add("animate");

  if (Math.abs(diff) > SWIPE_THRESHOLD) {
    swipeCard(diff > 0 ? "right" : "left");
  } else {
    card.style.transform = "translateX(0) rotate(0)";
  }
}

function swipeCard(direction) {
  const screenWidth = window.innerWidth;
  const moveX = direction === "right" ? screenWidth : -screenWidth;

  card.style.transform = `translateX(${moveX}px) rotate(${direction === "right" ? 25 : -25}deg)`;

  setTimeout(() => {
    swipe(direction);      // your existing logic
    resetCard();
  }, 300);
}

function resetCard() {
  card.classList.remove("animate");
  card.style.transform = "translateX(0) rotate(0)";
}

// Touch
card.addEventListener("touchstart", startDrag);
card.addEventListener("touchmove", onDrag);
card.addEventListener("touchend", endDrag);

// Mouse
card.addEventListener("mousedown", startDrag);
document.addEventListener("mousemove", onDrag);
document.addEventListener("mouseup", endDrag);

// Prevent image drag
document.getElementById("catImage").addEventListener("dragstart", e => e.preventDefault());


function showResults() {
  document.querySelector(".app").style.display = "none";

  const results = document.getElementById("results");
  const grid = document.getElementById("likedGrid");
  const count = document.getElementById("likeCount");

  results.classList.remove("hidden");
  count.textContent = window.likedCats.length;

  grid.innerHTML = "";
  window.likedCats.forEach(cat => {
    const img = document.createElement("img");
    img.src = cat.url;
    grid.appendChild(img);
  });
}

document.getElementById("restartBtn").addEventListener("click", restartApp);

function restartApp() {
  index = 0;
  window.likedCats = [];

  document.getElementById("results").classList.add("hidden");
  document.querySelector(".app").style.display = "block";

  resetCard();   // from Tinder animation
  showCat();
}
});




