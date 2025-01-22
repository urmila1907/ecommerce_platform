import { fetchWithToken } from "@/utils/fetchWithToken";
import Navbar from "@/app/components/Navbar";

export default async function Wishlist() {
    try{
        const res = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/wishlist`, {
            method: 'GET',
        });
        if (!res.ok) {
            const errorText = await res.text();
            return <div style={styles.error}>Failed to fetch wishlist details: {errorText}</div>;
        }
        const data = await res.json();
        const wishlist = data.products;
    
        return (
            <div>
                <Navbar items={[{name: "Home", url: "/user/home"},
                                {name: "My Orders", url: "/user/orders"},
                                {name: "Wishlist", url: "/user/wishlist"},
                                {name: "Cart", url: "/user/cart"},
                                {name: "Log out", url: "/user/logout"},
                                ]} 
                />
                <div style={styles.productsList}>
                    {wishlist.map((product) =>(
                        <div key={product._id} style={styles.productDetails}>
                            <h3 style={styles.productName}>{product.product.productName}</h3>
                            <p style={styles.productDescription}>{product.product.description}</p>
                            <p style={styles.productPrice}>Price: ₹{product.product.price}</p>
                        </div>
                    ))}
                </div>
            </div>
        )
    }catch(err){
        console.error('Error fetching products:', err);
        return <div>Server error while fetching wishlist details</div>;
    }
}

const styles = {
    productsList: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        alignItems: "flex-start",
        gap: "2rem",
        padding: "1rem",
        backgroundColor: "#F1F5F9",
        textAlign: "center",
    },
    productDetails: {
        padding: "1rem",
        backgroundColor: "#F1F5F9", // Light grayish background for products
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
    error: {
        color: "#D9534F",  // Red color for error messages
        textAlign: "center",
        padding: "2rem",
        fontSize: "1.2rem",
        fontWeight: "bold",
    },
    productName: {
        fontSize: "1.5rem",
        fontWeight: "600",
        color: "#4A90E2",  // Soft blue for product name
        marginBottom: "0.5rem",
    },
}