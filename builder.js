/* =========================
   BRACELET PHYSICS CONFIG
========================= */

// Logical canvas units
const CANVAS_SIZE = 360;

// Bracelet geometry
const CENTER_X = 180;
const CENTER_Y = 160;
const RADIUS = 130;

// Arc slots (degrees)
const SLOT_ANGLES = [270, 250, 290, 230, 310];

// Rotation per slot
const SLOT_ROTATION = [0, -4, 4, -8, 8];

// Charm limits
const MAX_CHARMS = 5;

// State
let placedCharms = [];

// DOM refs
const charmLayer = document.getElementById("charmLayer");

/* =========================
   HELPERS
========================= */

function degToRad(deg) {
  return deg * (Math.PI / 180);
}

/* =========================
   PLACE CHARM
========================= */

function addCharm(charmFile) {
  if (placedCharms.length >= MAX_CHARMS) return;

  const slotIndex = placedCharms.length;
  const angleDeg = SLOT_ANGLES[slotIndex];
  const angleRad = degToRad(angleDeg);

  const x =
    CENTER_X + RADIUS * Math.cos(angleRad);

  const y =
    CENTER_Y + RADIUS * Math.sin(angleRad) + 8; // gravity drop

  const charm = document.createElement("img");
  charm.src = `assets/charms/${charmFile}`;
  charm.className = "charm";

  charm.style.left = `${x}px`;
  charm.style.top = `${y}px`;
  charm.style.transform =
    `translateX(-50%) rotate(${SLOT_ROTATION[slotIndex]}deg)`;

  charmLayer.appendChild(charm);
  placedCharms.push(charm);
}

/* =========================
   EVENTS
========================= */

document.querySelectorAll(".charm-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    addCharm(btn.dataset.charm);
  });
});
