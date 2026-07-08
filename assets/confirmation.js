const order = loadLastOrder();
const wrap = document.getElementById("confirmWrap");

if (!order) {
  wrap.innerHTML = `
    <div class="confirm-card glass">
      <div class="confirm-title" style="font-size:26px;">No recent order found</div>
      <p class="confirm-copy">Looks like you got here directly. <a href="index.html" style="color:#fff; text-decoration:underline;">Return to the store</a> to place an order.</p>
    </div>`;
} else {
  const arrival = new Date();
  arrival.setDate(arrival.getDate() + 4);
  const arrivalEnd = new Date(arrival);
  arrivalEnd.setDate(arrivalEnd.getDate() + 3);
  const fmt = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  wrap.innerHTML = `
    <div class="confirm-card glass">
      <div class="confirm-badge pop-in" style="animation:popIn 0.5s cubic-bezier(0.34,1.56,0.64,1);">
        <span class="confirm-check">✓</span>
      </div>
      <div class="confirm-title">Order confirmed</div>
      <div class="confirm-copy">Thanks, ${order.firstName} — your order is being prepared. Pay ${money(order.total)} cash when it arrives. A confirmation email has been sent to<br>${order.email}</div>
      <div class="confirm-stats">
        <div>
          <div class="confirm-stat-label">Order number</div>
          <div class="confirm-stat-value">${order.orderNumber}</div>
        </div>
        <div class="confirm-stat-divider"></div>
        <div>
          <div class="confirm-stat-label">Estimated arrival</div>
          <div class="confirm-stat-value">${fmt(arrival)} – ${fmt(arrivalEnd)}</div>
        </div>
      </div>
    </div>

    <div class="detail-card glass">
      <div class="detail-card-title">Order details</div>
      <div style="display:flex; flex-direction:column; gap:16px; margin-bottom:20px;">
        ${order.lines.map((l) => `
          <div class="summary-line">
            <div class="summary-line-swatch" style="background:${stripe(l.hue)}"></div>
            <div style="flex:1;">
              <div class="cart-line-name">${l.name}</div>
              <div class="cart-line-meta">Qty ${l.qty}</div>
            </div>
            <div class="cart-line-name">${money(l.subtotal)}</div>
          </div>
        `).join("")}
      </div>
      <div class="summary-divider" style="margin-bottom:18px;"></div>
      <div class="summary-totals" style="margin-bottom:18px;">
        <div class="summary-row"><span>Subtotal</span><span>${money(order.subtotal)}</span></div>
        <div class="summary-row"><span>Shipping</span><span>${money(order.shipping)}</span></div>
      </div>
      <div class="summary-divider" style="margin-bottom:18px;"></div>
      <div class="summary-grand">
        <div class="summary-grand-label">Total due on delivery</div>
        <div class="summary-grand-value">${money(order.total)}</div>
      </div>
    </div>

    <div class="detail-card glass">
      <div class="detail-card-title">Shipping to</div>
      <div class="ship-to-text">${order.firstName} ${order.lastName}<br>${order.address}<br>${order.city}, ${order.state} ${order.zip}</div>
    </div>

    <div class="confirm-actions">
      <a href="index.html" class="pill pill-primary">Continue shopping</a>
      <span class="pill pill-secondary">View order status</span>
    </div>
  `;
}
