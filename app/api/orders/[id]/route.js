import { db } from '../../../../lib/db.js';
import { orders } from '../../../../lib/schema.js';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    console.log('Order ID for update:', id); // Log the ID being passed
    const orderId = parseInt(id);

    // Validate the ID
    if (isNaN(orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const updatedOrder = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, orderId))
      .returning()
      .execute();

    if (updatedOrder.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updatedOrder[0], { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}