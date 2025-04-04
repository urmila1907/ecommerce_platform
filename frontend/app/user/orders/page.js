"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Order() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const router = useRouter();

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

    const handleOrder = (id) => {
        router.push(`/user/order/${id}`);
    }

    return (
        <div>
            <div style={styles.ordersList}>
                {orders.map((order) => (
                    <div key={order._id} style={styles.orderCard} onClick={() => handleOrder(order._id)}>
                    <div style={styles.orderContent}>
                        {/* Left: Product Info */}
                        <div style={styles.productSection}>
                            {order.products.map((product) => (
                                <div key={product.product._id} style={styles.productDetails}>
                                    <h3 style={styles.productName}>{product.product.productName}</h3>
                                    <p style={styles.productDescription}>Quantity: {product.quantity}</p>
                                    <p style={styles.productPrice}>Price: ₹{product.product.price}</p>
                                </div>
                            ))}
                        </div>
                
                        {/* Right: Order Info */}
                        <div style={styles.orderInfoSection}>
                            <h4 style={styles.orderStatus}>Status: {order.status}</h4>
                            <h4 style={styles.orderTotalCost}>Total Cost: ₹{order.totalCost}</h4>
                            <h5 style={styles.orderDate}>
                                Order Date: {new Date(order.orderDate).toLocaleDateString()}
                            </h5>
                        </div>
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
        flexDirection: "column",
        gap: "2rem",
        padding: "2rem 1rem",
        backgroundColor: "#F1F5F9",
        width: "100%",
    },
    orderCard: {
        backgroundColor: "#FFFFFF",
        color: "#2D3748",
        borderRadius: "12px",
        boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out",
        padding: "1.5rem",
        margin: "0 auto",
        width: "95%", // full width with small side margin
        maxWidth: "1200px",
    },
    orderContent: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap",
    },
    productSection: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    productDetails: {
        padding: "1rem",
        backgroundColor: "#F8FAFC",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
    },
    productName: {
        fontSize: "1.2rem",
        fontWeight: "600",
        color: "#4A90E2",
        marginBottom: "0.4rem",
    },
    productPrice: {
        fontSize: "1.1rem",
        fontWeight: "500",
        color: "#2D3748",
        marginBottom: "0.3rem",
    },
    productDescription: {
        fontSize: "1rem",
        color: "#6B7280",
    },
    orderInfoSection: {
        flex: 1,
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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
