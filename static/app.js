document.addEventListener("DOMContentLoaded", () => {
  let cats = [];
  let index = 0;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  const SWIPE_THRESHOLD = 50;
  const card = document.querySelector(".card");
  const img = document.getElementById("catImage");

  window.likedCats = [];

  /* ---------------- FETCH & PRELOAD ---------------- */

 const API_BASE = "https://your-flask-api.onrender.com";

fetch(`${API_BASE}/api/cats`)
    .then(res => res.json())
    .then(data => {
      cats = data;
      preloadImages(cats).then(() => {
        document.getElementById("loading").style.display = "none";
        document.querySelector(".app").style.display = "block";
        showCat();
      });
    });

  function preloadImages(list) {
    return Promise.all(
      list.map(cat => {
        const i = new Image();
        i.src = cat.url;
        return new Promise(resolve => {
          i.onload = resolve;
          i.onerror = resolve;
        });
      })
    );
  }

  function showCat() {
    img.src = cats[index].url;
  }

  /* ---------------- DRAG LOGIC ---------------- */

  function getX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }

  function startDrag(e) {
    isDragging = true;
    startX = getX(e);
    card.classList.remove("animate");
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
    card.classList.add("animate");

    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      swipeCard(diff > 0 ? "right" : "left");
    } else {
      resetCard();
    }
  }

  /* ---------------- SWIPE ---------------- */

  function swipeCard(direction) {
    const moveX = direction === "right"
      ? window.innerWidth
      : -window.innerWidth;

    card.style.transform =
      `translateX(${moveX}px) rotate(${direction === "right" ? 25 : -25}deg)`;

    setTimeout(() => {
      handleSwipe(direction);
      resetCard();
    }, 300);
  }

  function handleSwipe(direction) {
    if (direction === "right") {
      likedCats.push(cats[index]);
    }

    index++;

    if (index >= cats.length) {
      showResults();
    } else {
      showCat();
    }
  }

  function resetCard() {
    card.classList.remove("animate");
    card.style.transform = "translateX(0) rotate(0)";
  }

  /* ---------------- EVENTS ---------------- */

  card.addEventListener("touchstart", startDrag);
  card.addEventListener("touchmove", onDrag);
  card.addEventListener("touchend", endDrag);

  card.addEventListener("mousedown", startDrag);
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", endDrag);

  img.addEventListener("dragstart", e => e.preventDefault());

  /* ---------------- RESULTS ---------------- */

  function showResults() {
    document.querySelector(".app").style.display = "none";

    const results = document.getElementById("results");
    const grid = document.getElementById("likedGrid");
    const count = document.getElementById("likeCount");

    results.classList.remove("hidden");
    count.textContent = likedCats.length;

    grid.innerHTML = "";
    likedCats.forEach(cat => {
      const i = document.createElement("img");
      i.src = cat.url;
      grid.appendChild(i);
    });
  }

  document.getElementById("restartBtn").addEventListener("click", () => {
    index = 0;
    likedCats = [];

    document.getElementById("results").classList.add("hidden");
    document.querySelector(".app").style.display = "block";

    resetCard();
    showCat();
  });
});
