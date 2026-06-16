// 1. Cart State Variables
let cart = [];

// 2. DOM Elements Selector
const cartIconBtn = document.getElementById('cart-icon-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartCountElement = document.getElementById('cart-count');
const cartTotalAmount = document.getElementById('cart-total-amount');

// 3. Slide Drawer UI Controls
cartIconBtn.addEventListener('click', () => toggleCart(true));
closeCartBtn.addEventListener('click', () => toggleCart(false));
cartOverlay.addEventListener('click', () => toggleCart(false));

function toggleCart(open) {
    if (open) {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('open');
    } else {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('open');
    }
}

// 4. Extract item details directly from the HTML Document layout 
window.handleAddToCart = function(productId) {
    // Find the specific product card on the screen using its data-id attribute
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
    
    // Extract information from elements inside that specific card
    const name = productCard.querySelector('.prod-name').innerText;
    const imgUrl = productCard.querySelector('.prod-img').getAttribute('src');
    const priceText = productCard.querySelector('.product-price').innerText;
    const price = parseFloat(priceText.replace('$', '')); // Convert "$199.99" to number 199.99

    // Check if item already exists in the cart array
    const existingCartItem = cart.find(item => item.id === productId);

    if (existingCartItem) {
        existingCartItem.quantity += 1;
    } else {
        cart.push({ id: productId, name, price, image: imgUrl, quantity: 1 });
    }
    
    updateCartDOM();
    toggleCart(true); // Pop open the cart drawer smoothly
};

window.changeQuantity = function(productId, delta) {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;

    cartItem.quantity += delta;
    
    if (cartItem.quantity <= 0) {
        window.removeFromCart(productId);
    } else {
        updateCartDOM();
    }
};

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDOM();
};

function updateCartDOM() {
    cartItemsContainer.innerHTML = "";
    let totalItemCount = 0;
    let totalPriceSum = 0;

    cart.forEach(item => {
        totalItemCount += item.quantity;
        totalPriceSum += item.price * item.quantity;

        const cartItemRow = document.createElement('div');
        cartItemRow.classList.add('cart-item');
        cartItemRow.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h5>${item.name}</h5>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
        `;
        cartItemsContainer.appendChild(cartItemRow);
    });

    // Sync state numbers to the UI text layers
    cartCountElement.innerText = totalItemCount;
    cartTotalAmount.innerText = `$${totalPriceSum.toFixed(2)}`;

    if(cart.length === 0) {
        cartItemsContainer.innerHTML = `<p style="text-align:center; color: var(--text-muted); margin-top:20px;">Your cart is empty.</p>`;
    }
}