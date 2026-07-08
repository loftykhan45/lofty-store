let shippingIndex = 0;

function currentLines() {
  return cartLines();
}

function renderSummary() {
  const lines = currentLines();
  const subtotal = lines.reduce((sum, l) => sum + l.subtotal, 0);
  const shippingCost = SHIPPING_OPTIONS[shippingIndex].price;
  const total = subtotal + shippingCost;

  document.getElementById("summaryLines").innerHTML = lines.map((l) => `
    <div class="summary-line">
      <div class="summary-line-swatch">${mediaFill(l.product.image, l.product.hue, "")}</div>
      <div style="flex:1;">
        <div class="cart-line-name">${l.product.name}</div>
        <div class="cart-line-meta">Qty ${l.qty}</div>
      </div>
      <div class="cart-line-name">${money(l.subtotal)}</div>
    </div>
  `).join("");

  document.getElementById("sumSubtotal").textContent = money(subtotal);
  document.getElementById("sumShipping").textContent = money(shippingCost);
  document.getElementById("sumTotal").textContent = money(total);
  document.getElementById("payBtn").textContent = `Place order — Pay ${money(total)} on delivery`;

  const payBtn = document.getElementById("payBtn");
  payBtn.disabled = lines.length === 0;

  return { subtotal, shippingCost, total };
}

function renderShipOptions() {
  const el = document.getElementById("shipOptions");
  el.innerHTML = SHIPPING_OPTIONS.map((opt, idx) => `
    <div class="ship-option ${idx === shippingIndex ? "selected" : ""}" data-idx="${idx}">
      <div class="ship-option-left">
        <div class="ship-dot"><div class="ship-dot-fill"></div></div>
        <div>
          <div class="ship-name">${opt.name}</div>
          <div class="ship-eta">${opt.eta}</div>
        </div>
      </div>
      <div class="ship-price">${money(opt.price)}</div>
    </div>
  `).join("");
  el.querySelectorAll(".ship-option").forEach((node) => {
    node.addEventListener("click", () => {
      shippingIndex = Number(node.dataset.idx);
      renderShipOptions();
      renderSummary();
    });
  });
}

function validateForm(form) {
  let valid = true;
  const email = form.elements.email;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
  toggleFieldError(email, emailValid);
  if (!emailValid) valid = false;

  ["firstName", "lastName", "address", "city"].forEach((name) => {
    const field = form.elements[name];
    const ok = field.value.trim().length > 0;
    toggleFieldError(field, ok);
    if (!ok) valid = false;
  });

  return valid;
}

function toggleFieldError(field, ok) {
  field.classList.toggle("invalid", !ok);
  const err = field.parentElement.querySelector(".field-error");
  if (err) err.style.display = ok ? "none" : "block";
}

const form = document.getElementById("checkoutForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (currentLines().length === 0) return;
  if (!validateForm(form)) return;

  const totals = renderSummary();
  const lines = currentLines();
  saveLastOrder({
    email: form.elements.email.value,
    firstName: form.elements.firstName.value,
    lastName: form.elements.lastName.value,
    address: form.elements.address.value,
    city: form.elements.city.value,
    lines: lines.map((l) => ({ id: l.product.id, name: l.product.name, hue: l.product.hue, image: l.product.image, qty: l.qty, subtotal: l.subtotal })),
    subtotal: totals.subtotal,
    shipping: totals.shippingCost,
    total: totals.total,
    orderNumber: "#LS-" + Math.floor(10000 + Math.random() * 89999),
  });
  clearCart();
  window.location.href = "confirmation.html";
});

function checkEmpty() {
  document.getElementById("emptyNotice").style.display = currentLines().length === 0 ? "block" : "none";
}

renderShipOptions();
renderSummary();
checkEmpty();
