const productService = require('../services/product.services');
const uploader = require('../helper/uploads.helper');

exports.getAllProducts = async (req, res) => {
    const result = await productService.getAll();
    if (!result.success) return res.status(500).json({ message: result.message, type: "error" });
    return res.json(result.data);
};

exports.getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: "ID manquant.", type: "error" });
        const product = await productService.getById(id);
        if (!product) return res.status(404).json({ message: "Annonce introuvable.", type: "error" });
        return res.json(product);
    } catch (err) {
        return res.status(500).json({ message: "Erreur serveur.", type: "error" });
    }
};

exports.deleteProductById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: "ID manquant. Suppression impossible.", type: "error" });
        const product = await productService.deleteById(id);
        if (!product) return res.status(404).json({ message: "Annonce introuvable. Suppression impossible.", type: "error" });
        return res.json({ message: "Annonce supprimée avec succès.", type: "success" });
    } catch (err) {
        return res.status(500).json({ message: "Erreur serveur.", type: "error" });
    }
};

exports.createProduct = (req, res) => {
    uploader.single("image")(req, res, async (err) => {

        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Erreur upload : ${err.message}`, type: "error" });
        } else if (err) {
            return res.status(400).json({ message: err.message, type: "error" });
        }


        const { idSeller, idCategorie, title, desc, price } = req.body;

        if (!idSeller || !idCategorie || !title || !desc || !price) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires.", type: "error" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image obligatoire.", type: "error" });
        }

        const imagePath =  req.file.path;

        const product = await productService.create(idSeller, idCategorie, title, desc, price, imagePath);
        if (!product) return res.status(500).json({ message: "Création impossible.", type: "error" });

        return res.json({ message: "Annonce créée avec succès.", type: "success" });
    });
};