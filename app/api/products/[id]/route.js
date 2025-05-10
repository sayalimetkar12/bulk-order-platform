import { db } from '../../../../lib/db.js';
  import { products } from '../../../../lib/schema.js';
  import { eq } from 'drizzle-orm';
  import { NextResponse } from 'next/server';

  export async function PUT(request, { params }) {
    const { id } = params;
    const { name, price } = await request.json();

    if (!name || !price || isNaN(price) || price <= 0) {
      return NextResponse.json({ error: 'Invalid name or price' }, { status: 400 });
    }

    try {
      const updatedProduct = await db
        .update(products)
        .set({ name, price })
        .where(eq(products.id, parseInt(id)))
        .returning()
        .execute();

      if (updatedProduct.length === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json(updatedProduct[0], { status: 200 });
    } catch (error) {
      console.error('Error updating product:', error);
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
  }

  export async function DELETE(request, { params }) {
    const { id } = params;

    try {
      const deletedProduct = await db
        .delete(products)
        .where(eq(products.id, parseInt(id)))
        .returning()
        .execute();

      if (deletedProduct.length === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }
  }