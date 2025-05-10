'use client';

import '../app/globals.css';

export default function ProductCard({ product, quantity, onQuantityChange, disabled = false }) {
  const handleIncrement = () => {
    if (!disabled) {
      onQuantityChange(product.id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (!disabled && quantity > 0) {
      onQuantityChange(product.id, quantity - 1);
    }
  };

  const priceAsNumber = parseFloat(product.price);

  return (
    <div className="product-card">
      <h2 className="product-card-heading">{product.name}</h2>
      <p className="product-card-price">Price: ${priceAsNumber.toFixed(2)}</p>
      <p className="product-card-stock">Stock: {product.stock}</p>
      <div className="product-card-input-group input-group">
        <label htmlFor={`quantity-${product.id}`} className="product-card-label label">
          Quantity
        </label>
        <div className="product-card-quantity-control">
          <button
            type="button"
            onClick={handleDecrement}
            className="product-card-quantity-button"
            disabled={disabled || quantity <= 0}
            aria-label={`Decrease quantity of ${product.name}`}
          >
            −
          </button>
          <span className="product-card-quantity-display">{quantity}</span>
          <button
            type="button"
            onClick={handleIncrement}
            className="product-card-quantity-button"
            disabled={disabled}
            aria-label={`Increase quantity of ${product.name}`}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}