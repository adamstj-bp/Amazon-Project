import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { clearCart } from "../data/cart.js";

let cartSummaryHTML = "";
let totalItemCost = 0;

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;
  products.forEach((product) => {
    if (productId === product.id) {
      matchingProduct = product;
    }
  });
  if (!matchingProduct) {
    alert(`product not found for ID: ${productId}`);
    return;
  }
  const itemTotal = matchingProduct.priceCents * cartItem.quantity;
  totalItemCost += itemTotal;
  // console.log(formatCurrency(1899));
  const saveOptionIndex = parseInt(
    localStorage.getItem(`delivery-option-${matchingProduct.id}`),
    10
  );
  const selectedIndex = isNaN(saveOptionIndex) ? 0 : saveOptionIndex;
  const deliveryDates = [
    "Tuesday, June 21",
    "Wednesday, June 15",
    "Monday, June 13",
  ];
  const selectedDeliveryDate =
    deliveryDates[saveOptionIndex] || deliveryDates[0];
  // let selectedDeliveryOption = "Tuesday, June 21";

  // if (saveIndex) {
  //   const deliveryDates = [
  //     "Tuesday, June 21",
  //     "Wednesday, June 15",
  //     "Monday, June 13",
  //   ];
  //   selectedDeliveryOption = deliveryDates[parseInt(saveIndex)];
  // }

  cartSummaryHTML += `
  <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">Delivery date: ${selectedDeliveryDate}</div>

            <div class="cart-item-details-grid">
              <img
                class="product-image"
                src="${matchingProduct.image}"
              />

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-total js-product-total-${
                  matchingProduct.id
                }">Total: <span class="total-item">$${formatCurrency(
    itemTotal
  )}</span> </div>
                <div class="product-quantity">
                  <span> Quantity: <span class="quantity-label js-quantity-label-${
                    matchingProduct.id
                  }">
                  ${cartItem.quantity}
                  </span> </span>
                  <span class="update-quantity-link link-primary js-update-link" data-product-id="${
                    matchingProduct.id
                  }">
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input-${
                    matchingProduct.id
                  }">
                 <span class="save-quantity-link link-primary js-save-link"
                 data-product-id="${matchingProduct.id}">save</span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
                    matchingProduct.id
                  }">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div class="delivery-option">
                  <input
                    type="radio"
                    checked
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}"
                    data-index="0"${selectedIndex === 0 ? "checked" : ""}
                  />
                  <div>
                    <div class="delivery-option-date">Tuesday, June 21</div>
                    <div class="delivery-option-price">FREE Shipping</div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input
                    type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}"
                    data-index="1"${selectedIndex === 1 ? "checked" : ""}
                  />
                  <div>
                    <div class="delivery-option-date">Wednesday, June 15</div>
                    <div class="delivery-option-price">Shipping - $4.99</div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input
                    type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}"
                    data-index="2"${selectedIndex === 2 ? "checked" : ""}
                  />
                  <div>
                    <div class="delivery-option-date">Monday, June 13</div>
                    <div class="delivery-option-price">Shipping - $9.99</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  `;
});
document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;
updateOrderSummary();

document.querySelectorAll(".delivery-option-input").forEach((radio) => {
  radio.addEventListener("change", () => {
    const productId = radio.name.split("delivery-option-")[1];
    const optionIndex = radio.dataset.index;
    //saveShippingOption(productId, optionIndex);
    localStorage.setItem(`delivery-option-${productId}`, optionIndex);
    // updateSelectedVisual(productId);
    // updateOrderSummary();

    // const deliveryDateDiv = document.querySelector(
    //   `.js-cart-item${productId} .delivery-date`
    // );
    // const selectedOptionDate = radio
    //   .closest(".delivery-option")
    //   .querySelector(".delivery-option-date").textContent;
    // if (deliveryDateDiv) {
    //   deliveryDateDiv.textContent = "Delivery date: " + selectedOptionDate;
    // }
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    //const selectedOption = radio.closest(".delivery-option");
    if (!container) return;

    // if (container && selectedOption) {
    //   const dateEl = selectedOption.querySelector(".delivery-option-date");
    //   const deliveryDateDiv = container.querySelector(".delivery-date");
    //   if (dateEl && deliveryDateDiv) {
    //     deliveryDateDiv.textContent = "Delivery date: " + dateEl.textContent;
    //   }
    // }
    const selectedOption = radio.closest(".delivery-option");
    const dateEl = selectedOption.querySelector(".delivery-option-date");
    const deliveryDateDiv = container.querySelector(".delivery-date");
    if (dateEl && deliveryDateDiv) {
      deliveryDateDiv.textContent = "Delivery date: " + dateEl.textContent;
    }
    //updateSelectedVisual(productId);

    updateOrderSummary();
  });
});

