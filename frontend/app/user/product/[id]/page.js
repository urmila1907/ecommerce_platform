"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/authContext";
import { FaRegHeart, FaCartShopping } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";

export default function Product() {
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wishlist, setWishlist] = useState(false);
    const [cart, setCart] = useState(false);

    const params = useParams();
    const id = params?.id || "";
    const {isUser} = useAuth();

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/proxy/product/${id}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch product details");
                }

                const data = await res.json();
                setProduct(data.productDetails);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Server error while fetching products");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(()=>{
        if(!id || !isUser) return;
        let isMounted = true; // Prevent state update if component unmounts

        const fetchWishlistCartStatus = async () => {
            try {
                const wishlistRes = await fetch(`/api/proxy/user/wishlist/${id}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (wishlistRes.ok) {
                    const wishlistData = await wishlistRes.json();
                    if (isMounted) setWishlist(wishlistData.exist);
                }

                const cartRes = await fetch(`/api/proxy/user/cart/${id}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (cartRes.ok) {
                    const cartData = await cartRes.json();
                    if (isMounted) setCart(cartData.exist);
                }
            } catch (err) {
                console.error("Error checking wishlist/cart status:", err);
                if (isMounted) setError("Server error while checking product's presence in wishlist/cart");
            }
        };
        fetchWishlistCartStatus();

        return () => {
            isMounted = false; // Cleanup function
        };
    }, [id, isUser]);

    const handleWishlist = async ()=>{
        try{
            const res = await fetch(`/api/proxy/user/wishlist/${id}`, {
                method: "POST",
                body: "",
                credentials: "include",
            });
            if (!res.ok) {
                const errorText = await res.text();
                setError(errorText);
                return;
            }
            const data = await res.json();
            setWishlist(true);
        }   
        catch(err){
            console.error("Error adding product to wishlist:", err);
            setError("Server error while adding product to wishlist");
        }
    }

    const handleRemoveWishlist = async ()=>{
        try{
            const res = await fetch(`/api/proxy/user/wishlist/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) {
                const errorText = await res.text();
                setError(errorText);
                return;
            }
            const data = await res.json();
            setWishlist(false);
        }   
        catch(err){
            console.error("Error removing product from wishlist:", err);
            setError("Server error while removing product from wishlist");
        }
    }

    const handleCart = async ()=>{
        try{
            const res = await fetch(`/api/proxy/user/cart/${id}`, {
                method: "POST",
                body: "",
                credentials: "include",
            });
            if (!res.ok) {
                const errorText = await res.text();
                setError(errorText);
                return;
            }
            const data = await res.json();
            setCart(true);
        }   
        catch(err){
            console.error("Error adding product to cart:", err);
            setError("Server error while adding product to cart");
        }
    }

    const handleRemoveCart = async ()=>{
        try{
            const res = await fetch(`/api/proxy/user/cart/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!res.ok) {
                const errorText = await res.text();
                setError(errorText);
                return;
            }
            const data = await res.json();
            setCart(false);
        }   
        catch(err){
            console.error("Error removing product from cart:", err);
            setError("Server error while removing product from cart");
        }
    }

    return (
        <>
            {isLoading ? (
                <p style={styles.loadingText}>Loading...</p>
            ) : error ? (
                <p style={styles.errorText}>{error}</p>
            ) : (
                <div style={styles.productContainer}>
                    <div style={styles.firstContainer}>
                        <h2 style={styles.productName}>{product?.productName}</h2>
                        <h3 style={styles.price}>₹{product?.price}</h3>
                        <h3 style={styles.quantity}>Stock: {product?.quantity}</h3>
                    </div>

                    <div style={styles.secondContainer}>
                        <h4 style={styles.description}>{product?.description}</h4>
                        <div style={styles.btnContainer}>
                            <button onClick={() => wishlist ? 
                                handleRemoveWishlist() : 
                                handleWishlist()}
                                style={styles.wishlistBtn}
                            >
                                <div style={styles.btnHeart}>
                                    {wishlist ? <FaHeart /> : <FaRegHeart />}
                                    {wishlist ? "Added to Wishlist" : "Add to Wishlist"}	
                                </div>
                            </button>
                            <button onClick={() => cart ? 
                                handleRemoveCart() : 
                                handleCart()}
                                style={styles.cartBtn}
                            >
                                <div style={styles.btnCart}>
                                    {cart ? <FaCartShopping  /> : <IoCartOutline />}
                                    {cart ? "Added to Cart" : "Add to Cart"}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const styles = {
    productContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
    },
    firstContainer: {
        textAlign: "center",
        paddingBottom: "1rem",
        borderBottom: "1px solid #ddd",
        width: "100%",
    },
    productName: {
        fontSize: "1.8rem",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "0.5rem",
    },
    price: {
        fontSize: "1.5rem",
        color: "#4A90E2",
        fontWeight: "bold",
        marginBottom: "0.5rem",
    },
    quantity: {
        fontSize: "1.1rem",
        color: "#666",
    },
    secondContainer: {
        textAlign: "center",
        marginTop: "1rem",
        width: "100%",
    },
    description: {
        fontSize: "1rem",
        color: "#444",
        marginBottom: "1.5rem",
    },
    btnContainer: {
        display: "flex",
        gap: "1rem",
        justifyContent: "center",
    },
    btnHeart: {
        display: "flex",
        gap: "0.5rem",
        alignItems: "center"
    },
    wishlistBtn: {
        padding: "0.8rem 1.5rem",
        fontSize: "1rem",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#FF6F61",
        color: "#fff",
        cursor: "pointer",
        transition: "0.3s",
    },
    btnCart: {
        padding: "0.8rem 1.5rem",
        fontSize: "1rem",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#4A90E2",
        color: "#fff",
        cursor: "pointer",
        transition: "0.3s",
        display: "flex",
        gap: "0.5rem",
        alignItems: "center"
    },
    loadingText: {
        textAlign: "center",
        fontSize: "1.2rem",
        color: "#4A90E2",
    },
    errorText: {
        textAlign: "center",
        fontSize: "1.2rem",
        color: "red",
    },
};

// Button hover effects
styles.wishlistBtn[":hover"] = { backgroundColor: "#E44D42" };
styles.btnCart[":hover"] = { backgroundColor: "#357ABD" };
