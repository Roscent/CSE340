document.addEventListener('DOMContentLoaded', function() {
    // Handle add to cart from favorites
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const invId = this.dataset.invId;
            addToCart(invId);
        });
    });
    
    // Handle remove from favorites
    const removeButtons = document.querySelectorAll('.btn-remove-favorite');
    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const invId = this.dataset.invId;
            removeFromFavorites(invId);
        });
    });
    
    // Handle favorite buttons throughout the site
    document.querySelectorAll('.btn-favorite, .btn-favorite-large').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const inv_id = e.currentTarget.dataset.invId;
            
            try {
                const response = await fetch('/favorites/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ inv_id: inv_id })
                });
                
                if (response.status === 401) {
                    window.location.href = '/account/login';
                    return;
                }
                
                if (response.ok) {
                    const data = await response.json();
                    const favCountEl = document.getElementById('favorites-count');
                    if (favCountEl) {
                        favCountEl.textContent = data.favCount;
                    }
                    
                    // Toggle active class for visual feedback
                    e.target.classList.toggle('active');
                    
                    showNotification("Added to favorites!", 'success');
                }
            } catch (err) {
                console.error("Error:", err);
                showNotification("Error adding to favorites", 'error');
            }
        });
    });
    
    // Check favorite status on inventory pages
    checkFavoriteStatus();
});

function addToCart(invId) {
    fetch('/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inv_id: invId, quantity: 1 })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Item added to cart!', 'success');
            updateCartCount(data.cartCount);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showNotification('Error adding to cart', 'error');
    });
}

function removeFromFavorites(invId) {
    if (!confirm('Remove from favorites?')) return;
    
    fetch('/favorites/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inv_id: invId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Remove the card from DOM
            const card = document.querySelector(`.favorite-card[data-inv-id="${invId}"]`);
            if (card) {
                card.remove();
            }
            // Update favorites count
            updateFavoritesCount(data.favCount);
            
            // If no favorites left, reload to show empty message
            if (document.querySelectorAll('.favorite-card').length === 0) {
                location.reload();
            }
            
            showNotification('Removed from favorites', 'success');
        }
    })
}

function checkFavoriteStatus() {
    const favoriteBtns = document.querySelectorAll('.btn-favorite, .btn-favorite-large');
    favoriteBtns.forEach(btn => {
        const invId = btn.dataset.invId;
        if (invId) {
            fetch(`/favorites/check/${invId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.isFavorite) {
                        btn.classList.add('active');
                        if (btn.classList.contains('btn-favorite-large')) {
                            btn.textContent = 'Remove from Favorites';
                        }
                    } else {
                        if (btn.classList.contains('btn-favorite-large')) {
                            btn.textContent = 'Add to Favorites';
                        }
                    }
                })
                .catch(error => console.error('Error checking favorite:', error));
        }
    });
}

function updateCartCount(count) {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        cartCountEl.textContent = count;
    }
}

function updateFavoritesCount(count) {
    const favCountEl = document.getElementById('favorites-count');
    if (favCountEl) {
        favCountEl.textContent = count;
    }
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