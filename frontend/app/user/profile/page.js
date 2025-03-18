"use client";
import { useState, useEffect } from "react";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const userDetails = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/proxy/user/profile", {
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
            setUser(data.user);
            setIsLoading(false);
            console.log(data);

        } catch (err) {
            console.error("Error fetching profile:", err);
            setError("Server error while fetching profile details");
            setIsLoading(false);
        }
    };

    useEffect(() => {
        userDetails();
    }, []);

    const handleEdit = async () => {

    };

    return (
        <>
            {isLoading ? (
                <div style={styles.loading}>Loading profile details...</div>
            ) : (
                <div style={styles.container}>
                    <h3 style={styles.heading}>Account</h3>
                    <h4 style={styles.userName}>{user.name}</h4>
                    <div style={styles.profile}>
                        <h3 style={styles.subHeading}>Profile Details</h3>
                        <div style={styles.listDetails}>
                            <ul style={styles.profileList}>
                                <li>Full Name</li>
                                <li>Mobile Number</li>
                                <li>Email ID</li>
                                <li>Gender</li>
                                <li>Date Of Birth</li>
                                <li>Location</li>
                            </ul>
                            <ul style={styles.profileList}>
                                <li>{user.name}</li>
                                <li>{user.phoneNum}</li>
                                <li>{user.email}</li>
                                <li>-</li>
                                <li>-</li>
                                <li>{user.address}</li>
                            </ul>
                        </div>
                        <div style={styles.editBtnDiv}>
                            <button style={styles.editBtn} onClick={handleEdit}>EDIT</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const styles = {
    container: {
        maxWidth: "800px",
        margin: "2rem auto",
        padding: "2rem",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    },
    heading: {
        color: "#4A90E2",
        fontSize: "1.8rem",
        fontWeight: "bold",
    },
    subHeading: {
        color: "#333",
        fontSize: "1.5rem",
        fontWeight: "bold",
    },
    userName: {
        color: "#555",
        fontSize: "1.3rem",
        marginBottom: "1rem",
    },
    profile: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "2rem",
    },
    listDetails: {
        display: "flex",
        gap: "2rem",
        justifyContent: "center",
    },
    profileList: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        listStyle: "none",
        textAlign: "left",
        padding: 0,
        fontSize: "1rem",
        color: "#444",
    },
    editBtnDiv: {
        marginTop: "1rem",
    },
    editBtn: {
        backgroundColor: "#4A90E2",
        color: "#fff",
        border: "none",
        padding: "0.7rem 1.5rem",
        fontSize: "1rem",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    editBtnHover: {
        backgroundColor: "#FF6F61",
    },
    loading: {
        textAlign: "center",
        fontSize: "1.2rem",
        color: "#555",
        marginTop: "2rem",
    },
};