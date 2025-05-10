import { db } from "@/lib/db";
import { orders } from "@/lib/schema";
import { eq } from "drizzle-orm";
import "../../../globals.css";

export default async function OrderDetails({ params }) {
  const { id } = params;

  let orderDetails = [];
  try {
    orderDetails = await db
      .select()
      .from(orders)
      .where(eq(orders.id, parseInt(id)))
      .execute();

    console.log("Fetched order details:", orderDetails);
  } catch (error) {
    console.error("Error fetching order details:", error);
  }

  if (!orderDetails || orderDetails.length === 0) {
    return (
      <div className="order-details-container container container--sm container--padded">
        <h1 className="order-details-heading heading--lg">Order Details</h1>
        <p className="order-details-error error">
          Order not found. Please check the order ID or try again later.
        </p>
      </div>
    );
  }

  const order = orderDetails[0];
  const relatedOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.submissionId, order.submissionId))
    .execute();

  const totalPrice = parseFloat(order.totalPrice);

  return (
    <div className="order-details-container container container--sm container--padded">
      <h1 className="order-details-heading heading--lg">Order Details - {id}</h1>
      <div className="order-details-card card">
        <h2 className="order-details-subheading heading--md">Order Information</h2>
        <p>
          <span className="order-details-label">Submission ID:</span> {order.submissionId}
        </p>
        <p>
          <span className="order-details-label">Delivery Name:</span> {order.deliveryName}
        </p>
        <p>
          <span className="order-details-label">Contact:</span> {order.deliveryContact}
        </p>
        <p>
          <span className="order-details-label">Address:</span> {order.deliveryAddress}
        </p>
        <p>
          <span className="order-details-label">Total Price:</span> $
          {isNaN(totalPrice) ? "0.00" : totalPrice.toFixed(2)}
        </p>
        <p>
          <span className="order-details-label">Status:</span>{" "}
          <span className={`order-details-status status status-${order.status.toLowerCase()}`}>
            {order.status}
          </span>
        </p>

        <h3 className="order-details-items-heading heading--sm">Items</h3>
        <ul className="order-details-items-list">
          {relatedOrders.map((item, index) => (
            <li
              key={index}
              className={`order-details-item order-details-item-${
                index % 2 === 0 ? "even" : "odd"
              }`}
            >
              {item.itemName} - {item.quantity} unit(s)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}