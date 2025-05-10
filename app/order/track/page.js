'use client';

import { useState } from 'react';
import '../../globals.css';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrackOrder = async () => {
    setError('');
    setOrderDetails(null);
    setLoading(true);

    if (!orderId.trim()) {
      setError('Please enter an order ID.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch order');
      }

      const data = await response.json();
      setOrderDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="track-order-main container container--sm container--padded">
      <div className="track-order-container">
        {/* Header */}
        <div className="track-order-header">
          <h1 className="heading--lg">Track Your Order</h1>
          <p>Enter your order ID to check the status of your delivery.</p>
        </div>

        {/* Form Card */}
        <div className="track-order-form-card card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrackOrder();
            }}
            className="track-order-form form"
          >
            <div className="track-order-input-group input-group">
              <label htmlFor="orderId" className="label">Order ID</label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g., order-1746715114042"
                className="track-order-input input"
              />
            </div>

            <button
              type="submit"
              className="track-order-button button button--primary"
              disabled={loading}
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="track-order-error error">
            {error}
          </div>
        )}

        {/* Order Details */}
        {orderDetails && (
          <div className="track-order-details-card card">
            <h2 className="heading--md">
              Order Details - ID: {orderDetails.mainOrder.submissionId}
            </h2>
            <div className="track-order-details-content">
              <p>
                <span className="track-order-details-label">Delivery Name:</span>{' '}
                {orderDetails.mainOrder.deliveryName}
              </p>
              <p>
                <span className="track-order-details-label">Contact:</span>{' '}
                {orderDetails.mainOrder.deliveryContact}
              </p>
              <p>
                <span className="track-order-details-label">Address:</span>{' '}
                {orderDetails.mainOrder.deliveryAddress}
              </p>
              <p>
                <span className="track-order-details-label">Status:</span>{' '}
                <span
                  className={`track-order-status status status-${orderDetails.mainOrder.status.toLowerCase()}`}
                >
                  {orderDetails.mainOrder.status}
                </span>
              </p>
              <div>
                <h3 className="track-order-items-heading heading--sm">Items Ordered</h3>
                <ul className="track-order-items-list">
                  {orderDetails.relatedOrders.map((item, index) => (
                    <li
                      key={item.id}
                      className={`track-order-item ${index % 2 === 0 ? 'track-order-item-even' : 'track-order-item-odd'}`}
                    >
                      <span className="track-order-item-name">{item.itemName}</span>
                      <span className="track-order-item-quantity">Qty: {item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}