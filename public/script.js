let products = [];
let cart = [];

// Load products from server
async function loadProducts() {
  const res = await fetch("/api/products");
  products = await res.json();
  renderProducts();
  restoreCart();
}

function renderProducts(list = products) {
  const grid = document.getElementById("products");
  grid.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" />
      <div class="info">
        <strong>${p.name}</strong>
        <small>${p.description}</small>
        <div class="price">₹${p.price}</div>
        <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>`;
    grid.appendChild(card);
  });
}

function addToCart(id) {
  const item = products.find(p => p.id === id);
  if (!item) return;
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
  }
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  saveCart();
  renderCart();
}

function changeQty(id, delta) {
  const it = cart.find(c => c.id === id);
  if (!it) return;
  it.qty += delta;
  if (it.qty <= 0) return removeFromCart(id);
  saveCart();
  renderCart();
}

function renderCart() {
  const list = document.getElementById("cartList");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("count");
  list.innerHTML = "";
  let total = 0, count = 0;

  cart.forEach(it => {
    total += it.price * it.qty;
    count += it.qty;
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <div class="meta">
        <strong>${it.name}</strong>
        <small>₹${it.price} × ${it.qty}</small>
      </div>
      <div>
        <button onclick="changeQty(${it.id}, -1)">−</button>
        <button onclick="changeQty(${it.id}, 1)">+</button>
        <button onclick="removeFromCart(${it.id})">Remove</button>
      </div>`;
    list.appendChild(li);
  });

  totalEl.textContent = total;
  countEl.textContent = count;
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function restoreCart() {
  const raw = localStorage.getItem("cart");
  if (raw) cart = JSON.parse(raw);
  renderCart();
}

// Search & Sort
const searchInput = document.getElementById("search");
const sortSel = document.getElementById("sort");

searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase().trim();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  applySort(filtered);
});

sortSel.addEventListener("change", () => applySort());

function applySort(list = null) {
  let arr = list ? [...list] : [...products];
  const v = sortSel.value;
  if (v === "price-asc") arr.sort((a,b)=>a.price-b.price);
  if (v === "price-desc") arr.sort((a,b)=>b.price-a.price);
  if (v === "name-asc") arr.sort((a,b)=>a.name.localeCompare(b.name));
  if (v === "name-desc") arr.sort((a,b)=>b.name.localeCompare(a.name));
  renderProducts(arr);
}

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) return alert("Your cart is empty.");
  alert("✅ Order placed! (demo)");
  cart = [];
  saveCart();
  renderCart();
});

loadProducts();
