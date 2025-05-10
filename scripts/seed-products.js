import { db } from '../lib/db.js';
import { products } from '../lib/schema.js';
import dotenv from 'dotenv';

dotenv.config();
   const seedProducts = async () => {
     try {
       console.log('Seeding products table with DATABASE_URL:', process.env.DATABASE_URL);
       await db.delete(products).execute(); // Clear existing products
       await db.insert(products).values([
         { name: 'Apples', price: 2.5, stock: 100 },
         { name: 'Broccoli', price: 1.8, stock: 80 },
         { name: 'Carrots', price: 1.2, stock: 60 },
         { name: 'Mangoes', price: 3.0, stock: 50 },
         { name: 'Spinach', price: 1.5, stock: 70 },
         { name: 'Tomatoes', price: 2.0, stock: 90 },
       ]).execute();
       console.log('Products table seeded successfully');
     } catch (error) {
       console.error('Error seeding products table:', error);
       process.exit(1);
     }
   };

   seedProducts();