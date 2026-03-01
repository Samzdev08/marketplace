const express = require('express');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
  
    next();
  });

const productRoutes = require('./routes/product.routes');
const userRoutes = require('./routes/user.routes');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});