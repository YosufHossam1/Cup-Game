let but = document.querySelector("button");
let rightCup = document.querySelector(".three");
let centerCup = document.querySelector(".two");
let leftCup = document.querySelector(".one");
let winCup = document.querySelector(".special");
let cards = document.querySelectorAll(".cup");
let stats = document.querySelector(".stats");
let levels = document.querySelectorAll(".level");
let lvlSection = document.querySelector(".levels");
let sound = new Audio("/images/universfield-swoosh-06-351021_lnXwOu7w.mp3");

let cupWidth = Number(winCup.width) + 50;
let cupHeight = Number(winCup.height) / 2;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
cards.forEach((card) => {
  card.style.pointerEvents = "none";
});
let level = levels.forEach((lvl) => {
  lvl.addEventListener("click", () => {
    level = Number(lvl.dataset.level);
  });
});

function getOptions() {
  return {
    duration: level || 1000,
    fill: "forwards",
    easing: "ease-in-out",
  };
}

let cups = [leftCup, centerCup, rightCup];

cards.forEach((card) => {
  card.addEventListener("click", function () {
    if (card.children[0].classList.contains("special")) {
      winCup.classList.add("wins");
      stats.textContent = "congrats you win";
      but.disabled = false;
      but.style.opacity = "1";
    } else {
      card.children[0].classList.add("wins");
      winCup.classList.add("wins");
      stats.textContent = "try again";
      but.disabled = false;
      but.style.opacity = "1";
    }
  });
});

but.addEventListener("click", async function () {
  cards.forEach((card) => {
    card.children[0].classList.remove("wins");
  });
  but.disabled = true;
  but.style.opacity = "0.5";
  await startGame();
});

async function startGame() {
  lvlSection.style.visibility = "hidden";

  cards.forEach((card) => {
    card.style.pointerEvents = "none";
  });
  stats.textContent = "see the boll !";
  winCup.classList.add("snap");
  await wait(2000);
  stats.textContent = "mixing ...";
  for (let i = 0; i < 20; i++) {
    await shuffle(cups);
  }

  stats.textContent = "choice a cup";
  cards.forEach((card) => {
    card.style.pointerEvents = "auto";
  });
  lvlSection.style.visibility = "visible";
}

function getCurrentImageTranslate(element) {
  const style = window.getComputedStyle(element);
  const matrix = new DOMMatrix(style.transform);
  return {
    x: matrix.m41,
    y: matrix.m42,
  };
}

async function shuffle(cups) {
  let index1 = Math.floor(Math.random() * cups.length);
  let index2 = Math.floor(Math.random() * cups.length);
  do {
    index2 = Math.floor(Math.random() * cups.length);
  } while (
    index1 === index2 ||
    (index1 === 0 && index2 === 2) ||
    (index1 === 2 && index2 === 0)
  );

  if (index1 === 0 && index2 === 1) {
    ToTopLeft(cups[index2]);
    await ToRight(cups[index1]);
  } else if (index1 === 1 && index2 === 0) {
    ToTopRight(cups[index2]);
    await ToLeft(cups[index1]);
  } else if (index1 === 1 && index2 === 2) {
    ToLeft(cups[index2]);
    await ToTopRight(cups[index1]);
  } else if (index1 === 2 && index2 === 1) {
    ToRight(cups[index2]);
    await ToTopLeft(cups[index1]);
  }
  sound.play();

  let temp = cups[index1];
  cups[index1] = cups[index2];
  cups[index2] = temp;
}

async function ToTopLeft(cup) {
  let currentPos = getNewPos(cup);
  let move = moveing(currentPos.x, currentPos.y, cupWidth, cupHeight);
  let animat = cup.animate(move.TopLeft, getOptions());
  await animat.finished;
}

async function ToTopRight(cup) {
  let currentPos = getNewPos(cup);
  let move = moveing(currentPos.x, currentPos.y, cupWidth, cupHeight);
  let animat = cup.animate(move.TopRight, getOptions());
  await animat.finished;
}

async function ToRight(cup) {
  let currentPos = getNewPos(cup);
  let move = moveing(currentPos.x, currentPos.y, cupWidth, cupHeight);
  let animat = cup.animate(move.Right, getOptions());
  await animat.finished;
}

async function ToLeft(cup) {
  let currentPos = getNewPos(cup);
  let move = moveing(currentPos.x, currentPos.y, cupWidth, cupHeight);
  let animat = cup.animate(move.Left, getOptions());
  await animat.finished;
}

function getNewPos(cup) {
  let pos = [getCurrentImageTranslate(cup)];
  x = pos[0].x;
  y = pos[0].y;
  return { x, y };
}

function moveing(x, y, cupWidth, cupHeight) {
  const TopLeft = [
    { transform: `translate(${x}px,${y}px)` },
    { transform: `translate(${x - cupWidth / 2}px,${y - cupHeight}px)` },
    { transform: `translate(${x - cupWidth}px, ${y}px)` },
  ];
  const TopRight = [
    { transform: `translate(${x}px,${y}px)` },
    { transform: `translate(${x + cupWidth / 2}px,${y - cupHeight}px)` },
    { transform: `translate(${x + cupWidth}px, ${y}px)` },
  ];
  const Right = [
    { transform: `translateX(${x}px)` },
    { transform: `translateX(${x + cupWidth}px)` },
  ];
  const Left = [
    { transform: `translateX(${x}px)` },
    { transform: `translateX(${x - cupWidth}px)` },
  ];
  return { TopLeft, TopRight, Right, Left };
}
