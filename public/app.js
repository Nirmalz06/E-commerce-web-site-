// app.js
let products = [];
let filteredProducts = [];
let cart = [];

const productGrid = document.getElementById("product-grid");
const emptyState = document.getElementById("empty-state");
const cartCountEl = document.getElementById("cart-count");
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");

const searchInput = document.getElementById("search-input");
const searchClear = document.getElementById("search-clear");
const searchToggle = document.getElementById("search-toggle");
const cartButton = document.getElementById("cart-button");
const cartClose = document.getElementById("cart-close");
const checkoutBtn = document.getElementById("checkout-btn");

document.getElementById("year").textContent = new Date().getFullYear();

// Load cart from localStorage
function loadCart() {
  try {
    const stored = localStorage.getItem("trizoverze-cart");
    cart = stored ? JSON.parse(stored) : [];
  } catch (e) {
    cart = [];
  }
  updateCartBadge();
}

// Save cart
function saveCart() {
  localStorage.setItem("trizoverze-cart", JSON.stringify(cart));
}

// Fetch products from backend
async function fetchProducts() {
  try {
    const res = await fetch("/api/products");
    const data = await res.json();
    products = data;
    filteredProducts = [...products];
    renderProducts();
  } catch (err) {
    console.error("Error fetching products:", err);
    productGrid.innerHTML =
      "<p>Unable to load posters. Please try again later.</p>";
  }
}

// Render product cards
function renderProducts() {
  productGrid.innerHTML = "";
  if (!filteredProducts.length) {
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  filteredProducts.forEach((p) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const imgWrap = document.createElement("div");
    imgWrap.className = "product-image";

    const img = document.createElement("img");
    img.src = p.image;
    img.alt = p.title;
    imgWrap.appendChild(img);

    const tag = document.createElement("span");
    tag.className = "product-tag";
    tag.textContent = p.category || "Poster";
    imgWrap.appendChild(tag);

    const body = document.createElement("div");
    body.className = "product-body";

    const title = document.createElement("h3");
    title.className = "product-title";
    title.textContent = p.title;

    const meta = document.createElement("div");
    meta.className = "product-meta";

    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = `₹${p.price}`;

    const size = document.createElement("span");
    size.className = "product-size";
    size.textContent = p.sizes && p.sizes.length
      ? `Size: ${p.sizes[0]}`
      : "Standard size";

    meta.appendChild(price);
    meta.appendChild(size);

    const actions = document.createElement("div");
    actions.className = "product-actions";

    const btnAdd = document.createElement("button");
    btnAdd.className = "pill-btn pill-btn-primary";
    btnAdd.textContent = "Add to Cart";
    btnAdd.addEventListener("click", () => addToCart(p));

    const btnDetails = document.createElement("button");
    btnDetails.className = "pill-btn pill-btn-ghost";
    btnDetails.textContent = "Details";
    btnDetails.addEventListener("click", () => {
    window.location.href = `/product.html?id=${p.id}`;
});


    actions.appendChild(btnAdd);
    actions.appendChild(btnDetails);

    body.appendChild(title);
    body.appendChild(meta);
    body.appendChild(actions);

    card.appendChild(imgWrap);
    card.appendChild(body);
    productGrid.appendChild(card);
  });
}

// Simple details alert for now
function showDetails(product) {
  alert(
    `${product.title}\n\nCategory: ${product.category}\nPrice: ₹${product.price}\nSizes: ${
      product.sizes ? product.sizes.join(", ") : "Standard"
    }`
  );
}

// Cart operations
function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      size: product.sizes && product.sizes[0] ? product.sizes[0] : "Standard",
      qty: 1
    });
  }
  saveCart();
  updateCartBadge();
  renderCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  updateCartBadge();
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  saveCart();
  updateCartBadge();
  renderCart();
}

function updateCartBadge() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = count;
}

// Render cart drawer
function renderCart() {
  cartItemsEl.innerHTML = "";
  if (!cart.length) {
    cartItemsEl.innerHTML = `<p style="font-size:13px;color:#9ca3af;">Your cart is empty. Add some posters!</p>`;
    cartTotalEl.textContent = "0";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.qty;

    const row = document.createElement("div");
    row.className = "cart-item";

    const thumb = document.createElement("div");
    thumb.className = "cart-item-thumb";
    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.title;
    thumb.appendChild(img);

    const body = document.createElement("div");
    body.className = "cart-item-body";

    const header = document.createElement("div");
    header.className = "cart-item-header";

    const title = document.createElement("div");
    title.className = "cart-item-title";
    title.textContent = item.title;

    const removeBtn = document.createElement("button");
    removeBtn.className = "cart-remove";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => removeFromCart(item.id));

    header.appendChild(title);
    header.appendChild(removeBtn);

    const meta = document.createElement("div");
    meta.className = "cart-item-meta";
    meta.textContent = `${item.size} • ₹${item.price}`;

    const qtyRow = document.createElement("div");
    qtyRow.className = "cart-qty";

    const minus = document.createElement("button");
    minus.textContent = "-";
    minus.addEventListener("click", () => changeQty(item.id, -1));

    const qty = document.createElement("span");
    qty.textContent = `Qty: ${item.qty}`;

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.addEventListener("click", () => changeQty(item.id, 1));

    const lineTotal = document.createElement("span");
    lineTotal.style.marginLeft = "auto";
    lineTotal.textContent = `₹${item.price * item.qty}`;

    qtyRow.appendChild(minus);
    qtyRow.appendChild(qty);
    qtyRow.appendChild(plus);
    qtyRow.appendChild(lineTotal);

    body.appendChild(header);
    body.appendChild(meta);
    body.appendChild(qtyRow);

    row.appendChild(thumb);
    row.appendChild(body);

    cartItemsEl.appendChild(row);
  });

  cartTotalEl.textContent = total;
}

// Cart drawer toggle
function openCart() {
  cartDrawer.classList.remove("hidden");
  cartOverlay.classList.remove("hidden");
}

function closeCart() {
  cartDrawer.classList.add("hidden");
  cartOverlay.classList.add("hidden");
}

// Filtering & search

function applyFilters() {
  const q = searchInput.value.trim().toLowerCase();
  const activeCategory = document.querySelector(
    ".category-card.active"
  )?.getAttribute("data-filter");

  filteredProducts = products.filter((p) => {
    const matchesCategory =
      !activeCategory ||
      activeCategory === "All" ||
      p.category === activeCategory;

    if (!matchesCategory) return false;

    if (!q) return true;

    const text = `${p.title} ${p.category} ${(p.tags || []).join(" ")}`.toLowerCase();
    return text.includes(q);
  });

  renderProducts();
}

function clearSearch() {
  searchInput.value = "";
  applyFilters();
}

// Event listeners

searchInput.addEventListener("input", () => {
  applyFilters();
});

searchClear.addEventListener("click", clearSearch);

searchToggle.addEventListener("click", () => {
  searchInput.focus();
});

cartButton.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

checkoutBtn.addEventListener("click", () => {
  alert(
    "This is a demo checkout.\n\nIn your Node backend you can integrate Razorpay / Stripe / COD, and send this cart data to the server."
  );
});

// Category filter buttons
document.querySelectorAll(".category-card").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".category-card")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilters();
  });
});

// Init
loadCart();
renderCart();
fetchProducts();
