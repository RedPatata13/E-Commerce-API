require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(express.json());

app.use('/api/auth',     require('./features/auth/auth.routes'));
// app.use('/api/products', require('./features/products/products.routes'));
app.use('/api/cart',     require('./features/cart/cart.routes'));
// app.use('/api/orders',   require('./features/orders/orders.routes'));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);