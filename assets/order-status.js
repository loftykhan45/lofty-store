// Demo order tracking: no backend, so status is simulated from time elapsed
// since the order was placed (order.placedAt, in ms).
const STAGE_MINUTES = [0, 1, 5, 15]; // Placed / Preparing / Out for delivery / Delivered

const STAGES = [
  { title: "Order placed", desc: "We've received your order and it's confirmed." },
  { title: "Preparing your order", desc: "Your items are being picked and packed." },
  { title: "Out for delivery", desc: "Your order has left the warehouse and is on its way." },
  { title: "Delivered", desc: "Handed to you — pay the rider in cash." },
];

function currentStageIndex(elapsedMinutes) {
  let idx = 0;
  for (let i = 0; i < STAGE_MINUTES.length; i++) {
    if (elapsedMinutes >= STAGE_MINUTES[i]) idx = i;
  }
  return idx;
}

function formatTime(ms) {
  return new Date(ms).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function render() {
  const order = loadLastOrder();
  const wrap = document.getElementById("statusWrap");

  if (!order) {
    wrap.innerHTML = `
      <div class="confirm-card glass">
        <div class="confirm-title" style="font-size:26px;">No recent order found</div>
        <p class="confirm-copy">Place an order to see its status here. <a href="index.html" style="color:#fff; text-decoration:underline;">Return to the store</a>.</p>
      </div>`;
    return;
  }

  const placedAt = order.placedAt || Date.now();
  const elapsedMinutes = (Date.now() - placedAt) / 60000;
  const stageIdx = currentStageIndex(elapsedMinutes);

  const stepsHtml = STAGES.map((stage, i) => {
    const state = i < stageIdx ? "done" : i === stageIdx ? "current" : "pending";
    const stageTime = placedAt + STAGE_MINUTES[i] * 60000;
    const timeLabel = state === "pending" ? "" : `<div class="status-time">${formatTime(stageTime)}</div>`;
    const dotContent = state === "done" ? "✓" : i + 1;
    return `
      <div class="status-step ${state}">
        ${i < STAGES.length - 1 ? '<div class="status-line"></div>' : ""}
        <div class="status-dot">${dotContent}</div>
        <div class="status-body">
          <div class="status-title">${stage.title}</div>
          <div class="status-desc">${stage.desc}</div>
          ${timeLabel}
        </div>
      </div>`;
  }).join("");

  wrap.innerHTML = `
    <div class="confirm-card glass" style="text-align:left; padding:36px;">
      <div style="display:flex; align-items:baseline; justify-content:space-between; gap:12px; margin-bottom:26px; flex-wrap:wrap;">
        <div>
          <div class="confirm-stat-label">Order number</div>
          <div class="confirm-stat-value" style="font-size:18px;">${order.orderNumber}</div>
        </div>
        <div style="text-align:right;">
          <div class="confirm-stat-label">Total due on delivery</div>
          <div class="confirm-stat-value" style="font-size:18px;">${money(order.total)}</div>
        </div>
      </div>
      <div class="status-timeline">${stepsHtml}</div>
    </div>

    <div class="detail-card glass">
      <div class="detail-card-title">Items</div>
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${order.lines.map((l) => `
          <div class="summary-line">
            <div class="summary-line-swatch">${mediaFill(l.image, l.hue, "")}</div>
            <div style="flex:1;">
              <div class="cart-line-name">${l.name}</div>
              <div class="cart-line-meta">Qty ${l.qty}</div>
            </div>
            <div class="cart-line-name">${money(l.subtotal)}</div>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="detail-card glass">
      <div class="detail-card-title">Shipping to</div>
      <div class="ship-to-text">${order.firstName} ${order.lastName}<br>${order.address}<br>${order.city}</div>
    </div>

    <div class="confirm-actions">
      <a href="index.html" class="pill pill-primary">Continue shopping</a>
    </div>
  `;
}

render();
setInterval(render, 15000);
