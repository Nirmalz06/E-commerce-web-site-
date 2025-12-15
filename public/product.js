// product.js
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

if (!productId) {
  document.getElementById("product-container").innerHTML = "<p>Product not found.</p>";
} else {
  fetch(`/api/products/${productId}`)
    .then(res => res.json())
    .then(product => {
      if (product.message) {
        document.getElementById("product-container").innerHTML = "<p>Product not found.</p>";
        return;
      }

      const container = document.getElementById("product-container");

      container.innerHTML = `
        <div class="product-detail">
          <img src="${product.image}" alt="${product.title}" class="product-img"/>

          <div class="product-info">
            <h1>${product.title}</h1>
            <p>${product.description}</p>
            <p class="price">₹${product.price}</p>

            <label for="size">Select Size</label>
            <select id="size">
              <option value="A4">A4</option>
              <option value="A3">A3</option>
              <option value="A2">A2</option>
            </select>

            <button id="checkoutBtn" class="checkout-btn">
              Order via WhatsApp
            </button>
          </div>
        </div>
      `;

      // WhatsApp redirect logic
      document.getElementById("checkoutBtn").addEventListener("click", () => {
        const selectedSize = document.getElementById("size").value;

        const message = `Hi, I am interested in ordering a poster.
Poster Name: ${product.title}
Size: ${selectedSize}
Price: ₹${product.price}`;

        const whatsappURL =
          `https://wa.me/918124125555?text=${encodeURIComponent(message)}`;

        window.open(whatsappURL, "_blank");
      });
    })
    .catch(err => {
      console.error("Error fetching product:", err);
      document.getElementById("product-container").innerHTML = "<p>Unable to load product. Please try again later.</p>";
    });
}
