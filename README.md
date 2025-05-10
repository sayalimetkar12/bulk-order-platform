Bulk Vegetable/Fruit Ordering Platform
A web application for bulk ordering of vegetables and fruits, built as part of the Full-Stack Developer Internship Assignment.
Features
For Buyers

Browse Products: View a catalog of available vegetables/fruits with names and prices.
Place Orders: Submit bulk orders with item name, quantity, and delivery details.
Track Orders: Check the status of orders (Pending, In Progress, Delivered).

For Admins

Order Management: View all orders and update their status.
Inventory Management: Add, edit, and remove products from the catalog.

Tech Stack

Frontend: Next.js, Tailwind CSS
Backend: Next.js API Routes
Database: PostgreSQL (Docker)
ORM: Drizzle ORM
Deployment: Vercel

Setup Instructions

Clone the Repository
git clone https://github.com/your-username/bulk-order-platform.git
cd bulk-order-platform


Install Dependencies
npm install


Set Up Environment Variables

Copy .env.example to .env
Use the provided DATABASE_URL for Docker or update for Neon.tech


Run Database Migrations

Run PostgreSQL via Docker:docker-compose up -d


Run migrations:npx drizzle-kit push




Run the Development Server
npm run dev

Open http://localhost:3000.


Deployment

Deploy to Vercel:
Push to GitHub.
Connect to Vercel.
Set DATABASE_URL in Vercel.
Deploy.



Bonus Features

Environment variables.
Clean commit history.
Comprehensive README.

Database Schema

Products: id, name, price
Orders: id, item_name, quantity, delivery_name, delivery_contact, delivery_address, status

Notes

No stock tracking (infinite availability).
Authentication and email notifications not implemented (optional).

Contact: contact@agrofix.in
