const pool = require("../database/");

/* ***************************
 *  Add item to cart
 * ************************** */
async function addToCart(account_id, inv_id, quantity = 1) {
    try {
        // Check if item already exists in cart
        const existingItem = await pool.query(
            "SELECT * FROM cart WHERE account_id = $1 AND inv_id = $2",
            [account_id, inv_id]
        );

        if (existingItem.rows.length > 0) {
            // Update quantity
            const newQuantity = existingItem.rows[0].quantity + quantity;
            const sql = "UPDATE cart SET quantity = $1 WHERE account_id = $2 AND inv_id = $3 RETURNING *";
            const result = await pool.query(sql, [newQuantity, account_id, inv_id]);
            return result.rows[0];
        } else {
            // Insert new item
            const sql = "INSERT INTO cart (account_id, inv_id, quantity) VALUES ($1, $2, $3) RETURNING *";
            const result = await pool.query(sql, [account_id, inv_id, quantity]);
            return result.rows[0];
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
    }
}

/* ***************************
 *  Get cart items for a user
 * ************************** */
async function getCartItems(account_id) {
    try {
        const sql = `
            SELECT c.*, i.inv_make, i.inv_model, i.inv_year, i.inv_price, 
                   i.inv_image, i.inv_thumbnail, i.inv_description,
                   (c.quantity * i.inv_price) as subtotal
            FROM cart c
            JOIN inventory i ON c.inv_id = i.inv_id
            WHERE c.account_id = $1
            ORDER BY c.date_added DESC
        `;
        const result = await pool.query(sql, [account_id]);
        return result.rows;
    } catch (error) {
        console.error("Error getting cart items:", error);
        throw error;
    }
}

/* ***************************
 *  Update cart item quantity
 * ************************** */
async function updateCartQuantity(cart_id, quantity) {
    try {
        if (quantity <= 0) {
            return await removeFromCart(cart_id);
        }
        const sql = "UPDATE cart SET quantity = $1 WHERE cart_id = $2 RETURNING *";
        const result = await pool.query(sql, [quantity, cart_id]);
        return result.rows[0];
    } catch (error) {
        console.error("Error updating cart quantity:", error);
        throw error;
    }
}

/* ***************************
 *  Remove item from cart
 * ************************** */
async function removeFromCart(cart_id) {
    try {
        const sql = "DELETE FROM cart WHERE cart_id = $1 RETURNING *";
        const result = await pool.query(sql, [cart_id]);
        return result.rows[0];
    } catch (error) {
        console.error("Error removing from cart:", error);
        throw error;
    }
}

/* ***************************
 *  Clear entire cart for a user
 * ************************** */
async function clearCart(account_id) {
    try {
        const sql = "DELETE FROM cart WHERE account_id = $1";
        const result = await pool.query(sql, [account_id]);
        return result;
    } catch (error) {
        console.error("Error clearing cart:", error);
        throw error;
    }
}

/* ***************************
 *  Get cart count for a user
 * ************************** */
async function getCartCount(account_id) {
    try {
        const sql = "SELECT COALESCE(SUM(quantity), 0) as count FROM cart WHERE account_id = $1";
        const result = await pool.query(sql, [account_id]);
        return parseInt(result.rows[0].count);
    } catch (error) {
        console.error("Error getting cart count:", error);
        return 0;
    }
}

/* ***************************
 *  Calculate cart total
 * ************************** */
async function getCartTotal(account_id) {
    try {
        const sql = `
            SELECT COALESCE(SUM(c.quantity * i.inv_price), 0) as total
            FROM cart c
            JOIN inventory i ON c.inv_id = i.inv_id
            WHERE c.account_id = $1
        `;
        const result = await pool.query(sql, [account_id]);
        return parseFloat(result.rows[0].total);
    } catch (error) {
        console.error("Error calculating cart total:", error);
        return 0;
    }
}

module.exports = {
    addToCart,
    getCartItems,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal
};