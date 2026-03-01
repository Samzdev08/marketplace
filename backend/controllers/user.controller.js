const userService = require('../services/user.services');


exports.createUser = async (req, res) => {
    const errors = [];
    const { fullname, email, password, password_verify, bio } = req.body;

    if (!fullname?.trim()) errors.push('Le nom complet est requis');
    if (!email?.trim()) errors.push("L'email est requis");
    if (!email.includes('@')) errors.push("L'email doit etre valide");
    if(password !== password_verify) errors.push("Pas le meme mot de passe");
    if (!password?.trim()) errors.push('Le mot de passe est requis');
    if (password?.length < 6) errors.push('Le mot de passe doit faire au moins 6 caractères');

    if (errors.length > 0) {
        return res.status(400).json({ success: false, message: errors[0], type: 'error' });
    }
    const result = await userService.create(fullname, email, password, bio);
    if (!result.success) return res.status(500).json({ message: result.message, type: "error" });
    return res.json(result.data);
};