'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from './ProductCard';
import '../app/globals.css';

export default function ProductCatalog({ initialProducts }) {
  const router = useRouter();
  const [products] = useState(initialProducts || []);
  const [cart, setCart] = useState({});
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    contact: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [orderSummary, setOrderSummary] = useState(null);

  const updateQuantity = (id, quantity) => {
    const qty = parseInt(quantity) || 0;
    if (qty < 0) return;
    console.log(`Updating quantity for product ID ${id}: ${qty}`);
    setCart((prev) => {
      const newCart = { ...prev, [id]: qty };
      console.log('Updated cart:', newCart);
      return newCart;
    });
  };

  const calculateTotalPrice = () => {
    return Object.entries(cart).reduce((total, [id, quantity]) => {
      const product = products.find((p) => p.id === parseInt(id));
      return total + (product ? product.price * quantity : 0);
    }, 0).toFixed(2);
  };

  const validateDeliveryDetails = () => {
    const newErrors = {};
    if (!deliveryDetails.name.trim()) newErrors.name = 'Delivery name is required';
    if (!deliveryDetails.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^\d{10}$/.test(deliveryDetails.contact)) {
      newErrors.contact = 'Contact must be a 10-digit number';
    }
    if (!deliveryDetails.address.trim()) newErrors.address = 'Delivery address is required';
    
    if (Object.keys(newErrors).length > 0) {
      newErrors.validation = 'Please fill in all required delivery details.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const placeBulkOrder = async () => {
    if (!validateDeliveryDetails()) {
      console.log('Delivery details validation failed:', errors);
      return;
    }

    const selectedItems = Object.entries(cart).filter(([_, qty]) => qty > 0);
    if (selectedItems.length === 0) {
      setErrors({ cart: 'Please select at least one product with a quantity greater than 0' });
      console.log('Cart validation failed: No items selected');
      return;
    }

    setErrors({});
    setLoading(true);
    setSuccessMessage('');

    const submissionId = `order-${Date.now()}`;
    const orders = selectedItems.map(([id, quantity]) => {
      const product = products.find((p) => p.id === parseInt(id));
      if (!product) {
        throw new Error(`Product with ID ${id} not found`);
      }
      const itemTotalPrice = (product.price * quantity).toFixed(2); // Calculate total price for this item
      return {
        submissionId,
        itemName: product.name,
        quantity,
        deliveryName: deliveryDetails.name,
        deliveryContact: deliveryDetails.contact,
        deliveryAddress: deliveryDetails.address,
        totalPrice: itemTotalPrice, // Add totalPrice field
      };
    });

    console.log('Orders being sent to API:', orders);

    if (!orders.every(order => order.submissionId)) {
      setErrors({ submit: 'Submission ID is missing' });
      setLoading(false);
      return;
    }

    setOrderSummary(orders);

    try {
      let lastOrderId = null;
      for (const order of orders) {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order),
        });

        const data = await response.json();
        console.log('API response:', response.status, data);
        if (!response.ok) {
          throw new Error(data.error || 'Failed to place order');
        }
        lastOrderId = data.id;
        if (!lastOrderId) {
          throw new Error('Order ID not returned from API');
        }
      }
      setSuccessMessage('Order placed successfully!');
      setCart({});
      setDeliveryDetails({ name: '', contact: '', address: '' });

      setTimeout(() => {
        router.push(`/order/details/${lastOrderId}`);
      }, 2000);
    } catch (err) {
      console.error('Error placing order:', err);
      setErrors({ submit: err.message === 'Missing required fields' ? 'The server reported missing required fields in the order. Please ensure all details are provided.' : err.message });
      setOrderSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDeliveryDetails((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null, validation: null }));
  };

  return (
    <div className="product-catalog-container">
      <h1 className="product-catalog-heading heading--lg">Vegetable & Fruit Catalog</h1>

      {errors.validation && (
        <p className="product-catalog-error error">{errors.validation}</p>
      )}
      {errors.cart && (
        <p className="product-catalog-error error">{errors.cart}</p>
      )}
      {errors.submit && (
        <p className="product-catalog-error error">{errors.submit}</p>
      )}
      {successMessage && !orderSummary && (
        <p className="product-catalog-success">{successMessage}</p>
      )}

      <div className="product-catalog-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={cart[product.id] || 0}
              onQuantityChange={updateQuantity}
            />
          ))
        ) : (
          <p className="product-catalog-no-products">
            No products available.
          </p>
        )}
      </div>

      <div className="product-catalog-total">
        <p className="product-catalog-total-text">
          Total Price: ${calculateTotalPrice()}
        </p>
      </div>

      {orderSummary && (
        <div className="product-catalog-order-summary">
          <h2 className="product-catalog-order-summary-heading heading--md">
            Order Summary
          </h2>
          <ul className="product-catalog-order-summary-list">
            {orderSummary.map((item, index) => (
              <li key={index} className="product-catalog-order-summary-item">
                <strong>{item.itemName}</strong>: {item.quantity} unit(s)
              </li>
            ))}
          </ul>
          <p className="product-catalog-order-success">Order placed! Redirecting...</p>
        </div>
      )}

      {!orderSummary && (
        <>
          <div className="product-catalog-delivery-form">
            <h2 className="product-catalog-delivery-heading heading--md">
              Delivery Details
            </h2>
            <div className="product-catalog-delivery-form-content">
              <div className="product-catalog-input-group input-group">
                <label htmlFor="name" className="product-catalog-label label">
                  Delivery Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={deliveryDetails.name}
                  onChange={handleDeliveryChange}
                  placeholder="Enter your name"
                  className="product-catalog-input input"
                />
                {errors.name && (
                  <p className="product-catalog-error-text error error--sm">{errors.name}</p>
                )}
              </div>
              <div className="product-catalog-input-group input-group">
                <label htmlFor="contact" className="product-catalog-label label">
                  Contact Number
                </label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={deliveryDetails.contact}
                  onChange={handleDeliveryChange}
                  placeholder="Enter 10-digit contact number"
                  className="product-catalog-input input"
                />
                {errors.contact && (
                  <p className="product-catalog-error-text error error--sm">{errors.contact}</p>
                )}
              </div>
              <div className="product-catalog-input-group input-group">
                <label htmlFor="address" className="product-catalog-label label">
                  Delivery Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={deliveryDetails.address}
                  onChange={handleDeliveryChange}
                  placeholder="Enter your delivery address"
                  className="product-catalog-textarea"
                  rows="3"
                />
                {errors.address && (
                  <p className="product-catalog-error-text error error--sm">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          <div className="product-catalog-button-wrapper">
            <button
              onClick={placeBulkOrder}
              className="product-catalog-submit-button button button--primary"
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Bulk Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}