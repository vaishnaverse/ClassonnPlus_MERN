import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import products from './routes/productRoutes.js';
import auth from './routes/authRoutes.js';
import orders from './routes/orderRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Classonn+ API running' });
});

app.use('/api/products', products);
app.use('/api/auth', auth);
app.use('/api/orders', orders);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  });
