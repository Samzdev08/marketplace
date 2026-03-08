const userService = require('../services/user.services');
const uploader = require('../helper/uploads.helper');
const bcrypt = require('bcrypt')
const multer = require('multer');


exports.createUser = async (req, res) => {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const { fullname, email, password, password_verify } = req.body;

    if (!fullname?.trim()) errors.push('Le nom complet est requis');
    if (!email?.trim()) errors.push("L'email est requis");
    if (!emailRegex.test(email)) {
        errors.push("L'email doit être valide");
    }
    if (password !== password_verify) errors.push("Pas le meme mot de passe");
    if (!password?.trim()) errors.push('Le mot de passe est requis');
    if (password?.length < 6) errors.push('Le mot de passe doit faire au moins 6 caractères');

    if (errors.length > 0) {
        return res.status(400).json({ success: false, message: errors[0], type: 'error' });
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await userService.create(fullname, email, hashedPassword, null);
    if (!result.success) return res.status(500).json({ success: false, message: result.message, type: "error" });
    return res.json({ success: true, message: result.message });
};

exports.authentification = async (req, res) => {
    const errors = [];
    const { email, password } = req.body;

    if (!email?.trim()) errors.push("L'email est requis");
    if (!password?.trim()) errors.push('Le mot de passe est requis');

    if (errors.length > 0) {
        return res.status(400).json({ success: false, message: errors[0], type: 'error' });
    }
    const result = await userService.auth(email, password);
    if (!result.success) return res.status(500).json({ success: false, message: result.message, type: "error" });
    return res.json({ success: true, message: result.message, id: result.id });
};

exports.getInfos = async (req, res) => {

    const { id } = req.params;
    const errors = [];

    if (!id) {
        errors.push('Id manquant')
        return res.status(400).json({ success: false, message: errors[0], type: 'error' });
    }

    const result = await userService.getById(id);
    if (!result.success) return res.status(500).json({ success: false, message: result.message, type: "error" });
    return res.json(result.message);

}

exports.getListings = async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ success: false, message: 'Id manquant', type: 'error' });

    const result = await userService.getListings(id);
    if (!result.success) return res.status(500).json({ success: false, message: result.message, type: 'error' });

    return res.json(result.message);
}

exports.getPurchase = async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({ success: false, message: 'Id manquant', type: 'error' });

    const result = await userService.getPurchases(id);
    if (!result.success) return res.status(500).json({ success: false, message: result.message, type: 'error' });

    return res.json(result.message);
}

exports.updateUser = async (req, res) => {
    uploader.single("avatar_url")(req, res, async (err) => {

        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Erreur upload : ${err.message}`, type: "error" });
        } else if (err) {
            return res.status(400).json({ message: err.message, type: "error" });
        }

        const errors = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let { fullname, bio, email, id } = req.body;
        
        const avatar_url = req.file ? `/uploads/${req.file.filename}` : null;

        if (!fullname?.trim()) errors.push('Le nom complet est requis');
        if (!email?.trim()) errors.push("L'email est requis");
        if (!emailRegex.test(email)) {
            errors.push("L'email doit être valide");
        }
        if (!bio?.trim()) bio = `Pas de biographie pour l'instant`;

        if (bio.length > 400) errors.push('Nombre de caractères dépassé pour la biographie > 400');

        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: errors[0], type: 'error' });
        }

        const result = await userService.updateById(fullname, email, bio, avatar_url, id);
        if (!result.success) return res.status(500).json({ success: false, message: result.message, type: "error" });
        return res.json({ success: true, message: result.message });
    })
};




