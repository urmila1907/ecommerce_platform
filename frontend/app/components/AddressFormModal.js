"use client";
import { useState, useEffect } from "react";

export default function AddressFormModal({ onClose, onSave, formAddress}) {
    const [formData, setFormData] = useState({
        fullName: "",
        addressLine1: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        phoneNum: "",
    });

    useEffect(() => {
        if (formAddress) {
            setFormData(formAddress); // Update fields when editing
        }
    }, [formAddress]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSave(formData);
        onClose(); // Close the modal after saving
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={styles.heading}>Add New Address</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label htmlFor="fullName">Full Name*</label>
                        <input type="text" name="fullName" id="fullName"
                            placeholder="Full Name" value={formData.fullName} 
                            onChange={handleChange} required 
                            style={styles.input}/> 
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="addressLine1">Address Line</label>
                        <input type="text" name="addressLine1" id="addressLine1" placeholder="Address Line 1*" 
                            value={formData.addressLine1} onChange={handleChange} 
                            required style={styles.input}/>
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="city">City</label>
                        <input type="text" name="city" id="city" placeholder="City" 
                            value={formData.city} onChange={handleChange} 
                            required style={styles.input}/>
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="state">State</label>
                        <input type="text" name="state" id="state" placeholder="State" 
                            value={formData.state} onChange={handleChange} 
                            required style={styles.input}/>
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="country">Country*</label>
                        <input type="text" name="country" id="country" placeholder="Country" 
                            value={formData.country} onChange={handleChange} 
                            required style={styles.input}/>
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="postalCode">Postal Code*</label>
                        <input type="text" name="postalCode" id="postalCode" placeholder="Postal Code*" 
                            value={formData.postalCode} onChange={handleChange} 
                            required style={styles.input}/>
                    </div>
                    <div style={styles.inputGroup}>
                        <label htmlFor="phoneNum">Phone No.*</label>
                        <input type="text" name="phoneNum" id="phoneNum" placeholder="Phone Number*" 
                            value={formData.phoneNum} onChange={handleChange} 
                            required style={styles.input}/>
                    </div>

                    <div style={styles.buttonContainer}>
                        <button type="submit" style={styles.saveBtn}>Save Address</button>
                        <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modal: {
        backgroundColor: "#fff",
        padding: "1.5rem",
        borderRadius: "0.4rem",
        width: "45%",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    },
    heading: {
        fontSize: "1.2rem",
        fontWeight: "bold",
        marginBottom: "10px",
        color: "#4A90E2",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "0.2rem",
    },
    label: {
        fontWeight: "bold",
        fontSize: "14px",
    },
    input:{
        border: "0.02rem solid grey",
        borderRadius: "0.4rem",
        padding: "0.2rem"
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-between",
    },
    saveBtn: {
        padding: "0.5rem",
        backgroundColor: "#4A90E2",
        color: "white",
        border: "none",
        borderRadius: "0.3rem",
        cursor: "pointer",
    },
    cancelBtn: {
        padding: "0.5rem",
        backgroundColor: "gray",
        color: "white",
        border: "none",
        borderRadius: "0.3rem",
        cursor: "pointer",
    },
};
