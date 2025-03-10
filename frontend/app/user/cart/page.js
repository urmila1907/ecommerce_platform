"use client";
import { useState, useEffect } from "react";
import { CiCircleMinus, CiCirclePlus  } from "react-icons/ci";

export default function Cart(){
    const [cart, setCart] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCart = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/proxy/user/cart", {
                method: "GET",
                credentials: "include"
            });

            if (!res.ok) {
                const errorText = await res.text();
                setError(errorText);
                setIsLoading(false);
                return;
            }

            const data = await res.json();
            setCart(data.userCart);
            setIsLoading(false);
            console.log(data);

        } catch (err) {
            console.error("Error fetching cart:", err);
            setError("Server error while fetching cart details");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleMinus = async (id) => {
        try {
            const res = await fetch(`/api/proxy/user/cart/decrease/${id}`, {
                        method: "PATCH",
                        credentials: "include"
                        });
            if (!res.ok) {
                const errorText = await res.text();
                setError(errorText);
                return;
            }
            const data = await res.json();
            await fetchCart();
        } catch (err) {
            console.error("Error decreasing quantity:", err);
            setError("Failed to decrease product quantity");
        }
    };

    const handlePlus = async (id) => {
        try {
            const res = await fetch(`/api/proxy/user/cart/increase/${id}`, {
                method: "PATCH",
                credentials: "include"
                });
            if (!res.ok) {
                const errorText = await res.text();
                setError(errorText);
                return;
            }
            const data = await res.json();
            await fetchCart();
        } catch (err) {
            console.error("Error increasing quantity:", err);
            setError("Failed to increase product quantity");
        }
    };

    const handleOrder = async () => {
        
    };

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    return (
        <div>
            {isLoading == true ? <>
                <div style={styles.loading}>Loading cart details...</div>
            </> : 
            <>
                {cart && cart.products.length > 0 ? 
                <>
                    <div style={styles.cartContainer}>
                        <div style={styles.cartProducts}>
                            {cart.products.map((product) => (
                                <div key={product._id} style={styles.productDetails}>
                                    <h3 style={styles.productName}>{product.product.productName}</h3>
                                    <p style={styles.productDesc}>{product.product.description}</p>
                                    <div style={styles.quantityDetails}>
                                        <button onClick={() => handleMinus(product.product._id)} style={styles.minusBtn}><CiCircleMinus/></button>
                                        <p style={styles.productQty}>Qty: {product.quantity}</p>
                                        <button onClick={() => handlePlus(product.product._id)} style={styles.plusBtn}><CiCirclePlus/></button>
                                    </div>
                                    <p style={styles.productPrice}>Amount: ₹{product.price}</p>
                                </div>
                            ))}
                        </div>
                    <div style={styles.amountDetails}>
                        <h3 style={styles.totalAmount}>Total Amount: ₹{cart.totalCost}</h3>
                        <button style={styles.orderBtn} onClick={handleOrder}>Place Order</button>
                    </div>
                    </div>
                </> :
                <>
                    <div style={styles.noProducts}>Do some shopping!</div>
                </> 
                }
                </>}
        </div>
    )
}

const styles = {
    cartContainer: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "2rem",
        backgroundColor: "#FFFFFF",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        gap: "2rem",
    },
    cartProducts: {
        flex: "2",
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "column",
        gap: "1.5rem",
    },
    noProducts: {
        color: "#4A90E2",
        fontSize: "2rem",
        textAlign: "center",
        margin: "2rem"
    },
    loading: {
        color: "#4A90E2",
        fontSize: "2rem",
        textAlign: "center",
        margin: "2rem"
    },
    productDetails: {
        backgroundColor: "#F1F5F9",
        borderRadius: "8px",
        padding: "1rem",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
    productDetailsHover: {
        transform: "scale(1.02)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    productName: {
        fontSize: "1.2rem",
        fontWeight: "600",
        marginBottom: "0.5rem",
    },
    productDesc: {
        fontSize: "1rem",
        color: "#718096",
        marginBottom: "0.5rem",
    },
    quantityDetails: {
        display: "flex",
        gap: "0.7rem"
    },
    minusBtn: {
        marginBottom: "0.5rem",
    },
    plusBtn: {
        marginBottom: "0.5rem",
    },
    productQty: {
        fontSize: "1rem",
        color: "#48BB78",
        marginBottom: "0.5rem",
    },
    productPrice: {
        fontSize: "1rem",
        fontWeight: "700",
        color: "#E53E3E",
    },
    amountDetails: {
        flex: "1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EDF2F7",
        borderRadius: "8px",
        padding: "2rem",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    totalAmount: {
        fontSize: "1.5rem",
        fontWeight: "700",
        color: "#2B6CB0",
        marginBottom: "1rem",
    },
    orderBtn: {
        backgroundColor: "#4A90E2",
        color: "#FFFFFF",
        fontSize: "1rem",
        fontWeight: "600",
        padding: "0.8rem 1.5rem",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    orderBtnHover: {
        backgroundColor: "#2563EB",
    },
    error: {
        color: "#E53E3E",
        textAlign: "center",
        fontSize: "1.2rem",
        marginTop: "2rem",
    },
}