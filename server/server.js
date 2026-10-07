import express from 'express';import cors from 'cors';import dotenv from 'dotenv';import mongoose from 'mongoose';import products from './routes/productRoutes.js';import auth from './routes/authRoutes.js';import orders from './routes/orderRoutes.js';dotenv.config();const app=express();app.use(cors());app.use(express.json());app.get('/',(q,s)=>s.json({message:'Classonn+ API running'}));app.use('/api/products',products);app.use('/api/auth',auth);app.use('/api/orders',orders);mongoose.connect(process.env.MONGO_URI).then(()=>app.listen(process.env.PORT||5000,()=>console.log('API on 5000'))).catch(console.error);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});