function updateOrderSummary() {
  let totalItemCost = 0;
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    const matchingProduct = products.find(
      (product) => product.id === cartItem.productId
    );
    if (matchingProduct) {
      totalItemCost += matchingProduct.priceCents * cartItem.quantity;
      cartQuantity += cartItem.quantity;
    }
  });

  let shippingCost = 0;
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const deliveryInputs = document.querySelectorAll(
      `input[name="delivery-option-${productId}"]`
    );
    deliveryInputs.forEach((input) => {
      if (input.checked) {
        const priceElement = input
          .closest(".delivery-option")
          .querySelector(".delivery-option-price");
        const priceText = priceElement.textContent.trim();

        if (priceText.includes("FREE")) {
          shippingCost += 0;
        } else {
          const match = priceText.match(/\$([\d.]+)/);
          if (match) {
            shippingCost += Math.round(parseFloat(match[1]) * 100);
          }
        }
      }
    });
  });

  const taxRate = 0.1;
  const estimatedTax = Math.round(totalItemCost * taxRate);
  const orderTotal = totalItemCost + shippingCost + estimatedTax;

  console.log(orderTotal);

  // let cartQuantity = 0;
  // cart.forEach((cartItem) => {
  //   cartQuantity += cartItem.quantity;
  // });

  const orderSummaryHtml = `
 <div class="payment-summary">
          <div class="payment-summary-title">Order Summary</div>

          <div class="payment-summary-row">
            <div>Items(${cartQuantity}):</div>
            <div class="payment-summary-money">$${formatCurrency(
              totalItemCost
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(
              shippingCost
            )}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(
              totalItemCost + shippingCost
            )}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(
              estimatedTax
            )}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(
              orderTotal
            )}</div>
          </div>
            <button class="place-order-button js-pl button-primary">
            Place your order
          </button>
         
          <button
            class="remove-from-cart-button place-order-button"
            style="background-color: red; border: none"
          >
            Remove from cart
          </button>
        </div>
`;

  document.querySelector(".js-payment-summary").innerHTML = orderSummaryHtml;
  //recalculate all carts totals
}

document.querySelectorAll(".js-delete-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    removeFromCart(productId);

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    if (container) container.remove();

    updateCartQuantity();
    updateOrderSummary();

    // ⬇️ Show "no items" warning if cart is now empty
    if (cart.length === 0) {
      const summaryContainer = document.querySelector(".js-payment-summary");

      // Remove existing message if any
      const existing = summaryContainer.querySelector(".warning-message");
      if (existing) existing.remove();

      const warning = document.createElement("p");
      warning.classList.add("warning-message", "cart-warning-message");
      warning.textContent = "⚠️ No items in cart.";

      summaryContainer.appendChild(warning);

      // Optional: auto-remove after 5 seconds
      setTimeout(() => {
        warning.remove();
      }, 5000);
    }
  });
});

function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();

  document.querySelector(
    ".js-return-to-home-link"
  ).innerHTML = `${cartQuantity} items`;
}
updateCartQuantity();

document.querySelectorAll(".js-update-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;
    // console.log(productId);

    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.classList.add("is-editing-quantity");
  });
});

