// Product Data
const products = [
    {
        id: 1,
        name: "Gold Chain Bracelet Set",
        price: 45.99,
        category: "jewelry",
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop",
        description: "Delicate gold-plated chain bracelets in layered design. Set of 3 different chain styles for elegant stacking."
    },
    {
        id: 2,
        name: "Pearl Chain Bracelet",
        price: 38.99,
        category: "jewelry",
        image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
        description: "Classic pearl bracelet with gold chain accents. Perfect for both casual and formal occasions."
    },
    {
        id: 3,
        name: "Dainty Gold Necklace",
        price: 52.99,
        category: "jewelry",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop",
        description: "Minimalist gold chain necklace with delicate pendant. Adjustable length for perfect layering."
    },
    {
        id: 4,
        name: "Layered Chain Necklace Set",
        price: 67.99,
        category: "jewelry",
        image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
        description: "Three-piece layered necklace set in rose gold. Different lengths create the perfect layered look."
    },
    {
        id: 5,
        name: "Beaded Charm Bracelet",
        price: 29.99,
        category: "jewelry",
        image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop",
        description: "Colorful beaded bracelet with gold charms. Elastic band for comfortable all-day wear."
    },
    {
        id: 6,
        name: "Silver Chain Necklace",
        price: 41.99,
        category: "jewelry",
        image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=400&fit=crop",
        description: "Sterling silver chain necklace with heart pendant. Hypoallergenic and tarnish-resistant."
    },
    {
        id: 7,
        name: "Velvet Hair Scrunchies",
        price: 18.99,
        category: "hair",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop",
        description: "Luxurious velvet scrunchies in neutral tones. Set of 6 colors that complement any outfit."
    },
    {
        id: 8,
        name: "Pearl Hair Clips Set",
        price: 24.99,
        category: "hair",
        image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop",
        description: "Elegant pearl-adorned hair clips in gold setting. Set of 4 clips for sophisticated hairstyles."
    },
    {
        id: 9,
        name: "Silk Hair Scrunchies",
        price: 32.99,
        category: "hair",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop",
        description: "100% mulberry silk scrunchies that prevent hair damage. Set of 5 in pastel colors."
    },
    {
        id: 10,
        name: "Vintage Hair Clips",
        price: 21.99,
        category: "hair",
        image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop",
        description: "Retro-inspired hair clips with intricate designs. Set of 8 clips in antique gold and silver finishes."
    }
];

// State Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let currentFilter = 'all';

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartIcon = document.getElementById('cartIcon');
const closeCart = document.getElementById('closeCart');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const filterBtns = document.querySelectorAll('.filter-btn');
const modalOverlay = document.getElementById('modalOverlay');
const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartUI();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.category;
            renderProducts();
        });
    });

    // Cart toggle
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('open');
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });

    // Modal close
    closeModal.addEventListener('click', closeProductModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeProductModal();
        }
    });

    // Modal quantity controls
    document.getElementById('decreaseQty').addEventListener('click', () => {
        const qtyElement = document.getElementById('modalQuantity');
        let qty = parseInt(qtyElement.textContent);
        if (qty > 1) {
            qtyElement.textContent = qty - 1;
        }
    });

    document.getElementById('increaseQty').addEventListener('click', () => {
        const qtyElement = document.getElementById('modalQuantity');
        let qty = parseInt(qtyElement.textContent);
        qtyElement.textContent = qty + 1;
    });

    // Checkout flow
    checkoutBtn.addEventListener('click', openCheckout);
    closeCheckout.addEventListener('click', closeCheckoutModal);
    
    document.getElementById('nextToPayment').addEventListener('click', goToPayment);
    document.getElementById('backToAddress').addEventListener('click', goToAddress);
    document.getElementById('paymentForm').addEventListener('submit', placeOrder);
    document.getElementById('continueShopping').addEventListener('click', closeCheckoutModal);
    
    // Payment method toggle
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', togglePaymentMethod);
    });
    
    // Card number formatting
    document.getElementById('cardNumber').addEventListener('input', formatCardNumber);
    document.getElementById('expiryDate').addEventListener('input', formatExpiryDate);
}

// Render Products
function renderProducts() {
    const filteredProducts = currentFilter === 'all' 
        ? products 
        : products.filter(product => product.category === currentFilter);

    productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="openProductModal(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <div class="product-header">
                    <div>
                        <div class="product-name">${product.name}</div>
                        <div class="product-price">$${product.price}</div>
                    </div>
                    <button class="wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}" 
                            onclick="event.stopPropagation(); toggleWishlist(${product.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Product Modal
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalPrice').textContent = `$${product.price}`;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalQuantity').textContent = '1';

    // Add to cart from modal
    document.getElementById('addToCartModal').onclick = () => {
        const quantity = parseInt(document.getElementById('modalQuantity').textContent);
        addToCart(productId, quantity);
        closeProductModal();
    };

    modalOverlay.classList.add('active');
}

function closeProductModal() {
    modalOverlay.classList.remove('active');
}

// Cart Functions
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    updateCartUI();
    saveCart();
    
    // Show feedback
    showNotification('Added to cart!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            saveCart();
        }
    }
}

function updateCartUI() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

    // Update cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
                <div class="cart-item-controls">
                    <button class="qty-control" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-control" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Wishlist Functions
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist');
    } else {
        wishlist.push(productId);
        showNotification('Added to wishlist!');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    renderProducts(); // Re-render to update heart icons
}

// Utility Functions
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Checkout Functions
function openCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('finalTotal').textContent = total.toFixed(2);
    
    checkoutModal.classList.add('active');
    cartSidebar.classList.remove('open');
}

function closeCheckoutModal() {
    checkoutModal.classList.remove('active');
    resetCheckoutForm();
}

function goToPayment() {
    const form = document.getElementById('addressForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    document.getElementById('addressStep').classList.remove('active');
    document.getElementById('paymentStep').classList.add('active');
}

function goToAddress() {
    document.getElementById('paymentStep').classList.remove('active');
    document.getElementById('addressStep').classList.add('active');
}

function placeOrder(e) {
    e.preventDefault();
    
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        
        if (!cardNumber || !expiryDate || !cvv) {
            showNotification('Please fill in all card details');
            return;
        }
    }
    
    // Generate order ID
    const orderId = 'SRN' + Date.now().toString().slice(-6);
    document.getElementById('orderId').textContent = orderId;
    
    // Save order for admin
    saveOrderForAdmin(orderId);
    
    // Clear cart
    cart = [];
    updateCartUI();
    saveCart();
    
    // Show confirmation
    document.getElementById('paymentStep').classList.remove('active');
    document.getElementById('confirmationStep').classList.add('active');
}

function resetCheckoutForm() {
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('addressStep').classList.add('active');
    
    document.getElementById('addressForm').reset();
    document.getElementById('paymentForm').reset();
}

function togglePaymentMethod() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const cardDetails = document.getElementById('cardDetails');
    
    if (paymentMethod === 'card') {
        cardDetails.style.display = 'block';
    } else {
        cardDetails.style.display = 'none';
    }
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
}

function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
}

// Save order for admin notification
function saveOrderForAdmin(orderId) {
    const orderData = {
        orderId: orderId,
        timestamp: Date.now(),
        customerName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        zipCode: document.getElementById('zipCode').value,
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2),
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        isNew: true
    };
    
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #d4a574;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1003;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}