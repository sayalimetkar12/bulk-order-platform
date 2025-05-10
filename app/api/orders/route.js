import { db } from '../../../lib/db.js';
  import { orders } from '../../../lib/schema.js';
  import { NextResponse } from 'next/server';

  export async function POST(request) {
    try {
      const body = await request.json();
      const { submissionId, itemName, quantity, deliveryName, deliveryContact, deliveryAddress, totalPrice } = body;

      if (!submissionId || !itemName || !quantity || !deliveryName || !deliveryContact || !deliveryAddress || totalPrice === undefined) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const newOrder = await db
        .insert(orders)
        .values({
          submissionId,
          itemName,
          quantity,
          deliveryName,
          deliveryContact,
          deliveryAddress,
          status: 'Pending',
          totalPrice: parseFloat(totalPrice),
        })
        .returning();

      return NextResponse.json(newOrder[0], { status: 201 });
    } catch (error) {
      console.error('Error creating order:', error);
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
  }

  export async function GET() {
    try {
      const allOrders = await db.select().from(orders).execute();
      return NextResponse.json(allOrders, { status: 200 });
    } catch (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
  }