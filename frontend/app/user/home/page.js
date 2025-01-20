import Navbar from "@/app/components/Navbar";

export default async function Home(){
    try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product`,{
                method: "GET",
                credentials: "include"
            });
            if (!res.ok) {
                return <div style={styles.error}>Failed to fetch products</div>;
            }
            const data = await res.json();
            const products = data.products || [];
    
            if (products.length === 0) {
                return <div style={styles.noProducts}>No products available</div>;
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
                    <div style={styles.products}>
                        {products.map((product) => (
                            <div key={product._id} style={styles.product}>
                                <h3 style={styles.productName}>{product.productName}</h3>
                                <h4 style={styles.productDescription}>{product.description}</h4>
                                <h5 style={styles.productPrice}>Price: ₹{product.price}</h5>
                                <h5 style={styles.productQuantity}>Available: {product.quantity}</h5>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }catch (err) {
            console.error('Error fetching products:', err);
            return <div>Server error while fetching products</div>;
        }
}

const styles = {
    products: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        alignItems: "flex-start",
        gap: "2rem",
        padding: "1rem",
        backgroundColor: "#F1F5F9",  // Light grayish background
    },
    product: {
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
        fontWeight: "600",  // Slightly less bold for a cleaner look
        color: "#4A90E2",  // Soft blue for product name
        marginBottom: "0.5rem",
    },
    productDescription: {
        fontSize: "1.1rem",
        color: "#6B7280",  // Soft gray for the description text
        marginBottom: "1rem",
    },
    productPrice: {
        fontSize: "1.2rem",
        fontWeight: "700",  // Bold for price to make it stand out
        color: "#FF6F61",  // Soft red-orange for price
        marginBottom: "0.5rem",
    },
    productQuantity: {
        fontSize: "1rem",
        color: "#38A169",  // Green for available quantity
    },
    error: {
        color: "#D9534F",  // Red color for error messages
        textAlign: "center",
        padding: "2rem",
        fontSize: "1.2rem",
        fontWeight: "bold",
    },
    noProducts: {
        color: "#A0AEC0",  // Light gray for 'no products' message
        textAlign: "center",
        padding: "2rem",
        fontSize: "1.2rem",
    },
};