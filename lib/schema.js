import { pgTable, serial, text, decimal, integer } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(), // Ensure decimal type
  stock: integer('stock').notNull(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  submissionId: text('submission_id').notNull(),
  itemName: text('item_name').notNull(),
  quantity: integer('quantity').notNull(),
  deliveryName: text('delivery_name').notNull(),
  deliveryContact: text('delivery_contact').notNull(),
  deliveryAddress: text('delivery_address').notNull(),
  status: text('status').default('Pending'),
  totalPrice: decimal('totalPrice', { precision: 10, scale: 2 }).notNull().default('0.00'), 
});

