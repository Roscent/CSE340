const pool = require("../database/");

/* ***************************
 *  Add item to favorites
 * ************************** */
async function addToFavorites(account_id, inv_id) {
    try {
        // Check if already in favorites
        const existing = await pool.query(
            "SELECT * FROM favorites WHERE account_id = $1 AND inv_id = $2",
            [account_id, inv_id]
        );

        if (existing.rows.length > 0) {
            return { message: "Already in favorites" };
        }

        const sql = "INSERT INTO favorites (account_id, inv_id) VALUES ($1, $2) RETURNING *";
        const result = await pool.query(sql, [account_id, inv_id]);
        return result.rows[0];
    } catch (error) {
        console.error("Error adding to favorites:", error);
        throw error;
    }
}

/* ***************************
 *  Remove from favorites
 * ************************** */
async function removeFromFavorites(account_id, inv_id) {
    try {
        const sql = "DELETE FROM favorites WHERE account_id = $1 AND inv_id = $2 RETURNING *";
        const result = await pool.query(sql, [account_id, inv_id]);
        return result.rows[0];
    } catch (error) {
        console.error("Error removing from favorites:", error);
        throw error;
    }
}

/* ***************************
 *  Get user's favorites
 * ************************** */
async function getFavorites(account_id) {
    try {
        const sql = `
            SELECT f.*, i.inv_make, i.inv_model, i.inv_year, i.inv_price, 
                   i.inv_image, i.inv_thumbnail, i.inv_description
            FROM favorites f
            JOIN inventory i ON f.inv_id = i.inv_id
            WHERE f.account_id = $1
            ORDER BY f.date_added DESC
        `;
        const result = await pool.query(sql, [account_id]);
        return result.rows;
    } catch (error) {
        console.error("Error getting favorites:", error);
        throw error;
    }
}

/* ***************************
 *  Check if item is in favorites
 * ************************** */
async function isInFavorites(account_id, inv_id) {
    try {
        const sql = "SELECT * FROM favorites WHERE account_id = $1 AND inv_id = $2";
        const result = await pool.query(sql, [account_id, inv_id]);
        return result.rows.length > 0;
    } catch (error) {
        console.error("Error checking favorites:", error);
        return false;
    }
}

/* ***************************
 *  Get favorites count for a user
 * ************************** */
async function getFavoritesCount(account_id) {
    try {
        const sql = "SELECT COUNT(*) as count FROM favorites WHERE account_id = $1";
        const result = await pool.query(sql, [account_id]);
        return parseInt(result.rows[0].count);
    } catch (error) {
        console.error("Error getting favorites count:", error);
        return 0;
    }
}

module.exports = {
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    isInFavorites,
    getFavoritesCount
};