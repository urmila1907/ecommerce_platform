"use client";
import "@/app/styles/page.css";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/authContext";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";

export default function Products(){
    const {isUser} = useAuth();

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [wishlistState, setWishlistState] = useState({});
    const [products, setProducts] = useState([]);
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [hoveredProductId, setHoveredProductId] = useState(null);

    const fetchProducts = async() =>{
        try{
            setIsLoading(true);
            const res = await fetch("/api/proxy/product",{
                method: "GET",
                credentials: "include"
            });
            if (!res.ok) {
                throw new Error("Failed to fetch products");
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
    
    const fetchWishlist = async () => {
        try {
            if (!isUser) return;
            const wishlistRes = await fetch("/api/proxy/user/wishlist", {
                method: "GET",
                credentials: "include"
            });
            if (!wishlistRes.ok) {
                throw new Error("Failed to fetch products from wishlist");
            }
            const wishlistData = await wishlistRes.json();
            setWishlistProducts(wishlistData.products);
        } catch (err) {
            console.error("Error fetching products from wishlist:", err);
            setError("Server error while fetching products from wishlist");
        }
    };

    useEffect(() => {
        fetchProducts();
        if (isUser) {
            fetchWishlist();
        }
    }, [isUser]); 
    
    useEffect(() => {
        if (wishlistProducts.length > 0) {
            const newWishlistState = {};
            wishlistProducts.forEach((product) => {
                newWishlistState[product.product._id] = true;
            });
            setWishlistState(newWishlistState);
        } else {
            // If wishlistProducts is empty, you might want to clear the state:
            setWishlistState({});
        }
    }, [wishlistProducts]);     

    const handleWishlist = async (id)=>{
        try{
            const res = await fetch(`/api/proxy/user/wishlist/${id}`, {
                method: "POST",
                body: ""
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
            const res = await fetch(`/api/proxy/user/wishlist/${id}`, {
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
            console.error("Error removing product from wishlist:", err);
            setError("Server error while removing product from wishlist");
        }
    }

    const handleMouseEnter = (id) => {
        setHoveredProductId(id);
    };

    const handleMouseLeave = () => {
        setHoveredProductId(null);
    }; 

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
                                {isUser && (
                                    <div style={styles.btnContainer}>
                                        <button onClick={() => wishlistState[product._id] ? handleRemoveWishlist(product._id) : handleWishlist(product._id)}>
                                            <div style={styles.btnHeart}>
                                                {wishlistState[product._id] ? <FaHeart /> : <FaRegHeart />}
                                                {wishlistState[product._id] ? "Added to Wishlist" : "Add to Wishlist"}	
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    btnContainer:{
        marginTop: "1rem",
        textAlign: "center",
        border: "0.05rem solid #787878"
    },
    btnHeart: {
        display: "flex",
        flexWrap: "wrap",
        gap: "0.7rem",
        alignItems: "center",
        padding: "0.2rem"
    }
}