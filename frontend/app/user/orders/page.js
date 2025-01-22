import { fetchWithToken } from "@/utils/fetchWithToken";
import Navbar from "@/app/components/Navbar";

export default async function Order() {
    const res = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/order`, {
        method: 'GET',
    });

    if (!res.ok) {
        const errorText = await res.text();
        return <div style={styles.error}>Failed to fetch order details: {errorText}</div>;
    }

    const data = await res.json();
    const orders = data.orderDetails;

    if (orders.length === 0) {
        return <div style={styles.noOrders}>Do some shopping!</div>;
    }

    return (
        <div>
            <Navbar items={[{name: "Home", url: "/user/home"},
                            {name: "My Orders", url: "/user/orders"},
                            {name: "Wishlist", url: "/user/wishlist"},
                            {name: "Cart", url: "/user/cart"},
                            {name: "Log out", url: "/user/logout"},
                            ]} 
            />
            <div style={styles.ordersList}>
                {orders.map((order) => (
                    <div key={order._id} style={styles.orderCard}>

                        {/* Product Details */}
                        <div style={styles.productDetails}>
                            <h3 style={styles.productName}>{order.product.productName}</h3>
                            <p style={styles.productDescription}>{order.product.description}</p>
                            <p style={styles.productPrice}>Price: ₹{order.product.price}</p>
                        </div>

                        {/* Order Details */}
                        <div style={styles.orderDetails}>
                            <h4 style={styles.orderStatus}>Status: {order.status}</h4>
                            <h4 style={styles.orderQuantity}>Quantity Ordered: {order.quantity}</h4>
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
        backgroundColor: "#FFFFFF",  // White background for products
        color: "#2D3748",  // Dark text for better contrast
        borderRadius: "10px",
        width: "260px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        cursor: "pointer",
    },
    productName: {
        fontSize: "1.5rem",
        fontWeight: "600",
        color: "#4A90E2",  // Soft blue for product name
        marginBottom: "0.5rem",
    },
    totalCost: {
        fontSize: "1.2rem",
        fontWeight: "700",  // Bold for total cost to make it stand out
        color: "#FF6F61",  // Soft red-orange for price
        marginBottom: "1rem",
    },
    quantity: {
        fontSize: "1rem",
        color: "#38A169",  // Green for quantity
        marginBottom: "1rem",
    },
    status: {
        fontSize: "1.1rem",
        color: "#6B7280",  // Soft gray for the status
        marginBottom: "1rem",
    },
    createdAt: {
        fontSize: "1rem",
        color: "#A0AEC0",  // Light gray for date
    },
    error: {
        color: "#D9534F",  // Red color for error messages
        textAlign: "center",
        padding: "2rem",
        fontSize: "1.2rem",
        fontWeight: "bold",
    },
    noOrders: {
        color: "#A0AEC0",  // Light gray for 'no orders' message
        textAlign: "center",
        padding: "2rem",
        fontSize: "1.2rem",
    },
    productDetails: {
        padding: "1rem",
        backgroundColor: "#F1F5F9", // Light grayish background for products
        borderRadius: "8px",
    },
    orderDetails: {
        padding: "1rem",
        borderRadius: "8px",
    },
    productDescription: {
        fontSize: "1rem",
        color: "#6B7280", // Gray for product description
        marginBottom: "0.5rem",
    },
    productPrice: {
        fontSize: "1.1rem",
        fontWeight: "600",
        color: "#2D3748", // Darker gray
        marginBottom: "0.5rem",
    },
};

