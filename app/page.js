import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import ProductCatalog from "@/components/ProductCatalog";
import "./globals.css";
export const dynamic = "force-dynamic";

export default async function Home() {
  const productList = await db.select().from(products).execute();
  console.log("Fetched products:", productList);

  if (!productList || productList.length === 0) {
    return (
      <main className="home-main container container--padded">
        <h1 className="home-heading heading--lg">Vegetable & Fruit Catalog</h1>
        <p className="home-error error">No products available at the moment.</p>
      </main>
    );
  }

  return (
    <main className="home-main container container--padded">
      <ProductCatalog initialProducts={productList} />
    </main>
  );
}