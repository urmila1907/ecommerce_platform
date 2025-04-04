"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Product() {
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const params = useParams();
    const id = params?.id || "";
    
    useEffect(() => {
        if (!id) return;

        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/proxy/user/order/${id}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch order details");
                }

                const data = await res.json();
                setOrder(data.order);

            } catch (err) {
                console.error("Error fetching order details:", err);
                setError("Server error while fetching order");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    return (
        <>
            {isLoading ? (
                <p style={styles.loading}>Loading...</p>
            ) : error ? (
                <p style={styles.error}>{error}</p>
            ) : (
                <div style={styles.orderContainer}>
                    <button style={styles.backButton} onClick={() => router.push("/user/orders")}>
                        ← Back to Orders
                    </button>

                    <h2 style={styles.heading}>Order Summary</h2>
                    
                    <div style={styles.productList}>
                        {order.products.map((product) => (
                            <div key={product.product._id} style={styles.productCard}>
                                <h3 style={styles.productName}>{product.product.productName}</h3>
                                <p style={styles.productDescription}>Quantity: {product.quantity}</p>
                                <p style={styles.productPrice}>Price: ₹{product.product.price}</p>
                            </div>
                        ))}
                    </div>

                    <div style={styles.orderDetails}>
                        <h4 style={styles.orderStatus}>Status: {order.status}</h4>
                        <h4 style={styles.orderTotalCost}>Total Cost: ₹{order.totalCost}</h4>
                        <h5 style={styles.orderDate}>
                            Order Date: {new Date(order.orderDate).toLocaleDateString()}
                        </h5>
                    </div>
                </div>
            )}
        </>
    );
}

const styles = {
    heading: {
        fontSize: "2rem",
        fontWeight: "700",
        color: "#4A90E2",
        marginBottom: "1.5rem",
        textAlign: "center",
    },
    loading: {
        textAlign: "center",
        padding: "2rem",
        fontSize: "1.2rem",
        color: "#4A90E2",
    },
    error: {
        textAlign: "center",
        padding: "2rem",
        fontSize: "1.2rem",
        fontWeight: "bold",
        color: "#D9534F",
    },
    orderContainer: {
        padding: "2rem",
        maxWidth: "900px",
        margin: "0 auto",
        backgroundColor: "#FAFAFA",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    },
    backButton: {
        marginBottom: "1rem",
        padding: "0.5rem 1rem",
        fontSize: "0.95rem",
        fontWeight: "500",
        backgroundColor: "#E2E8F0",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        color: "#2D3748",
        transition: "background-color 0.3s",
    },
    productList: {
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        marginBottom: "2rem",
    },
    productCard: {
        flex: "1 1 280px",
        backgroundColor: "#F1F5F9",
        padding: "1rem",
        borderRadius: "8px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    },
    productName: {
        fontSize: "1.25rem",
        fontWeight: "600",
        color: "#4A90E2",
        marginBottom: "0.5rem",
    },
    productDescription: {
        fontSize: "1rem",
        color: "#6B7280",
        marginBottom: "0.5rem",
    },
    productPrice: {
        fontSize: "1rem",
        fontWeight: "600",
        color: "#2D3748",
    },
    orderDetails: {
        paddingTop: "1rem",
        borderTop: "1px solid #CBD5E0",
    },
    orderStatus: {
        fontSize: "1.1rem",
        color: "#6B7280",
        marginBottom: "0.5rem",
    },
    orderTotalCost: {
        fontSize: "1.2rem",
        fontWeight: "700",
        color: "#FF6F61",
        marginBottom: "0.5rem",
    },
    orderDate: {
        fontSize: "1rem",
        color: "#A0AEC0",
    }
};
