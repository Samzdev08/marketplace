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

exports.auth = async (email, password) => {


    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length > 0) {

        const user = rows[0]
        const userPassoword = user['password_hash'];

        const result = await bcrypt.compare(password, userPassoword);


        if (result) {
            return { success: true, message: `Bienvenue ${user['full_name']}`, type:"error", id: user['id']};
        }
        return { success: false, message: "Échec de la connexion", type: "error" };


    }

    return { success: false, message: "Email ou mot de passe incorrect", type: "error" };

}

