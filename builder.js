const canvas = document.getElementById("braceletCanvas");
const priceValue = document.getElementById("priceValue");
const premiumLabel = document.getElementById("premiumLabel");
const addToBagBtn = document.getElementById("addToBagBtn");

const BASE_PRICE = 249;
let charms = [];
let baseCharmPrice = 80;

const positions = [
  { x: 50, y: 82, r: -15 },
  { x: 120, y: 95, r: -5 },
  { x: 170, y: 100, r: 0 },
  { x: 220, y: 95, r: 5 },
  { x: 290, y: 82, r: 15 }
];

document.querySelectorAll(".charm-tray img").forEach(img => {
  img.addEventListener("click", () => addCharm(img.src, parseInt(img.dataset.price)));
});

function addCharm(src, price) {
  if (charms.length >= 5) return;

  charms.push({ src, price });
  renderCharms();
  updatePrice();
}

function removeCharm(index) {
  charms.splice(index, 1);
  renderCharms();
  updatePrice();
}

function renderCharms() {
  canvas.querySelectorAll(".charm").forEach(c => c.remove());

  const count = charms.length;
  const start = Math.floor((5 - count) / 2);

  charms.forEach((charm, i) => {
    const pos = positions[start + i];
    const el = document.createElement("div");
    el.className = "charm";
    el.style.left = pos.x + "px";
    el.style.top = pos.y + "px";
    el.style.transform = `rotate(${pos.r}deg)`;

    el.innerHTML = `
      <img src="${charm.src}" />
      <div class="remove">×</div>
    `;

    el.querySelector(".remove").onclick = () => removeCharm(i);
    canvas.appendChild(el);
  });

  addToBagBtn.disabled = charms.length === 0;
}

function updatePrice() {
  let total = BASE_PRICE;
  let premiumUsed = false;

  if (charms.length > 0) {
    const cheapest = Math.min(...charms.map(c => c.price));
    charms.forEach(c => {
      if (c.price > cheapest) {
        total += c.price;
        if (c.price > baseCharmPrice) premiumUsed = true;
      }
    });
  }

  priceValue.textContent = total;

  if (premiumUsed) {
    premiumLabel.style.opacity = 1;
    setTimeout(() => premiumLabel.style.opacity = 0, 1500);
  }
}
