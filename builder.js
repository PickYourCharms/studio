const canvas = document.getElementById("bracelet-canvas");
const tray = document.querySelector(".charm-tray");

const centerX = 130;
const centerY = 130;
const radius = 95;

let selectedCharms = [];

/* --------- CORE MATH --------- */

function getAngles(count) {
  if (count === 1) return [Math.PI / 2];

  const start = Math.PI * 0.75; // left lower
  const end = Math.PI * 0.25;   // right lower
  const step = (start - end) / (count - 1);

  return Array.from({ length: count }, (_, i) => start - i * step);
}

function polarToXY(angle) {
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle)
  };
}

/* --------- RENDER --------- */

function renderCharms() {
  document.querySelectorAll(".charm").forEach(el => el.remove());

  const angles = getAngles(selectedCharms.length);

  selectedCharms.forEach((charm, index) => {
    const angle = angles[index];
    const pos = polarToXY(angle);

    const wrapper = document.createElement("div");
    wrapper.className = "charm";
    wrapper.style.left = `${pos.x}px`;
    wrapper.style.top = `${pos.y}px`;
    wrapper.style.transform = `
      translate(-50%, -50%)
      rotate(${(angle - Math.PI / 2) * -1}rad)
    `;

    const img = document.createElement("img");
    img.src = charm.src;

    const remove = document.createElement("div");
    remove.className = "remove-btn";
    remove.innerText = "×";
    remove.onclick = () => {
      selectedCharms.splice(index, 1);
      renderCharms();
    };

    wrapper.appendChild(img);
    wrapper.appendChild(remove);
    canvas.appendChild(wrapper);
  });
}

/* --------- ADD CHARM --------- */

tray.addEventListener("click", e => {
  if (e.target.tagName !== "IMG") return;
  if (selectedCharms.length >= 5) return;

  selectedCharms.push({
    id: e.target.dataset.id,
    src: e.target.src
  });

  renderCharms();
});
