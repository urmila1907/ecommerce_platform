"use client";
import "@/app/styles/page.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authContext";

export default function Products(){
    const router = useRouter();
    const {isUser} = useAuth();

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [wishlistState, setWishlistState] = useState({});
    const [products, setProducts] = useState([]);
    const [hoveredProductId, setHoveredProductId] = useState(null);

    const fetchProducts = async() =>{
        try{
            setIsLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product`,{
                method: "GET",
                credentials: "include"
            });
            if (!res.ok) {
                return <div style={styles.error}>Failed to fetch products</div>;
            }
            const data = await res.json();
            setProducts(data.products);
            setIsLoading(false);
        }
        catch(err){
            console.error("Error fetching products:", err);
            setError("Server error while fetching products");
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleWishlist = async (id)=>{
        try{
            const res = await fetch(`/api/proxy/user/wishlist/:${id}`, {
                method: "POST",
            });
            if (!res.ok) {
                const errorText = await res.text();
                setError(errorText);
                return;
            }
            const data = await res.json();
            setWishlistState((prevState) => ({
                ...prevState,
                [id]: true, // Add to wishlist
            }));
        }   
        catch(err){
            console.error("Error adding product to wishlist:", err);
            setError("Server error while adding product to wishlist");
        }
    }

    const handleRemoveWishlist = async (id)=>{
        try{
            const res = await fetch(`/api/proxy/user/wishlist/:${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const errorText = await res.text();
                setError(errorText);
                return;
            }
            const data = await res.json();
            setWishlistState((prevState) => ({
                ...prevState,
                [id]: false, // Remove from wishlist
            }));
        }   
        catch(err){
            console.error("Error adding product to wishlist:", err);
            setError("Server error while adding product to wishlist");
        }
    }

    const handleMouseEnter = (id) => {
        setHoveredProductId(id);
    };

    const handleMouseLeave = () => {
        setHoveredProductId(null);
    }; 

    try{
        if (isLoading) return <div>Loading products...</div>;
        if (error) return <div className="error">{error}</div>;
        if (products.length === 0) {
            return <div className="noProducts">No products available</div>;
        }
        return (
            <div>
                <div className="products">
                    {products.map((product) => (
                        <div key={product._id} 
                            className="product" 
                            onMouseEnter={() => handleMouseEnter(product._id)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <h3 className="productName">{product.productName}</h3>
                            <h4 className="productDescription">{product.description}</h4>
                            <h5 className="productPrice">Price: ₹{product.price}</h5>
                            <h5 className="productQuantity">Available: {product.quantity}</h5>

                            {hoveredProductId === product._id && (
                                <div>
                                    {isUser ? (
                                        wishlistState[product._id] ? (
                                            <button onClick={() => handleRemoveWishlist(product._id)}>
                                                Remove from Wishlist
                                            </button>
                                        ) : (
                                            <button onClick={() => handleWishlist(product._id)}>
                                                Add to Wishlist
                                            </button>
                                        )
                                        ) : (
                                            <button onClick={() => router.push("/login")}>
                                                Add to Wishlist
                                            </button>
                                        )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }catch (err) {
        console.error('Error fetching products:', err);
        return <div className="error">Server error while fetching products</div>;
    }
}