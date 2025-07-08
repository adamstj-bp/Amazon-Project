export function renderHeader() {
  const headerHtml = `
    <div class="amazon-header">
      <div class="amazon-header-left-section">
        <a href="amazon.html" class="header-link">
          <img class="amazon-logo" src="images/amazon-logo-white.png" />
          <img class="amazon-mobile-logo" src="images/amazon-mobile-logo-white.png" />
        </a>
      </div>

      <div class="amazon-header-middle-section">
        <input class="search-bar js-search-input" type="text" placeholder="Search" />
        <button class="search-button js-search-button">
          <img class="search-icon" src="images/icons/search-icon.png" />
        </button>
      </div>

      <div class="amazon-header-right-section">
        <a class="orders-link header-link" href="orders.html">
          <span class="returns-text">Returns</span>
          <span class="orders-text">& Orders</span>
        </a>
        <a class="cart-link header-link" href="checkout.html">
          <img class="cart-icon" src="images/icons/cart-icon.png" />
          <div class="cart-quantity js-cart-quantity"></div>
          <div class="cart-text">Cart</div>
        </a>
      </div>
    </div>
  `;

  const headerContainer = document.querySelector(".js-amazon-header");
  if (headerContainer) {
    headerContainer.innerHTML = headerHtml;
  } else {
    console.error(
      "Header container (.js-amazon-header) not found in the HTML."
    );
  }
}