document.querySelectorAll(".js-save-link").forEach((link) => {
  link.addEventListener("click", () => {
    const productId = link.dataset.productId;

    // const container = document.querySelector(
    //   `.js-cart-item-container${productId}`
    // );
    // container.classList.remove("is-editing-quantity");

    const quantityInput = document.querySelector(
      `.js-quantity-input-${productId}`
    );
    const newQuantity = Number(quantityInput.value);

    if (newQuantity < 0 || newQuantity >= 1000) {
      alert("Quantity must be at least 0 and less than 1000 ");
      return;
    }

    //update cart data
    updateQuantity(productId, newQuantity);
    //update quantity label
    const quantityLabel = document.querySelector(
      `.js-quantity-label-${productId}`
    );
    quantityLabel.innerHTML = newQuantity;
    //exit editing mode
    const container = document.querySelector(
      `.js-cart-item-container-${productId}`
    );
    container.classList.remove("is-editing-quantity");

    // recalculate individual item price
    const matchingProduct = products.find(
      (product) => product.id === productId
    );
    const itemTotal = matchingProduct.priceCents * newQuantity;
    console.log(itemTotal);

    const itemTotalElement = document.querySelector(
      `.js-product-total-${productId}`
    );
    itemTotalElement.innerHTML = `Total: $${formatCurrency(itemTotal)}`;
    console.log(itemTotalElement);
    //recalculate all carts totals
    updateOrderSummary();

    //update top cart quantity
    updateCartQuantity();
  });
});

console.log("cart content", cart);

let cartAlreadyCleared = false;
let warningTimeout;

console.log();

function saveOrderToStorage(orderItems) {
  const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

  const newOrder = {
    datePlaced: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    totalCost: calculateTotal(orderItems),
    orderId: crypto.randomUUID(),
    items: orderItems,
  };

  existingOrders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(existingOrders));
}

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

document
  .querySelector(".js-payment-summary")
  .addEventListener("click", (event) => {
    // 🟠 Remove from Cart
    if (event.target.classList.contains("remove-from-cart-button")) {
      if (cart.length === 0 || cartAlreadyCleared) {
        const summary = document.querySelector(".js-order-summary");
        summary.innerHTML = `
          <p class="empty-cart-message warning-message">
            ⚠️ No items in cart.
          </p>
        `;

        if (warningTimeout) clearTimeout(warningTimeout);
        warningTimeout = setTimeout(() => {
          const message = summary.querySelector(".warning-message");
          if (message) message.remove();
        }, 4000);

        return;
      }

      if (confirm("Are you sure you want to remove all items from the cart?")) {
        clearCart();
        cartAlreadyCleared = true;

        document.querySelector(".js-order-summary").innerHTML = `
          <div class="empty-cart-message" style="margin-top: 16px; color: #555;">
            Your cart is empty. Add items to get started.
          </div>
        `;
        updateOrderSummary();
        updateCartQuantity();
      }
    }

    // 🟢 Place Order
    if (event.target.classList.contains("js-pl")) {
      event.preventDefault();

      if (cart.length === 0) {
        const warningContainer = document.querySelector(".js-payment-summary");

        const existingWarning =
          warningContainer.querySelector(".warning-message");
        if (existingWarning) existingWarning.remove();

        const warning = document.createElement("p");
        warning.classList.add("warning-message", "cart-warning-message");
        warning.textContent =
          "⚠️ Add items to cart before you can place order.";
        warningContainer.appendChild(warning);

        setTimeout(() => warning.remove(), 4000);
        return;
      }

      const orderItems = cart.map((cartItem) => {
        const product = products.find((p) => p.id === cartItem.productId);
        const savedIndex = parseInt(
          localStorage.getItem(`delivery-option-${product.id}`),
          10
        );
        const deliveryDates = [
          "Tuesday, June 21",
          "Wednesday, June 15",
          "Monday, June 13",
        ];
        const deliveryDate = deliveryDates[savedIndex] || deliveryDates[0];

        return {
          ...cartItem,
          name: product.name,
          image: product.image,
          price: product.priceCents / 100,
          deliveryDate,
          productId: product.id,
        };
      });

      saveOrderToStorage(orderItems);
      clearCart();
      window.location.href = "payment.html";
    }
  });
