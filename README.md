# Classonn+ MERN
Notebook company e-commerce MVP.

## Run
1. `cd server && npm install && copy .env.example .env && npm run dev`
2. In another terminal: `cd client && npm install && npm run dev`
3. Start MongoDB locally, then run `cd server && npm run seed` once.

Frontend: React/Vite. Backend: Node/Express. Database: MongoDB/Mongoose.

Customers can sign in and check out from the cart to save an order to MongoDB.
The API calculates order totals from the current product prices.

## MongoDB Connection

### Recommended: MongoDB Atlas
1. Create a free cluster at MongoDB Atlas.
2. Create a database user and password.
3. Add your IP address in Network Access.
4. Copy the Node.js connection string.
5. Create `server/.env` from `.env.example` and set:

```env
PORT=5000
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@YOUR-CLUSTER.mongodb.net/classonn_plus?retryWrites=true&w=majority
JWT_SECRET=classonn_plus_secret
```

### Local MongoDB
If MongoDB Community Server is installed locally:

```env
MONGO_URI=mongodb://127.0.0.1:27017/classonn_plus
```

After MongoDB is running, from `server` run `npm run seed` to add the demo notebooks.
