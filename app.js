/* ======================
   CONFIG
====================== */

const API_BASE_URL =
  'https://script.google.com/macros/s/AKfycbzCQz44lvqRB-pM6n895hC0JszZsKmsn1TEpVmdra6XyV58_omlDmMmixrF0B2HYHTyzg/exec';

const BRACELET_CONFIG = {
  centerX: 500,
  centerY: 500,
  radius: 380,
  arcStartDeg: 140,
  arcEndDeg: 220,
  charmAnchorX: 200,
  charmAnchorY: 40,
  rotationDamping: 0.5
};

/* ======================
   STATE
====================== */

let pricing = {};
let charms = [];
let selectedCharms = [];

/* ======================
   INIT
====================== */

init();

async function init() {
  pricing = await fetchPricing();
  charms = await fetchCharms();
  renderCharmTray();
  updatePrice();
}

/* ======================
   FETCHERS
====================== */

async function fetchPricing() {
  const res = await fetch(`${API_BASE_URL}?action=pricing`);
  return res.json();
}

async function fetchCharms() {
  const res = await fetch(`${API_BASE_URL}?action=charms`);
  return res.json();
}

/* ======================
   UI
====================== */

function renderCharmTray() {
  const tray = document.getElementById('charmTray');
  tray.innerHTML = '';

  charms.forEach(charm => {
    const img = document.createElement('img');
    img.src = `assets/charms/${charm.file_name}`;
    img.alt = charm.charm_id;
    img.onclick = () => addCharm(charm);
    tray.appendChild(img);
  });
}

/* ======================
   BUILDER LOGIC
====================== */

function addCharm(charm) {
  if (selectedCharms.length >= 5) return;
  selectedCharms.push(charm);
  renderCharms();
  updatePrice();
}

function renderCharms() {
  const layer = document.getElementById('charmLayer');
  layer.innerHTML = '';

  selectedCharms.forEach((charm, index) => {
    const el = document.createElement('img');
    el.src = `assets/charms/${charm.file_name}`;
    el.className = 'charm';

    const pos = calculateCharmPosition(index, selectedCharms.length);

    el.style.transform = `
      translate(${pos.x - BRACELET_CONFIG.charmAnchorX}px,
                ${pos.y - BRACELET_CONFIG.charmAnchorY}px)
      rotate(${pos.rotation}deg)
    `;

    layer.appendChild(el);
  });
}

function calculateCharmPosition(index, total) {
  const arcSpan = BRACELET_CONFIG.arcEndDeg - BRACELET_CONFIG.arcStartDeg;
  const step = total === 1 ? 0 : arcSpan / (total - 1);
  const angleDeg = BRACELET_CONFIG.arcStartDeg + step * index;
  const angleRad = angleDeg * Math.PI / 180;

  const x = BRACELET_CONFIG.centerX +
            BRACELET_CONFIG.radius * Math.cos(angleRad);
  const y = BRACELET_CONFIG.centerY +
            BRACELET_CONFIG.radius * Math.sin(angleRad);

  const rotation =
    (angleDeg - 180) * BRACELET_CONFIG.rotationDamping;

  return { x, y, rotation };
}

/* ======================
   PRICING
====================== */

function updatePrice() {
  const basePrice = Number(pricing.bracelet_base_price || 249);
  const allowance = Number(pricing.bracelet_base_charm_allowance || 50);

  let total = basePrice;
  let premiumUsed = false;

  selectedCharms.forEach((charm, i) => {
    const price = Number(charm.price || 0);
    if (i === 0) {
      if (price > allowance) {
        total += price - allowance;
        premiumUsed = true;
      }
    } else {
      total += price;
    }
  });

  document.getElementById('priceValue').textContent = total;
  document.getElementById('premiumLabel')
    .classList.toggle('hidden', !premiumUsed);
}
