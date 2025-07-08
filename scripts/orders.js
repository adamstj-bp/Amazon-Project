import { renderHeader } from "../scripts/header.js";
import { calculateCartQuantity, addToCart } from "../data/cart.js";
import { searchFunctionality } from "./search.js";

// --- Render header and search ---
renderHeader();
searchFunctionality();

// --- Update cart quantity in header ---
function updateCartQuantity() {
  const quantityElement = document.querySelector(".js-cart-quantity");
  if (quantityElement) {
    quantityElement.innerHTML = calculateCartQuantity();
  }
}
updateCartQuantity();

// --- Load and display orders ---
const ordersContainer = document.querySelector(".orders-grid");
const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];

if (storedOrders.length === 0) {
  ordersContainer.innerHTML = `
    <div class="no-orders-message">
      You have no past orders.
    </div>
  `;
} else {
  let ordersHtml = "";

  storedOrders.forEach((order) => {
    let orderItemsHtml = "";

    order.items.forEach((item) => {
      orderItemsHtml += `
        <div class="product-image-container">
          <img src="${item.image}">
        </div>

        <div class="product-details">
          <div class="product-name">${item.name}</div>
          <div class="product-delivery-date">Arriving on: ${item.deliveryDate}</div>
          <div class="product-quantity">Quantity: ${item.quantity}</div>
          <button class="buy-again-button button-primary" data-product-id="${item.productId}">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
          </button>
        </div>

        <div class="product-actions">
          <a href="tracking.html?orderId=${order.orderId}&productId=${item.productId}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    ordersHtml += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${order.datePlaced}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${order.totalCost.toFixed(2)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.orderId}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${orderItemsHtml}
        </div>
      </div>
    `;
  });

  ordersContainer.innerHTML = ordersHtml;
}

// --- Handle Buy Again buttons ---
document.addEventListener("click", (event) => {
  if (event.target.closest(".buy-again-button")) {
    const button = event.target.closest(".buy-again-button");
    const productId = button.dataset.productId;
    addToCart(productId, 1);
    updateCartQuantity();
    alert("✅ Product added to cart.");
  }
});
window.addEventListener("DOMContentLoaded", () => {
  const toast = document.getElementById("toast");
  if (localStorage.getItem("showOrderSuccess") === "true") {
    toast.classList.remove("hidden");
    setTimeout(() => toast.classList.add("show"), 100); // fade in

    setTimeout(() => {
      toast.classList.remove("show");
      localStorage.removeItem("showOrderSuccess");
    }, 3000); // fade out after 3 seconds
  }
});
const clearButton = document.getElementById("clear-orders-button");

if (clearButton) {
  clearButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all orders?")) {
      localStorage.removeItem("orders");
      location.reload();
    }
  });
}
