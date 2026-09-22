/**
 * Injected into every page: a visible cursor, hover ring and click ripple.
 * Playwright's video does not capture the OS pointer, so the demo draws its own
 * and keeps it in lockstep with the real mouse that drives hover and clicks.
 */
window.__odyCursorInit = () => {
  if (document.getElementById("ody-cursor")) return;
  const style = document.createElement("style");
  style.textContent = `
    #ody-cursor { position: fixed; left: 0; top: 0; z-index: 2147483647; pointer-events: none;
      width: 28px; height: 28px; transform: translate3d(-100px,-100px,0); will-change: transform; }
    #ody-cursor svg { display: block; filter: drop-shadow(0 2px 5px rgba(9,30,38,.45)); }
    #ody-cursor[data-down="true"] svg { transform: scale(.86); }
    #ody-cursor svg { transition: transform 90ms ease; }
    #ody-ring { position: fixed; left: 0; top: 0; z-index: 2147483646; pointer-events: none;
      width: 40px; height: 40px; margin: -20px 0 0 -20px; border-radius: 50%;
      border: 1.5px solid rgba(47,157,140,.55); opacity: 0; transform: translate3d(-100px,-100px,0) scale(.6);
      transition: opacity 180ms ease, transform 180ms ease; }
    #ody-ring[data-on="true"] { opacity: 1; transform: translate3d(var(--x),var(--y),0) scale(1); }
    .ody-ripple { position: fixed; z-index: 2147483645; pointer-events: none; width: 14px; height: 14px;
      margin: -7px 0 0 -7px; border-radius: 50%; background: rgba(47,157,140,.35);
      animation: ody-ripple 560ms cubic-bezier(.2,.8,.3,1) forwards; }
    @keyframes ody-ripple { to { transform: scale(5.5); opacity: 0; } }
  `;
  document.documentElement.appendChild(style);

  const ring = document.createElement("div");
  ring.id = "ody-ring";
  document.documentElement.appendChild(ring);

  const el = document.createElement("div");
  el.id = "ody-cursor";
  el.innerHTML = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M6 3.2 L6 21.4 L10.6 17.2 L13.7 24.3 L17.1 22.8 L14.1 15.9 L20.4 15.4 Z"
      fill="#0f2a33" stroke="#ffffff" stroke-width="1.4" stroke-linejoin="round"/>
  </svg>`;
  document.documentElement.appendChild(el);

  window.__odyMove = (x, y) => { el.style.transform = `translate3d(${x}px,${y}px,0)`; };
  window.__odyDown = (on) => { el.dataset.down = on ? "true" : "false"; };
  window.__odyRing = (on, x, y) => {
    if (on) { ring.style.setProperty("--x", `${x}px`); ring.style.setProperty("--y", `${y}px`); }
    ring.dataset.on = on ? "true" : "false";
  };
  window.__odyRipple = (x, y) => {
    const r = document.createElement("span");
    r.className = "ody-ripple";
    r.style.left = `${x}px`;
    r.style.top = `${y}px`;
    document.documentElement.appendChild(r);
    setTimeout(() => r.remove(), 620);
  };
};
window.__odyCursorInit();
