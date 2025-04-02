"use client";
import { useEffect, useState } from "react";

export default function Order() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/proxy/user/order', {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error(await res.text());
                }

                const data = await res.json();
                setOrders(data.orderDetails || []);
            } catch (err) {
                console.error("Failed to fetch order details: ", err);
                setError("Failed to fetch order details");
            }
        };
        fetchOrders();
    }, []);

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    if (orders.length === 0) {
        return <div style={styles.noOrders}>Do some shopping!</div>;
    }

    return (
        <div>
            <div style={styles.ordersList}>
                {orders.map((order) => (
                    <div key={order._id} style={styles.orderCard}>
                        {/* Product Details */}
                        {order.products.map((product) => (
                            <div key={product.product._id} style={styles.productDetails}>
                                <h3 style={styles.productName}>{product.product.productName}</h3>
                                <p style={styles.productDescription}>Quantity: {product.quantity}</p>
                                <p style={styles.productPrice}>Price: ₹{product.product.price}</p>
                            </div>
                        ))}

                        {/* Order Details */}
                        <div style={styles.orderDetails}>
                            <h4 style={styles.orderStatus}>Status: {order.status}</h4>
                            <h4 style={styles.orderTotalCost}>Total Cost: ₹{order.totalCost}</h4>
                            <h5 style={styles.orderDate}>
                                Order Date: {new Date(order.orderDate).toLocaleDateString()}
                            </h5>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    ordersList: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        alignItems: "flex-start",
        gap: "2rem",
        padding: "1rem",
        backgroundColor: "#F1F5F9",
        textAlign: "center",
    },
    orderCard: {
        padding: "1.5rem",
        backgroundColor: "#FFFFFF",
        color: "#2D3748",
        borderRadius: "10px",
        width: "260px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        cursor: "pointer",
    },
    productName: {
        fontSize: "1.5rem",
        fontWeight: "600",
        color: "#4A90E2",
        marginBottom: "0.5rem",
    },
    productPrice: {
        fontSize: "1.1rem",
        fontWeight: "600",
        color: "#2D3748",
        marginBottom: "0.5rem",
    },
    productDescription: {
        fontSize: "1rem",
        color: "#6B7280",
        marginBottom: "0.5rem",
    },
    productDetails: {
        padding: "1rem",
        backgroundColor: "#F1F5F9",
        borderRadius: "8px",
        marginBottom: "1rem",
    },
    orderDetails: {
        padding: "1rem",
        borderRadius: "8px",
    },
    orderStatus: {
        fontSize: "1.1rem",
        color: "#6B7280",
        marginBottom: "1rem",
    },
    orderTotalCost: {
        fontSize: "1.2rem",
        fontWeight: "700",
        color: "#FF6F61",
        marginBottom: "1rem",
    },
    orderDate: {
        fontSize: "1rem",
        color: "#A0AEC0",
    },
    error: {
        color: "#D9534F",
        textAlign: "center",
        padding: "2rem",
        fontSize: "1.2rem",
        fontWeight: "bold",
    },
    noOrders: {
        color: "#A0AEC0",
        textAlign: "center",
        padding: "2rem",
        fontSize: "1.2rem",
    },
};
