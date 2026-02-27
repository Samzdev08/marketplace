const db = require('../config/db');

exports.getAll = async () => {
    try {
        const [rows] = await db.query(`
            SELECT
                l.id,
                l.title,
                l.description,
                l.price,
                l.image_url,
                l.status,
                l.created_at,
                c.name AS category,
                u.full_name AS seller_name,
                u.avatar_url AS seller_avatar
            FROM listings l
            JOIN users u ON u.id = l.seller_id
            JOIN categories c ON c.id = l.category_id
            ORDER BY l.created_at DESC
        `);
        return { success: true, data: rows };
    } catch (err) {
        return { success: false, message: err.message };
    }
};


exports.getById = async (idProduct) => {
    const [rows] = await db.query(`
        SELECT
            l.id,
            l.title,
            l.description,
            l.price,
            l.image_url,
            l.status,
            l.created_at,
            c.name AS category,
            u.full_name AS seller_name,
            u.avatar_url AS seller_avatar
        FROM listings l
        JOIN users u ON u.id = l.seller_id
        JOIN categories c ON c.id = l.category_id
        WHERE l.id = ?
    `, [idProduct]);
    return rows[0] || null;
};

exports.deleteById = async (idProduct) => {
    const result = await db.query(` DELETE FROM listings
        WHERE id = ?
    `, [idProduct]);
    return result.affectedRows > 0 ?? null ;
};

exports.create = async (idSeller, idCategorie, title, desc, price, url) => {
    const [result] = await db.query(`
        INSERT INTO listings (seller_id, category_id, title, description, price, image_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [idSeller, idCategorie, title, desc, price, url]);
    return result.affectedRows > 0;
};











