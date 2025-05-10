'use client';

import '../app/globals.css';

export default function InventoryTable({ initialProducts }) {
  const products = initialProducts || [];

  return (
    <div className="inventory-table-wrapper table-wrapper">
      <table className="inventory-table table">
        <thead>
          <tr className="inventory-table-header table-header">
            <th>Product ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => {
              const price = parseFloat(product.price);
              const formattedPrice = isNaN(price) ? 'N/A' : price.toFixed(2);

              return (
                <tr key={product.id} className="inventory-table-row table-row">
                  <td className="inventory-table-cell table-cell">{product.id}</td>
                  <td className="inventory-table-cell table-cell">{product.name}</td>
                  <td className="inventory-table-cell table-cell">${formattedPrice}</td>
                  <td className="inventory-table-cell table-cell">{product.stock}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" className="inventory-table-no-data">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}