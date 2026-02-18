document.addEventListener('DOMContentLoaded', function() {
    // Handle quantity updates
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const cartId = this.dataset.cartId;
            const quantity = parseInt(this.value);
            
            if (quantity < 1) {
                this.value = 1;
                return;
            }
            
            updateCartItem(cartId, quantity);
        });
    });
    
    // Handle remove buttons
    const removeButtons = document.querySelectorAll('.btn-remove');
    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const cartId = this.dataset.cartId;
            removeCartItem(cartId);
        });
    });
    
    // Handle checkout
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            window.location.href = '/checkout';
        });
    }
    
    // Handle clear cart
    const clearBtn = document.querySelector('.btn-clear');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Clear your entire cart?')) {
                clearCart();
            }
        });
    }
    
    // Handle add to cart buttons throughout the site
    document.querySelectorAll('.btn-add-to-cart, .btn-add-to-cart-large').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const inv_id = e.currentTarget.dataset.invId;
            console.log("Adding to cart, ID:", inv_id);
            
            try {
                const response = await fetch('/cart/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ inv_id: inv_id })
                });

                if (response.status === 401) {
                    window.location.href = '/account/login';
                    return;
                }

                const data = await response.json();
                if (data.success) {
                    const cartCountEl = document.getElementById('cart-count');
                    if (cartCountEl) {
                        cartCountEl.textContent = data.cartCount;
                    }
                    showNotification("Vehicle added to your cart!", 'success');
                }
            } catch (error) {
                console.error('Error:', error);
                showNotification("Error adding to cart", 'error');
            }
        });
    });
});

function updateCartItem(cartId, quantity) {
    fetch('/cart/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart_id: cartId, quantity: quantity })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload(); // Refresh to show updated totals
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification("Error updating cart", 'error');
    });
}

function removeCartItem(cartId) {
    if (!confirm('Remove this item from cart?')) return;
    
    fetch('/cart/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inv_id: inv_id })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification("Error removing item", 'error');
    });
}

function clearCart() {
    fetch('/cart/clear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification("Error clearing cart", 'error');
    });
}

function showNotification(message, type = 'success') {
    // Remove any existing notification
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create new notification
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s reverse';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}