'use client';

import { useState } from 'react';
import '../app/globals.css';

export default function AdminOrderTable({ initialOrders }) {
  const [orders, setOrders] = useState(initialOrders || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateOrderStatus = async (id, newStatus) => {
    console.log('Updating order with ID:', id, 'to status:', newStatus);
    if (!id || typeof id !== 'number') {
      setError(`Invalid order ID: ${id}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update order status');
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-order-table-wrapper table-wrapper">
      {error && (
        <p className="admin-order-table-error error">{error}</p>
      )}
      <table className="admin-order-table table">
        <thead>
          <tr className="admin-order-table-header table-header">
            <th>Order ID</th>
            <th>Submission ID</th>
            <th>Item</th>
            <th>Quantity</th>
            <th>Delivery Name</th>
            <th>Contact</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id} className="admin-order-table-row table-row">
                <td className="admin-order-table-cell table-cell">{order.id}</td>
                <td className="admin-order-table-cell table-cell">{order.submissionId}</td>
                <td className="admin-order-table-cell table-cell">{order.itemName}</td>
                <td className="admin-order-table-cell table-cell">{order.quantity}</td>
                <td className="admin-order-table-cell table-cell">{order.deliveryName}</td>
                <td className="admin-order-table-cell table-cell">{order.deliveryContact}</td>
                <td className="admin-order-table-cell table-cell">{order.deliveryAddress}</td>
                <td className="admin-order-table-cell table-cell">{order.status}</td>
                <td className="admin-order-table-cell table-cell">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="admin-order-table-status-select"
                    disabled={loading}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="admin-order-table-no-data">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}