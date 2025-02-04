"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";
import "../styles/page.css";

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
            <h3 className="header">Search results for {query}</h3>
            {loading ? (
                <p className="noProducts">Loading...</p>
                ) :(
                    <div>
                        {products.length > 0 ? (
                        <div className="products">
                            {products.map((product) => (
                                <div key={product._id} className="product">
                                    <h3 className="productName">{product.productName}</h3>
                                    <h4 className="productDescription">{product.description}</h4>
                                    <h5 className="productPrice">Price: ₹{product.price}</h5>
                                    <h5 className="productQuantity">Available: {product.quantity}</h5>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="noProducts">No products found!</p>
                    )}
                    </div>
                )}
        </div>
    )
}