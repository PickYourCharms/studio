const canvasSize = 360;
const cx = 180;
const cy = 160;
const radius = 130;

const slotAngles = [270, 250, 290, 230, 310];
const rotations = [0, -4, 4, -8, 8];

const devCharms = [
  "3DBowRibbon_Charm_Gold.png",
  "EvilEye_Charm_Gold.png",
  "LetterA_Charm_Gold.png",
  "NorthStar_Charm_Gold.png",
  "RedCherry_Charm_Gold.png"
];

let placedCharms = [];

function openBuilder() {
  document.getElementById("home").style.display = "none";
  document.getElementById("builder").style.display = "block";
}

function goHome() {
  document.getElementById("builder").style.display = "none";
  document.getElementById("home").style.display = "block";
}

function addCharm(index) {
  if (placedCharms.length >= 5) return;

  const slot = placedCharms.length;
  const angleDeg = slotAngles[slot];
  const angle = angleDeg * Math.PI / 180;

  const x = cx + radius * Math.cos(angle);
  const y = cy + radius * Math.sin(angle) + 10;

  const charm = document.createElement("img");
  charm.src = `assets/charms/${devCharms[index]}`;
  charm.className = "charm";
  charm.style.left = `${x}px`;
  charm.style.top = `${y}px`;
  charm.style.transform = `translateX(-50%) rotate(${rotations[slot]}deg)`;

  document.getElementById("charmLayer").appendChild(charm);
  placedCharms.push(charm);
}

