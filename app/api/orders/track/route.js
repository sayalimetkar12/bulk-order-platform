import { db } from '../../../../lib/db.js';
import { orders } from '../../../../lib/schema.js';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Search by submissionId
    let order = await db
      .select()
      .from(orders)
      .where(eq(orders.submissionId, orderId))
      .execute();

    // If no order found, try searching by id
    if (order.length === 0) {
      const parsedId = parseInt(orderId);
      if (!isNaN(parsedId)) {
        order = await db
          .select()
          .from(orders)
          .where(eq(orders.id, parsedId))
          .execute();
      }
    }

    if (order.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Fetch related orders with the same submissionId
    const relatedOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.submissionId, order[0].submissionId))
      .execute();

    return NextResponse.json({ mainOrder: order[0], relatedOrders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}