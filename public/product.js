// Extract product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

const container = document.getElementById("product-container");

// Load product data from backend
async function loadProduct(){
    const res = await fetch("/api/products/" + productId);
    const p = await res.json();

    container.innerHTML = `
      <div class="pd-image">
        <img src="${p.image}" alt="${p.title}">
      </div>

      <div>
        <h1 class="pd-title">${p.title}</h1>

        <p class="pd-price">₹${p.price}</p>

        <div class="pd-sizes">
          <label for="sizeSel">Choose Size:</label>
          <select id="sizeSel">
            ${p.sizes.map(s => `<option value="${s}">${s}</option>`).join("")}
          </select>
        </div>

        <button class="pill-btn pill-btn-primary pd-addcart" id="addBtn">
          Add to Cart
        </button>
      </div>
    `;

    document.getElementById("addBtn").addEventListener("click", () => addToCart(p));
}

// CART LOGIC
function loadCart(){
    try{
        return JSON.parse(localStorage.getItem("trizoverze-cart")) || [];
    }catch{
        return [];
    }
}

function saveCart(cart){
    localStorage.setItem("trizoverze-cart", JSON.stringify(cart));
}

function addToCart(product){
    const size = document.getElementById("sizeSel").value;

    let cart = loadCart();

    // Unique key: product + size
    const key = product.id + "-" + size;

    const existing = cart.find(item => item.key === key);

    if(existing){
        existing.qty += 1;
    } else {
        cart.push({
            key,
            id: product.id,
            title: product.title,
            image: product.image,
            price: product.price,
            size,
            qty: 1
        });
    }

    saveCart(cart);

    alert("Item added to cart!");
}

loadProduct();
