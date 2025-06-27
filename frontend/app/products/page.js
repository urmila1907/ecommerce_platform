"use client";
import "../styles/page.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaRegHeart } from "react-icons/fa6";

export default function Products() {
    const router = useRouter();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [hoveredProductId, setHoveredProductId] = useState(null);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("api/proxy/product", {
                method: "GET",
                credentials: "include"
            });

            if (!res.ok) {
                throw new Error("Failed to fetch products");
            }

            const data = await res.json();
            setProducts(data.products);
        } catch (err) {
            console.error("Error fetching products:", err);
            setError("Server error while fetching products");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleMouseEnter = (id) => setHoveredProductId(id);
    const handleMouseLeave = () => setHoveredProductId(null);

    if (isLoading) return <div>Loading products...</div>;
    if (error) return <div className="error">{error}</div>;
    if (products.length === 0) return <div className="noProducts">No products available</div>;

    return (
        <div>
            <div className="products">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="product"
                        onMouseEnter={() => handleMouseEnter(product._id)}
                        onMouseLeave={handleMouseLeave}
                        onClick={router.push(`/product/${product._id}`)}
                    >
                        <h3 className="productName">{product.productName}</h3>
                        <h4 className="productDescription">{product.description}</h4>
                        <h5 className="productPrice">Price: ₹{product.price}</h5>
                        <h5 className="productQuantity">Available: {product.quantity}</h5>

                        {hoveredProductId === product._id && (
                            <div className="btnContainer">
                                <button onClick={() => router.push("/login")} className="btnHeart">
                                    <FaRegHeart /> Add to Wishlist
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
