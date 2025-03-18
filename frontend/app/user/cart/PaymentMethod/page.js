"use client";
import { useState } from "react";

export default function PaymentMethod() {
    const [activeOption, setActiveOption] = useState("recommended");
    const [recommendedOption, setRecommendedOption] = useState("codR");
    const [upiId, setUpiId] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");

    const isValidUpi = /^[a-zA-Z0-9]+@[a-zA-Z]+$/.test(upiId);
    const isValidCard = /^\d{16}$/.test(cardNumber) && /^\d{2}\/\d{2}$/.test(expiryDate) && /^\d{3}$/.test(cvv);

    const isButtonDisabled = 
        (activeOption === "upi" && !isValidUpi) || 
        (activeOption === "card" && !isValidCard);

    const handleContinue = () => {
        console.log("Continue with:", activeOption);
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
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

                {activeOption === "upi" && (
                    <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700">Enter your UPI ID:</label>
                        <input 
                            type="text" 
                            placeholder="e.g. user@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="mt-1 block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {!isValidUpi && upiId && (
                            <p className="text-red-500 text-sm">Invalid UPI ID</p>
                        )}
                    </div>
                )}
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

                {activeOption === "card" && (
                    <div className="mt-3 space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Card Number:</label>
                        <input 
                            type="text" 
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {!/^\d{16}$/.test(cardNumber) && cardNumber && (
                            <p className="text-red-500 text-sm">Invalid Card Number</p>
                        )}

                        <label className="block text-sm font-medium text-gray-700">Expiry Date:</label>
                        <input 
                            type="text" 
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            className="block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {!/^\d{2}\/\d{2}$/.test(expiryDate) && expiryDate && (
                            <p className="text-red-500 text-sm">Invalid Expiry Date</p>
                        )}

                        <label className="block text-sm font-medium text-gray-700">CVV:</label>
                        <input 
                            type="password" 
                            placeholder="***"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            className="block w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {!/^\d{3}$/.test(cvv) && cvv && (
                            <p className="text-red-500 text-sm">Invalid CVV</p>
                        )}
                    </div>
                )}
            </div>

            {/* Continue Button */}
            <button 
                onClick={handleContinue} 
                disabled={isButtonDisabled}
                className={`w-full mt-4 py-2 rounded-lg font-semibold transition-all shadow-md 
                    ${isButtonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"}`}
            >
                Continue
            </button>
        </div>
    );
}