let cart = JSON.parse(localStorage.getItem("panier")) || [];

function saveCart() {
  localStorage.setItem("panier", JSON.stringify(cart));
}
// Barre de recherche stricte (filtre par nom de produit uniquement)
const searchInput = document.getElementById("search-input");
const produits = document.querySelectorAll("section.produit");

if (searchInput) {
  searchInput.addEventListener("input", () => {
    const filter = searchInput.value.toLowerCase().trim();

    produits.forEach(produit => {
      const nom = produit.querySelector("h2").textContent.toLowerCase();

      if (nom.includes(filter)) {
        produit.style.display = "";
      } else {
        produit.style.display = "none";
      }
    });
  });
}


function updateCartCount() {
  const countSpan = document.getElementById("cart-count");
  if (countSpan) countSpan.textContent = cart.length;
}

function showToast(message) {
  const toast = document.createElement("div");
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#2ecc71",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    zIndex: "9999"
  });
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

function addToCart(name, price) {
  cart.push({ name, price });
  saveCart();
  updateCartCount();
  updateCartPopup();
  showToast(`${name} ajouté au panier !`);
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCartCount();
  updateCartPopup();
}

function emptyCart() {
  if (confirm("Voulez-vous vraiment vider le panier ?")) {
    cart = [];
    saveCart();
    updateCartCount();
    updateCartPopup();
    showToast("Panier vidé !");
  }
}

function updateCartPopup() {
  const popup = document.getElementById("cart-popup");
  const itemsList = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("cart-total");

  if (!popup || !itemsList || !totalDisplay) return;

  itemsList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += parseInt(item.price);
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.price} FCFA`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Supprimer";
    removeBtn.onclick = () => removeItem(index);
    li.appendChild(removeBtn);
    itemsList.appendChild(li);
  });

  totalDisplay.textContent = `Total : ${total} FCFA`;
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  updateCartPopup();

  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = btn.dataset.price;
      addToCart(name, price);
    });
  });

  const cartSummary = document.getElementById("cart-summary");
  const popup = document.getElementById("cart-popup");

  if (cartSummary && popup) {
    cartSummary.addEventListener("click", () => {
      popup.style.display = (popup.style.display === "block") ? "none" : "block";
    });
  }

  const closeBtn = document.getElementById("close-cart");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      popup.style.display = "none";
    });
  }

  if (window.location.href.includes("contact.html")) {
    const produitInput = document.getElementById("produit");
    if (produitInput && cart.length > 0) {
      produitInput.value = cart.map(p => p.name).join(", ");
    }
  }

  // **AJAX Form submission pour Formspree**
  const form = document.querySelector("form.formulaire");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const action = form.action;

    try {
      const response = await fetch(action, {
        method: "POST",
        body: formData,
        headers: { "Accept": "application/json" }
      });

      if (response.ok) {
        alert("Merci ! Votre commande a bien été envoyée.");
        form.reset();
      } else {
        alert("Oups, une erreur est survenue. Merci de réessayer.");
      }
    } catch (error) {
      alert("Erreur réseau, merci de vérifier votre connexion.");
    }
  });
});
