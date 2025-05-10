import { db } from '../../../lib/db.js';
  import { products } from '../../../lib/schema.js';
  import { NextResponse } from 'next/server';

  export async function GET() {
    try {
      const productList = await db.select().from(products).execute();
      return NextResponse.json(productList, { status: 200 });
    } catch (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
  }

  export async function POST(request) {
    try {
      const body = await request.json();
      const { name, price } = body;

      if (!name || !price || isNaN(price) || price <= 0) {
        return NextResponse.json({ error: 'Invalid name or price' }, { status: 400 });
      }

      const newProduct = await db
        .insert(products)
        .values({ name, price })
        .returning()
        .execute();

      return NextResponse.json(newProduct[0], { status: 201 });
    } catch (error) {
      console.error('Error creating product:', error);
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
  }