import { renderHeader } from "../scripts/header.js";
import { calculateCartQuantity } from "../data/cart.js";

// Render the header
renderHeader();
document.querySelector(".cart-quantity").textContent = calculateCartQuantity();

// Get URL params
const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get("orderId");
const productId = urlParams.get("productId");

// Load orders from localStorage
const orders = JSON.parse(localStorage.getItem("orders")) || [];
const order = orders.find((order) => order.orderId === orderId);

if (!order) {
  document.querySelector(".main").innerHTML = `
    <div style="padding: 20px; font-size: 18px;">
      Order not found. <a href="orders.html">Back to Orders</a>
    </div>
  `;
} else {
  const item = order.items.find((i) => i.productId === productId);

  if (!item) {
    document.querySelector(".main").innerHTML = `
      <div style="padding: 20px; font-size: 18px;">
        Product not found in order. <a href="orders.html">Back to Orders</a>
      </div>
    `;
  } else {
    // Fill in product info
    document.querySelector(
      ".delivery-date"
    ).textContent = `Arriving on ${item.deliveryDate}`;
    document.querySelectorAll(".product-info")[0].textContent = item.name;
    document.querySelectorAll(
      ".product-info"
    )[1].textContent = `Quantity: ${item.quantity}`;
    document.querySelector(".product-image").src = item.image;

    // Animate progress bar from 0% to 60%
    const progressLabels = document.querySelectorAll(".progress-label");
    const progressBar = document.querySelector(".progress-bar");

    // Reset all labels and bar
    progressLabels.forEach((label) => label.classList.remove("current-status"));
    progressBar.style.width = "0%";

    // Animate through stages
    setTimeout(() => {
      progressLabels[0].classList.add("current-status");
      progressBar.style.width = "20%";
    }, 200);

    setTimeout(() => {
      progressLabels[1].classList.add("current-status");
      progressBar.style.width = "60%";
    }, 1000);
  }
}
