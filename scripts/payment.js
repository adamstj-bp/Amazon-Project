import { renderHeader } from "./header.js";
import { clearCart } from "../data/cart.js";

renderHeader();

document
  .getElementById("payment-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Delivery info
    const fullname = document.getElementById("fullname").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const deliveryAddress = document
      .getElementById("delivery-address")
      .value.trim();

    // Payment info
    const name = document.getElementById("name").value.trim();
    const card = document.getElementById("card").value.trim();
    const expiry = document.getElementById("expiry").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    if (
      !fullname ||
      !phone ||
      !deliveryAddress ||
      !name ||
      !card ||
      !expiry ||
      !cvv
    ) {
      alert("Please fill in all fields.");
      return;
    }

    // const messageEl = document.getElementById("message");
    // messageEl.textContent = "Processing payment...";

    // setTimeout(() => {
    //   messageEl.textContent = "✅ Payment successful! Redirecting...";

    //   clearCart();
    //   localStorage.removeItem("checkoutData");

    //   // Optional: store delivery info
    //   localStorage.setItem(
    //     "lastDelivery",
    //     JSON.stringify({ fullname, phone, deliveryAddress })
    //   );

    //   setTimeout(() => {
    //     localStorage.setItem("showOrderSuccess", "true");
    //     window.location.href = "orders.html";
    //   }, 2000);
    // }, 1500);
    const messageEl = document.getElementById("message");

    messageEl.classList.remove("hidden");
    messageEl.textContent = "Processing payment...";

    setTimeout(() => {
      messageEl.textContent = "✅ Payment successful! Redirecting...";

      clearCart();
      localStorage.removeItem("checkoutData");
      localStorage.setItem(
        "lastDelivery",
        JSON.stringify({ fullname, phone, deliveryAddress })
      );

      setTimeout(() => {
        window.location.href = "orders.html";
      }, 2500);
    }, 1500);
  });
