import express from 'express';import Product from '../models/Product.js';
const r=express.Router();
r.get('/',async(q,s)=>{try{let f={};if(q.query.category&&q.query.category!='All')f.category=q.query.category;if(q.query.search)f.name={$regex:q.query.search,$options:'i'};s.json(await Product.find(f).sort({createdAt:-1}))}catch(e){s.status(500).json({message:e.message})}});
r.get('/:id',async(q,s)=>{try{s.json(await Product.findById(q.params.id))}catch(e){s.status(400).json({message:e.message})}});
r.post('/',async(q,s)=>{try{s.status(201).json(await Product.create(q.body))}catch(e){s.status(400).json({message:e.message})}});
r.put('/:id',async(q,s)=>{try{s.json(await Product.findByIdAndUpdate(q.params.id,q.body,{new:true}))}catch(e){s.status(400).json({message:e.message})}});
r.delete('/:id',async(q,s)=>{try{await Product.findByIdAndDelete(q.params.id);s.json({message:'Deleted'})}catch(e){s.status(400).json({message:e.message})}});export default r;
