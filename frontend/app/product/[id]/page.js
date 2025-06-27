"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import "@/app/styles/product.css";

export default function Product() {
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const params = useParams();
    const id = params?.id || "";
    const router = useRouter();
    
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

    return (
        <>
            {isLoading ? (
                <p className="loadingText">Loading...</p>
            ) : error ? (
                <p className="errorText">{error}</p>
            ) : (
                <div className="productContainer">
                    <div className="firstContainer">
                        <h2 className="productName">{product?.productName}</h2>
                        <h3 className="price">₹{product?.price}</h3>
                        <h3 className="quantity">Stock: {product?.quantity}</h3>
                    </div>

                    <div className="secondContainer">
                        <h4 className="description">{product?.description}</h4>
                        <div className="btnContainer">
                            <button onClick={() => router.push("/login")}
                                className="wishlistBtn"
                            >
                                <div className="btnHeart">
                                    <FaRegHeart />
                                    Add to Wishlist	
                                </div>
                            </button>
                            <button onClick={() => router.push("/login")}
                                className="btnCart"
                            >
                                <div className="btnCart">
                                    <IoCartOutline />
                                    Add to Cart
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
