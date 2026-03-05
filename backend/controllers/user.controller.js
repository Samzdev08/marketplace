const userService = require('../services/user.services');
const bcrypt = require('bcrypt')


exports.createUser = async (req, res) => {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const { fullname, email, password, password_verify} = req.body;

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
    return res.json({success: true, message: result.message});
};

exports.authentification = async (req, res) => {
    const errors = [];
    const {email, password} = req.body;

    if (!email?.trim()) errors.push("L'email est requis");
    if (!password?.trim()) errors.push('Le mot de passe est requis');

    if (errors.length > 0) {
        return res.status(400).json({ success: false, message: errors[0], type: 'error' });
    }
    const result = await userService.auth(email, password);
    if (!result.success) return res.status(500).json({ success: false, message: result.message, type: "error" });
    return res.json({success: true, message: result.message});
};