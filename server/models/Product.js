import mongoose from 'mongoose';
export default mongoose.model('Product',new mongoose.Schema({name:String,category:String,price:Number,pages:Number,size:String,description:String,stock:Number,rating:Number,featured:Boolean},{timestamps:true}));
