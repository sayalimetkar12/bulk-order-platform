import { db } from "@/lib/db";
import { products } from "@/lib/schema";
import InventoryTable from "@/components/InventoryTable";
import "../../globals.css";

export default async function Inventory() {
  let productList = [];
  try {
    productList = await db.select().from(products).execute();
    console.log("Fetched products:", productList);

    productList = productList.map((e) => ({
      ...e,
      price: parseFloat(e.price),
    }));
  } catch (error) {
    console.error("Error fetching products during build:", error);
  }

  return (
    <div className="admin-inventory-container container container--lg container--padded">
      <h1 className="admin-inventory-heading heading--lg">Admin Dashboard - Inventory</h1>
      {productList.length === 0 && (
        <p className="admin-inventory-error error">
          No products found. If you expect products, ensure the database is running and configured correctly.
        </p>
      )}
      <InventoryTable initialProducts={productList} />
    </div>
  );
}