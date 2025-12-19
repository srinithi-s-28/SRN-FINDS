// Admin Dashboard JavaScript
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let lastOrderCount = parseInt(localStorage.getItem('lastOrderCount')) || 0;

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
    checkForNewOrders();
    
    // Check for new orders every 5 seconds
    setInterval(checkForNewOrders, 5000);
});

function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="no-orders">No orders yet</p>';
        return;
    }
    
    ordersList.innerHTML = orders.map(order => `
        <div class="order-card ${order.isNew ? 'new-order' : ''}">
            <div class="order-header">
                <h3>Order #${order.orderId}</h3>
                <span class="order-date">${new Date(order.timestamp).toLocaleString()}</span>
            </div>
            <div class="order-details">
                <p><strong>Customer:</strong> ${order.customerName}</p>
                <p><strong>Phone:</strong> ${order.phone}</p>
                <p><strong>Address:</strong> ${order.address}, ${order.city} ${order.zipCode}</p>
                <p><strong>Total:</strong> $${order.total}</p>
                <p><strong>Payment:</strong> ${order.paymentMethod}</p>
            </div>
            <div class="order-items">
                <h4>Items:</h4>
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} x${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).reverse().join('');
}

function checkForNewOrders() {
    const currentOrders = JSON.parse(localStorage.getItem('orders')) || [];
    const currentCount = currentOrders.length;
    
    if (currentCount > lastOrderCount) {
        const newOrdersCount = currentCount - lastOrderCount;
        showNotification(`${newOrdersCount} new order(s) received!`);
        
        // Mark new orders
        for (let i = lastOrderCount; i < currentCount; i++) {
            if (currentOrders[i]) {
                currentOrders[i].isNew = true;
            }
        }
        
        orders = currentOrders;
        localStorage.setItem('orders', JSON.stringify(orders));
        loadOrders();
        
        lastOrderCount = currentCount;
        localStorage.setItem('lastOrderCount', lastOrderCount.toString());
    }
    
    // Update notification count
    const newOrdersCount = orders.filter(order => order.isNew).length;
    document.getElementById('notificationCount').textContent = newOrdersCount;
    document.getElementById('notificationCount').style.display = newOrdersCount > 0 ? 'flex' : 'none';
}

function showNotification(message) {
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.innerHTML = `
        <i class="fas fa-shopping-bag"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Play notification sound (optional)
    playNotificationSound();
}

function playNotificationSound() {
    // Create audio context for notification sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}