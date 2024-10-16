let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentPage = 1;
const itemsPerPage = 10;

// Fetch products on page load
document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector("#product-list")) {
        fetchProducts();
        document.getElementById("load-more").addEventListener("click", loadMoreProducts);
        document.getElementById("search-bar").addEventListener("input", searchProducts);
    }

    if (document.querySelector("#product-detail")) {
        const productId = new URLSearchParams(window.location.search).get("id");
        fetchProductDetails(productId);
    }

    if (document.querySelector("#cart-items")) {
        displayCart();
    }

    if (document.querySelector("#checkout-form")) {
        document.getElementById("checkout-form").addEventListener("submit", handleCheckout);
    }
});

// Fetch all products
async function fetchProducts() {
    try {
        const res = await fetch("https://fakestoreapi.com/products");
        products = await res.json();
        displayProducts();
    } catch (error) {
        document.getElementById("product-list").innerHTML = `<p>Error fetching products</p>`;
    }
}

// Display products with pagination
function displayProducts() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ''; // Clear previous products
    const slicedProducts = products.slice(0, currentPage * itemsPerPage);
    slicedProducts.forEach(product => {
        productList.innerHTML += `
      <div class="product">
        <img src="${product.image}" alt="${product.title}">
        <h2>${product.title}</h2>
        <p>${product.description.substring(0, 100)}...</p>
        <p class="product-price">$${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
        <a href="product.html?id=${product.id}">View Details</a>
      </div>
    `;
    });

    if (currentPage * itemsPerPage >= products.length) {
        document.getElementById("load-more").style.display = "none"; // Hide load more button
    }
}

// Load more products (lazy loading)
function loadMoreProducts() {
    currentPage++;
    displayProducts();
}

// Search products
function searchProducts() {
    const searchTerm = document.getElementById("search-bar").value.toLowerCase();
    const filteredProducts = products.filter(product => product.title.toLowerCase().includes(searchTerm));
    displayFilteredProducts(filteredProducts);
}

// Display filtered products based on search
function displayFilteredProducts(filteredProducts) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ''; // Clear previous products
    filteredProducts.forEach(product => {
        productList.innerHTML += `
      <div class="product">
        <img src="${product.image}" alt="${product.title}">
        <h2>${product.title}</h2>
        <p>${product.description.substring(0, 100)}...</p>
        <p class="product-price">$${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
        <a href="product.html?id=${product.id}">View Details</a>
      </div>
    `;
    });
}

// Fetch product details
async function fetchProductDetails(productId) {
    try {
        const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
        const product = await res.json();
        displayProductDetails(product);
    } catch (error) {
        document.getElementById("product-detail").innerHTML = `<p>Error fetching product details</p>`;
    }
}

// Display product details
function displayProductDetails(product) {
    const productDetail = document.getElementById("product-detail");
    productDetail.innerHTML = `
    <img src="${product.image}" alt="${product.title}">
    <h2>${product.title}</h2>
    <p>${product.description}</p>
    <p class="product-price">$${product.price}</p>
    <button onclick="addToCart(${product.id})">Add to Cart</button>
  `;
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart");
}

// Display cart
function displayCart() {
    const cartItems = document.getElementById("cart-items");
    if (cart.length === 0) {
        document.getElementById("empty-cart").style.display = "block";
    } else {
        document.getElementById("empty-cart").style.display = "none";
        cartItems.innerHTML = '';
        cart.forEach(item => {
            cartItems.innerHTML += `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.title}">
          <h2>${item.title}</h2>
          <p class="cart-item-price">$${item.price}</p>
        </div>
      `;
        });
        document.getElementById("checkout-btn").disabled = false;
    }
}

// Handle checkout
function handleCheckout(event) {
    event.preventDefault();
    localStorage.removeItem("cart"); // Clear cart after checkout
    window.location.href = "confirm.html";
}
