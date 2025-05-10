'use client';

import { useState, useEffect } from 'react';
import '../../globals.css';

export default function InventoryManagement() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });
  const [editProduct, setEditProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (response.ok) {
        setProducts(data);
      } else {
        setError(data.error || 'Failed to fetch products');
      }
    } catch (err) {
      setError('Error fetching products');
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
        }),
      });
      if (response.ok) {
        setNewProduct({ name: '', price: '', stock: '' });
        fetchProducts();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add product');
      }
    } catch (err) {
      setError('Error adding product');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setNewProduct({ name: product.name, price: product.price, stock: product.stock });
  };

  const handleUpdateProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${editProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
        }),
      });
      if (response.ok) {
        setEditProduct(null);
        setNewProduct({ name: '', price: '', stock: '' });
        fetchProducts();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update product');
      }
    } catch (err) {
      setError('Error updating product');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchProducts();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete product');
      }
    } catch (err) {
      setError('Error deleting product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inventory-management-container container container--lg container--padded">
      <h1 className="inventory-management-heading heading--lg">Inventory Management</h1>

      {error && (
        <p className="inventory-management-error error">{error}</p>
      )}

      {/* Add/Edit Product Form */}
      <div className="inventory-management-form-card card">
        <h2 className="inventory-management-subheading heading--md">
          {editProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <div className="inventory-management-form form">
          <div className="inventory-management-input-group input-group">
            <label className="inventory-management-label label">Name</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="inventory-management-input input"
              placeholder="Enter product name"
            />
          </div>
          <div className="inventory-management-input-group input-group">
            <label className="inventory-management-label label">Price</label>
            <input
              type="number"
              step="0.01"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="inventory-management-input input"
              placeholder="Enter price"
            />
          </div>
          <div className="inventory-management-input-group input-group">
            <label className="inventory-management-label label">Stock</label>
            <input
              type="number"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              className="inventory-management-input input"
              placeholder="Enter stock quantity"
            />
          </div>
          <button
            onClick={editProduct ? handleUpdateProduct : handleAddProduct}
            disabled={loading}
            className="inventory-management-button button button--primary"
          >
            {loading ? 'Processing...' : editProduct ? 'Update Product' : 'Add Product'}
          </button>
          {editProduct && (
            <button
              onClick={() => {
                setEditProduct(null);
                setNewProduct({ name: '', price: '', stock: '' });
              }}
              className="inventory-management-cancel-button"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Product List */}
      <div className="inventory-management-product-list-card card">
        <h2 className="inventory-management-subheading heading--md">Product Catalog</h2>
        {products.length > 0 ? (
          <table className="inventory-management-table table">
            <thead>
              <tr className="inventory-management-table-header table-header">
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="inventory-management-table-row table-row">
                  <td className="inventory-management-table-cell table-cell">{product.name}</td>
                  <td className="inventory-management-table-cell table-cell">${parseFloat(product.price).toFixed(2)}</td>
                  <td className="inventory-management-table-cell table-cell">{product.stock}</td>
                  <td className="inventory-management-table-cell table-cell">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="inventory-management-edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="inventory-management-delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="inventory-management-no-products">No products found.</p>
        )}
      </div>
    </div>
  );
}