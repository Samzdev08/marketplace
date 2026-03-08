const db = require('../config/db');
const bcrypt = require('bcrypt')

exports.create = async (Fullname, email, password, bio) => {
    const [rows] = await db.query(`
        INSERT INTO users 
        (full_name, email, password_hash, 
        avatar_url, bio) 
        VALUES (?, ?, ?, null, ?)
    `, [Fullname, email, password, bio]);
    return rows.affectedRows > 0 ? { success: true, message: 'Compte créé' } :
        { success: false, message: 'Création du compte échoué' };
};

exports.updateById = async (fullname, email, bio, avatar_url, id) => {
    try {
        await db.query(`
            UPDATE users 
            SET 
                full_name  = ?,
                email      = ?,
                bio        = ?,
                avatar_url = COALESCE(?, avatar_url)
            WHERE id = ?`,
            [fullname, email, bio, avatar_url, id]
        );

        const [rows] = await db.query(`
            SELECT
                u.id,
                u.full_name,
                u.email,
                u.avatar_url,
                u.bio,
                COUNT(DISTINCT l.id) AS listings_count,
                COUNT(DISTINCT o.id) AS purchases_count
            FROM users u
            LEFT JOIN listings l ON l.seller_id = u.id AND l.status != 'archived'
            LEFT JOIN orders   o ON o.buyer_id  = u.id AND o.status = 'completed'
            WHERE u.id = ?
            GROUP BY u.id, u.full_name, u.email, u.avatar_url, u.bio`,
            [id]
        );

        return { success: true, message: rows[0] };
    } catch (error) {
        return { success: false, message: 'Erreur serveur', error };
    }
};

exports.getById = async (idUser) => {
    const [rows] = await db.query(`
    SELECT
        u.id,
        u.full_name,
        u.email,
        u.avatar_url,
        u.bio,
        COUNT(DISTINCT l.id)  AS listings_count,
        COUNT(DISTINCT o.id)  AS purchases_count
    FROM users u
    LEFT JOIN listings l ON l.seller_id = u.id AND l.status != 'archived'
    LEFT JOIN orders   o ON o.buyer_id  = u.id AND o.status  = 'completed'
    WHERE u.id = ?
    GROUP BY u.id, u.full_name, u.email, u.avatar_url, u.bio`, [idUser]);

    return rows.length > 0
        ? { success: true, message: rows[0] }
        : { success: false, message: 'id introuvable' };
};

exports.auth = async (email, password) => {


    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length > 0) {

        const user = rows[0]
        const userPassoword = user['password_hash'];

        const result = await bcrypt.compare(password, userPassoword);


        if (result) {
            return { success: true, message: `Bienvenue ${user['full_name']}`, type: "error", id: user['id'] };
        }
        return { success: false, message: "Échec de la connexion", type: "error" };


    }

    return { success: false, message: "Email ou mot de passe incorrect", type: "error" };

}

exports.getListings = async (id) => {

    try {
        const [rows] = await db.query(`
            SELECT
                l.id,
                l.title,
                l.price,
                l.image_url,
                l.status,
                c.name AS category
            FROM listings l
            JOIN categories c ON c.id = l.category_id
            WHERE l.seller_id = ?
              AND l.status != 'archived'
            ORDER BY l.created_at DESC
        `, [id]);

        return { success: true, message: rows };

    } catch (error) {
        return { message: 'Erreur serveur', error };
    }
};

exports.getPurchases = async (id) => {

    try {
        const [rows] = await db.query(`
            SELECT
                l.title,
                l.image_url,
                c.name      AS category,
                u.full_name AS seller_name,
                o.amount,
                o.created_at
            FROM orders o
            JOIN listings   l ON l.id  = o.listing_id
            JOIN categories c ON c.id  = l.category_id
            JOIN users      u ON u.id  = l.seller_id
            WHERE o.buyer_id = ?
              AND o.status   = 'completed'
            ORDER BY o.created_at DESC
        `, [id]);

        return { success: true, message: rows };

    } catch (error) {
        return { success: false, message: 'Erreur serveur', error };
    }
};

