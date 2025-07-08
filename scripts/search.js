export function searchFunctionality() {
  document.querySelector(".js-search-button").addEventListener("click", () => {
    const query = document
      .querySelector(".js-search-input")
      .value.trim()
      .toLowerCase();

    if (query === "") {
      displayProducts(products);
      return;
    }

    const filtered = products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const keywordMatch = product.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(query)
      );
      return nameMatch || keywordMatch;
    });

    displayProducts(filtered);
  });
}
