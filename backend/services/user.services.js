const db = require('../config/db');

exports.create = async (Fullname, email, password, bio) => {
    const [rows] = await db.query(`
        INSERT INTO users 
        (full_name, email, password_hash, 
        avatar_url, bio) 
        VALUES (?, ?, ?, null, ?)
    `, [Fullname, email , password, bio]);
    return rows.affectedRows > 0;
};

exports.updateById = async (Fullname, bio, avatar_url, id) => {
    const [rows] = await db.query(`
        UPDATE users 
        SET full_name = ?, bio = ?, avatar_url = COALESCE(?, avatar_url)
        WHERE id = ?
    `, [Fullname, email, bio, avatar_url, id]);
    return rows.affectedRows > 0;
};

exports.getById = async (idUser) => {
    const [rows] = await db.query(`SELECT id, 
        full_name, email, avatar_url, bio, 
        created_at 
        FROM users WHERE id = ?
    `, [idUser]);
    return rows.affectedRows > 0;
};

