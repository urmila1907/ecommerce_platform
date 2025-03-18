"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AddressFormModal from "@/app/components/AddressFormModal";

export default function Address() {
    const [defaultAddress, setDefaultAddress] = useState([]);
    const [otherAddress, setOtherAddress] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [formAddress, setFormAddress] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const addressDetails = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/proxy/user/address", {
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
            const address = data.address;

            setDefaultAddress(address.filter((ad) => ad.isDefault === true));
            setOtherAddress(address.filter((ad) => ad.isDefault === false));
        } catch (err) {
            console.error("Error fetching address:", err);
            setError("Server error while fetching address details");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        addressDetails();
    }, []);

    const handleSelectAddress = (id) => setSelectedAddress(id);

    const handleSaveAddress = async (formData) => {
        try {
            const res = await fetch('/api/proxy/user/address/', {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                });
            if (!res.ok) {
                const errorText = await res.text();
                setError(errorText);
                return;
            }
            const data = await res.json();
            await addressDetails();
        } catch (err) {
            console.error("Error adding address details:", err);
            setError("Failed to add address details");
        }
    }
    const handleMove = () => {
        router.push("/user/cart/payment-method");
    }
    const handleAddAddress = () => {
        setIsModalOpen(true);
    }

    const handleEditAddress = (address) => {
        setFormAddress(address); // Set the address to edit
        setIsModalOpen(true);
    }

    const editAddress = async (address) =>{
        try {
            const res = await fetch(`/api/proxy/user/address/${address._id}`, {
                    method: "PUT",
                    credentials: "include",
                //    headers: { "Content-Type": "application/json" },
                    body: address
                });
            if (!res.ok) {
                const errorText = await res.text();
                setError(errorText);
                return;
            }
            const data = await res.json();
            await addressDetails();
        } catch (err) {
            console.error("Error updating address details:", err);
            setError("Failed to update address details");
        }
    }

    const handleRemoveAddress = async (id) => {
        try {
            const res = await fetch(`/api/proxy/user/address/${id}`, {
                    method: "DELETE",
                    credentials: "include",
                });
            if (!res.ok) {
                const errorText = await res.text();
                setError(errorText);
                return;
            }
            const data = await res.json();
            await addressDetails();
        } catch (err) {
            console.error("Error removing address details:", err);
            setError("Failed to remove address details");
        }
    }

    return (
        <div style={styles.container}>
            {isLoading ? (
                <p>Loading address details...</p>
            ) : (
                <>
                    {isModalOpen && <AddressFormModal 
                        onClose={() => setIsModalOpen(false)} 
                        onSave={formAddress ? editAddress : handleSaveAddress} 
                        formAddress={formAddress} />
                    }

                    {defaultAddress.length === 0 && otherAddress.length === 0 ? (
                        <button onClick={handleAddAddress} style={styles.addBtn}>
                            + Add Address
                        </button>
                    ) : (
                        <>
                            <div style={styles.header}>
                                <h2 style={styles.headingTop}>Select Delivery Address</h2>
                                <button onClick={handleAddAddress} style={styles.addBtnSmall}>
                                    + Add Address
                                </button>
                            </div>

                            <div style={styles.addressList}>
                                {defaultAddress.length > 0 && (
                                    <>
                                        <h3>Default Address</h3>
                                        {defaultAddress.map((address) => (
                                            <label
                                                key={address._id}
                                                style={{
                                                    ...styles.addressCard,
                                                    ...(selectedAddress === address._id
                                                        ? styles.addressCardSelected
                                                        : {}),
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    value={address._id}
                                                    checked={selectedAddress === address._id}
                                                    onChange={() => handleSelectAddress(address._id)}
                                                    style={styles.radio}
                                                />
                                                <div style={styles.addressContent}>
                                                    <p><strong>{address.fullName}</strong></p>
                                                    <p>{address.addressLine1}, {address.city}, {address.state}, {address.country}, {address.postalCode}</p>
                                                    <p>Mobile: {address.phoneNum}</p>
                                                </div>

                                                {selectedAddress === address._id && (
                                                    <div style={styles.buttonGroup}>
                                                        <button style={styles.editBtn} onClick={() => handleEditAddress(address)}>Edit</button>
                                                        <button style={styles.removeBtn} onClick={() => handleRemoveAddress(address._id)}>Remove</button>
                                                    </div>
                                                )}
                                            </label>
                                        ))}
                                    </>
                                )}

                                {otherAddress.length > 0 && (
                                    <>
                                        <h3>Other Addresses</h3>
                                        {otherAddress.map((address) => (
                                            <label
                                                key={address._id}
                                                style={{
                                                    ...styles.addressCard,
                                                    ...(selectedAddress === address._id
                                                        ? styles.addressCardSelected
                                                        : {}),
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    value={address._id}
                                                    checked={selectedAddress === address._id}
                                                    onChange={() => handleSelectAddress(address._id)}
                                                    style={styles.radio}
                                                />
                                                <div style={styles.addressContent}>
                                                    <p><strong>{address.fullName}</strong></p>
                                                    <p>{address.addressLine1}, {address.city}, {address.state}, {address.country}, {address.postalCode}</p>
                                                    <p>Mobile: {address.phoneNum}</p>
                                                </div>
                                                {selectedAddress === address._id && (
                                                    <div style={styles.buttonGroup}>
                                                        <button style={styles.editBtn} onClick={() => handleEditAddress(address)}>Edit</button>
                                                        <button style={styles.removeBtn} onClick={() => handleRemoveAddress(address._id)}>Remove</button>
                                                    </div>
                                                )}
                                            </label>
                                        ))}
                                    </>
                                )}
                            </div>
                        </>
                    )}

                    <button
                        onClick={handleMove}
                        style={{
                            ...styles.continueBtn,
                            backgroundColor: selectedAddress ? "#4A90E2" : "gray",
                            cursor: selectedAddress ? "pointer" : "not-allowed"
                        }}
                        disabled={!selectedAddress}
                    >
                        Continue
                    </button>
                </>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: "60%",
        margin: "5vh auto",
        padding: "2rem",
        borderRadius: "0.625rem",
        boxShadow: "0 0.25rem 0.75rem rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        fontFamily: "Arial, sans-serif",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.25rem",
    },
    headingTop: {
        fontWeight: "bold",
        fontSize: "1.25rem",
    },
    addBtnSmall: {
        padding: "0.5rem 0.75rem",
        backgroundColor: "#4A90E2",
        color: "white",
        border: "none",
        borderRadius: "0.3125rem",
        cursor: "pointer",
        fontSize: "1rem",
    },
    addressList: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    addressCard: {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        border: "1px solid #ddd",
        padding: "1rem",
        borderRadius: "0.5rem",
        cursor: "pointer",
        transition: "0.3s",
        backgroundColor: "#fafafa",
        position: "relative",
        flexWrap: "wrap",
    },
    addressCardSelected: {
        border: "2px solid #4A90E2",
        backgroundColor: "#E6F0FF",
        transform: "scale(1.02)",
    },
    radio: {
        width: "1.25rem",
        height: "1.25rem",
        accentColor: "#4A90E2",
        cursor: "pointer",
    },
    addressContent: {
        flexGrow: "1",
        fontSize: "1rem",
    },
    buttonGroup: {
        display: "flex",
        gap: "0.75rem",
        marginTop: "0.5rem",
        width: "100%",
        justifyContent: "flex-end",
    },
    editBtn: {
        padding: "0.5rem 1rem",
        backgroundColor: "#4A90E2",
        color: "white",
        border: "none",
        borderRadius: "0.3125rem",
        cursor: "pointer",
        fontSize: "0.9rem",
    },
    removeBtn: {
        padding: "0.5rem 1rem",
        backgroundColor: "#FF6F61",
        color: "white",
        border: "none",
        borderRadius: "0.3125rem",
        cursor: "pointer",
        fontSize: "0.9rem",
    },
    continueBtn: {
        width: "100%",
        padding: "1rem",
        fontSize: "1rem",
        fontWeight: "bold",
        color: "white",
        border: "none",
        borderRadius: "0.3125rem",
        marginTop: "1.25rem",
    },
};
