'use client';

import { useState, useEffect } from 'react';
import '../../globals.css';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        if (response.ok) {
          const groupedOrders = Object.values(
            data.reduce((acc, order) => {
              const { submissionId } = order;
              if (!acc[submissionId]) {
                acc[submissionId] = {
                  submissionId,
                  itemQuantities: [],
                  deliveryName: order.deliveryName,
                  deliveryContact: order.deliveryContact,
                  deliveryAddress: order.deliveryAddress,
                  status: order.status,
                };
              }
              acc[submissionId].itemQuantities.push({
                item: order.itemName,
                quantity: order.quantity,
              });
              return acc;
            }, {})
          );
          setOrders(groupedOrders);
        } else {
          setError(data.error || 'Failed to fetch orders');
        }
      } catch (err) {
        setError('Error fetching orders');
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (submissionId, newStatus) => {
    try {
      console.log(`Updating status for submissionId: ${submissionId} to ${newStatus}`);
      const response = await fetch(`/api/status/${submissionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      console.log('Response from /api/status/[id]:', data);

      if (response.ok) {
        setOrders(
          orders.map((order) =>
            order.submissionId === submissionId ? { ...order, status: newStatus } : order
          )
        );
        setError(null);
      } else {
        setError(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error in handleStatusChange:', err);
      setError('Error updating status: ' + err.message);
    }
  };

  return (
    <div className="admin-dashboard-container container container--lg container--padded">
      <h1 className="admin-dashboard-heading heading--lg">Admin Dashboard - Orders</h1>

      {error && <p className="admin-dashboard-error error">{error}</p>}

      {orders.length > 0 ? (
        <div className="admin-dashboard-table-wrapper table-wrapper">
          <table className="admin-dashboard-table table">
            <thead>
              <tr className="admin-dashboard-table-header table-header">
                <th>Order ID</th>
                <th>Items & Quantities</th>
                <th>Delivery Name</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.submissionId} className="admin-dashboard-table-row table-row">
                  <td className="admin-dashboard-table-cell table-cell">{order.submissionId}</td>
                  <td className="admin-dashboard-table-cell table-cell">
                    <div className="admin-dashboard-items-container">
                      <ul className="admin-dashboard-items-list">
                        {order.itemQuantities.map((entry, index) => (
                          <li key={index} className="admin-dashboard-item">
                            <span className="admin-dashboard-item-name">{entry.item}:</span>
                            <span>{entry.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                  <td className="admin-dashboard-table-cell table-cell">{order.deliveryName}</td>
                  <td className="admin-dashboard-table-cell table-cell">{order.deliveryContact}</td>
                  <td className="admin-dashboard-table-cell table-cell">{order.deliveryAddress}</td>
                  <td className="admin-dashboard-table-cell table-cell">
                    <span className={`admin-dashboard-status status status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="admin-dashboard-table-cell table-cell">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.submissionId, e.target.value)}
                      className="admin-dashboard-status-select"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="admin-dashboard-no-orders">
          No orders found. If you expect orders, ensure the database is running and configured correctly.
        </p>
      )}
    </div>
  );
}