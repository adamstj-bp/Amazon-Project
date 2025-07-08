import { renderHeader } from "../scripts/header.js";
import { products } from "../data/products.js";
import { cart, addToCart, calculateCartQuantity } from "../data/cart.js";
import { searchFunctionality } from "./search.js";

renderHeader();
const productsGrid = document.querySelector(".js-products-grid");
const addedMessageTimeouts = {};

function displayProducts(productArray) {
  let productsHtml = "";

  productArray.forEach((product) => {
    productsHtml += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image" src="${product.image}" />
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars * 10}.png" />
          <div class="product-rating-count link-primary">${
            product.rating.count
          }</div>
        </div>

        <div class="product-price">$${(product.priceCents / 100).toFixed(
          2
        )}</div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.id}">
            ${[...Array(10).keys()]
              .map((i) => `<option value="${i + 1}">${i + 1}</option>`)
              .join("")}
          </select>
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png" />
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${
          product.id
        }">
          Add to Cart
        </button>
      </div>
    `;
  });

  productsGrid.innerHTML =
    productsHtml || `<p style="color: red;">No products found</p>`;
  addButtonListeners();
}

function addButtonListeners() {
  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const quantitySelector = document.querySelector(
        `.js-quantity-selector-${productId}`
      );
      const quantity = Number(quantitySelector.value);
      addToCart(productId, quantity);
      updateCartQuantity();

      const addedMessage = document.querySelector(
        `.js-added-to-cart-${productId}`
      );
      addedMessage.classList.add("added-to-cart-visible");

      const previousTimeout = addedMessageTimeouts[productId];
      if (previousTimeout) clearTimeout(previousTimeout);

      const timeoutId = setTimeout(() => {
        addedMessage.classList.remove("added-to-cart-visible");
      }, 2000);
      addedMessageTimeouts[productId] = timeoutId;
    });
  });
}

function updateCartQuantity() {
  document.querySelector(".js-cart-quantity").innerHTML =
    calculateCartQuantity();
}

// Initial load
displayProducts(products);
updateCartQuantity();

// Search functionality
// export function searchFunctionality() {
//   document.querySelector(".js-search-button").addEventListener("click", () => {
//     const query = document
//       .querySelector(".js-search-input")
//       .value.trim()
//       .toLowerCase();

//     if (query === "") {
//       displayProducts(products);
//       return;
//     }

//     const filtered = products.filter((product) => {
//       const nameMatch = product.name.toLowerCase().includes(query);
//       const keywordMatch = product.keywords?.some((keyword) =>
//         keyword.toLowerCase().includes(query)
//       );
//       return nameMatch || keywordMatch;
//     });

//     displayProducts(filtered);
//   });
// }

searchFunctionality();
