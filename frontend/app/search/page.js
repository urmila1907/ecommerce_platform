"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";

export default function SearchProducts(){
    const searchParams = useSearchParams();
    const query = searchParams.get("query");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(query){
            fetchProducts(query);
        }
    },[query]);

    const fetchProducts = async (query) =>{
        setLoading(true);
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product/search?query=${query}`);
            const data = await res.json();
            setProducts(data.products);
        }
        catch(err){
            console.error("Error fetching products:", err);
        }
        setLoading(false);
    }
    return (
        <div>
            <Navbar items={[{name: "Home", url: "/"},
                                            {name: "Products", url: "/products"},
                                            { name: "About", url: "#about" },
                                            { name: "Contact us", url: "#contact" },
                                            {name: "Login / Register", url: "/login"}]}
            />
            <h3 style={styles.header}>Search results for {query}</h3>
            {loading ? (
                <p style={styles.noProducts}>Loading...</p>
                ) :(
                    <div>
                        {products.length > 0 ? (
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
                    ) : (
                        <p style={styles.noProducts}>No products found!</p>
                    )}
                    </div>
                )}
        </div>
    )
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
    header: {
        color: "#000",  // Light gray for 'no products' message
        padding: "1rem",
        fontSize: "1.6rem",
    }
}