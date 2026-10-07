import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const r = express.Router();

async function requireUser(req, res, next) {
  const authorization = req.headers.authorization || '';
  const token = authorization.replace(/^Bearer\s+/i, '');

  if (!token) return res.status(401).json({ message: 'Please sign in to place an order' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id || !mongoose.isValidObjectId(decoded.id)) {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User account not found' });

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Your session has expired. Please sign in again.' });
    }

    console.error('Unable to authenticate order request:', error);
    return res.status(500).json({ message: 'Unable to authenticate order request' });
  }
}

r.post('/', requireUser, async (req, res) => {
  const submittedCustomer = req.body?.customer;
  const customer = {
    name: typeof submittedCustomer?.name === 'string' ? submittedCustomer.name.trim() : '',
    email: typeof submittedCustomer?.email === 'string' ? submittedCustomer.email.trim() : '',
    phone: typeof submittedCustomer?.phone === 'string' ? submittedCustomer.phone.trim() : '',
    address: {
      line1: typeof submittedCustomer?.address?.line1 === 'string' ? submittedCustomer.address.line1.trim() : '',
      line2: typeof submittedCustomer?.address?.line2 === 'string' ? submittedCustomer.address.line2.trim() : '',
      city: typeof submittedCustomer?.address?.city === 'string' ? submittedCustomer.address.city.trim() : '',
      state: typeof submittedCustomer?.address?.state === 'string' ? submittedCustomer.address.state.trim() : '',
      postalCode: typeof submittedCustomer?.address?.postalCode === 'string' ? submittedCustomer.address.postalCode.trim() : '',
      country: typeof submittedCustomer?.address?.country === 'string' ? submittedCustomer.address.country.trim() : ''
    }
  };
  if (
    !customer.name ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) ||
    !/^\+?[0-9][0-9\s().-]{6,19}$/.test(customer.phone) ||
    !customer.address.line1 ||
    !customer.address.city ||
    !customer.address.state ||
    !customer.address.postalCode ||
    !customer.address.country
  ) {
    return res.status(400).json({ message: 'Please provide valid customer and delivery details' });
  }

  const submittedItems = req.body?.items;
  if (!Array.isArray(submittedItems) || submittedItems.length === 0) {
    return res.status(400).json({ message: 'Your cart is empty' });
  }

  const quantities = new Map();
  for (const item of submittedItems) {
    if (
      !item ||
      typeof item.productId !== 'string' ||
      !mongoose.isValidObjectId(item.productId) ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1
    ) {
      return res.status(400).json({ message: 'Order items are invalid' });
    }

    const productId = new mongoose.Types.ObjectId(item.productId).toString();
    quantities.set(productId, (quantities.get(productId) || 0) + item.quantity);
    if (!Number.isSafeInteger(quantities.get(productId))) {
      return res.status(400).json({ message: 'Order quantity is too large' });
    }
  }

  try {
    const products = await Product.find({ _id: { $in: [...quantities.keys()] } });
    if (products.length !== quantities.size) {
      return res.status(400).json({ message: 'One or more products are no longer available' });
    }

    const items = products.map(product => ({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: quantities.get(product._id.toString())
    }));
    const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

    if (!Number.isFinite(totalAmount)) {
      return res.status(400).json({ message: 'Order total is invalid' });
    }

    const order = await Order.create({
      user: req.user._id,
      customer,
      items,
      totalAmount
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error('Unable to place order:', error);
    return res.status(500).json({ message: 'Unable to place order' });
  }
});

r.get('/', requireUser, async (req, res) => {
  try {
    return res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
  } catch (error) {
    console.error('Unable to retrieve orders:', error);
    return res.status(500).json({ message: 'Unable to retrieve orders' });
  }
});

export default r;
