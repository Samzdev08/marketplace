const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/shared', express.static(path.join(__dirname, '../shared')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const productRoutes = require('./routes/product.routes');
const userRoutes = require('./routes/user.routes');
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});