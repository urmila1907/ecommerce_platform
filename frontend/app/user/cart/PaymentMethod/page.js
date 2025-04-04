"use client";
import { useState } from "react";
import PaymentConfModal from "@/app/components/PaymentConfModal";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function PaymentMethod() {
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) return resolve(true); // already loaded
    
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };
    
    const [activeOption, setActiveOption] = useState("recommended");
    const [recommendedOption, setRecommendedOption] = useState("codR");
    const [modal, setModal] = useState(false);
    const router = useRouter();

    const handleContinue = () => {
        setModal(true);
    };

    const confirmOrder = async () => {
        try {
            if(activeOption === "cod" || activeOption === "recommended"){
                const response = await fetch("/api/proxy/user/order", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ paymentMethod: activeOption, razorpayOrderId: null }),
                });
    
                if (response.ok) {
                    toast.success("Order placed successfully!");
                    setModal(false);
                    const order = await response.json();
                    const id = order.allOrderDetails._id;
                    router.push(`/user/order/${id}`);
                } else {
                    toast.error("Failed to place order. Try again.");
                }
            }
            else if(activeOption === "upi" || activeOption === "card"){
                const res = await fetch("/api/proxy/user/cart", {
                    method: "GET",
                    credentials: "include"
                });
    
                if (!res.ok) {
                    const errorText = await res.text();
                    setError(errorText);
                    return;
                }
    
                const data = await res.json();

                const response = await fetch("/api/proxy/user/payment/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({ amount: data.userCart.totalCost, currency: "INR" }) // Amount in paise
                });

                const orderData = await response.json();

                if (response.ok && orderData?.id) {
                    const razorpayLoaded = await loadRazorpayScript();

                    if (!razorpayLoaded) {
                        toast.error("Failed to load Razorpay SDK.");
                        return;
                    }
                    const options = {
                        key: orderData.key, // Razorpay key_id from server
                        amount: orderData.amount,
                        currency: orderData.currency,
                        name: "Ecommerce Store",
                        description: "Order Payment",
                        order_id: orderData.id,
                        prefill: {
                            email: "user@example.com",
                            contact: "9999999999",
                        },
                        theme: {
                            color: "#4A90E2"
                        },
                        handler: async function (response) {
                            // Send razorpay_payment_id, razorpay_order_id, and razorpay_signature to backend
                            const verifyRes = await fetch("/api/proxy/user/payment/verify", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                credentials: "include",
                                body: JSON.stringify(response)
                            });

                            if (verifyRes.ok) {
                                const razorpayDetails = await verifyRes.json();
                                
                                toast.success("Payment successful!");
                                const resp = await fetch("/api/proxy/user/order", {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ paymentMethod: activeOption, razorpayOrderId: razorpayDetails.payment.razorpay_order_id }),
                                });
                    
                                if (resp.ok) {
                                    toast.success("Order placed successfully!");
                                    setModal(false);
                                    const order = await resp.json();
                                    const id = order.allOrderDetails._id;
                                    router.push(`/user/order/${id}`);
                                } else {
                                    toast.error("Failed to place order. Try again.");
                                }
                            } else {
                                toast.error("Payment verification failed.");
                            }
                        },
                        modal: {
                            ondismiss: function () {
                                toast("Payment cancelled.", { icon: "❌" });
                            }
                        }
                    };
            
                    const rzp = new window.Razorpay(options);
                    rzp.open();
                } else {
                    toast.error("Failed to create Razorpay order.");
                }
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="max-w-lg mx-auto my-6 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Choose Payment Mode</h2>

            {/* Recommended (Default Open) */}
            <div className={`p-4 border rounded-lg mb-3 ${activeOption === "recommended" ? "bg-blue-100" : "bg-gray-100"} transition-all`}>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                        type="radio"
                        checked={activeOption === "recommended"}
                        onChange={() => setActiveOption("recommended")}
                        className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="font-medium">Recommended</span>
                </label>

                {activeOption === "recommended" && (
                    <div className="mt-3 pl-6">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input 
                                type="radio"
                                checked={recommendedOption === "codR"}
                                onChange={() => setRecommendedOption("codR")}
                                className="form-radio h-4 w-4 text-blue-600"
                            />
                            <span>Cash On Delivery</span>
                        </label>
                    </div>
                )}
            </div>

            {/* Cash On Delivery (Separate Option) */}
            <div className={`p-4 border rounded-lg mb-3 ${activeOption === "cod" ? "bg-blue-100" : "bg-gray-100"} transition-all`}>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                        type="radio"
                        checked={activeOption === "cod"}
                        onChange={() => setActiveOption("cod")}
                        className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span>Cash On Delivery</span>
                </label>
            </div>

            {/* UPI */}
            <div className={`p-4 border rounded-lg mb-3 ${activeOption === "upi" ? "bg-blue-100" : "bg-gray-100"} transition-all`}>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                        type="radio"
                        checked={activeOption === "upi"}
                        onChange={() => setActiveOption("upi")}
                        className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span>UPI (Pay via any app)</span>
                </label>
            </div>

            {/* Credit/Debit Card */}
            <div className={`p-4 border rounded-lg mb-3 ${activeOption === "card" ? "bg-blue-100" : "bg-gray-100"} transition-all`}>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                        type="radio"
                        checked={activeOption === "card"}
                        onChange={() => setActiveOption("card")}
                        className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span>Credit/Debit Card</span>
                </label>
            </div>

            {/* Continue Button */}
            <button 
                onClick={handleContinue} 
                className={`w-full mt-4 py-2 rounded-lg font-semibold transition-all shadow-md bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500`}
            >
                Continue
            </button>

            {modal && (
                <PaymentConfModal 
                    onConfirm={confirmOrder} 
                    onClose={() => setModal(false)} 
                />
            )}
        </div>
    );
}