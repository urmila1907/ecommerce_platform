"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {FaEyeSlash, FaEye} from "react-icons/fa";

export default function Login(){
    const [formData, setFormData] = useState({
        userName: "",
        password: "",
        rememberMe: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordFocus, setIsPasswordFocus] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const handleSignup = () => {
        router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/register`);
    };

    const togglePasswordVisibility = ()=>{
        setShowPassword(!showPassword);
    }
    const handleFocus = ()=>{
        setIsPasswordFocus(true);
    }
    const handleBlur = ()=>{
        setIsPasswordFocus(false);
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/login`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        const result = await res.json();
        console.log(result);
        if(!result.ok) console.log("error in logging in user");
        router.push(`${process.env.NEXT_PUBLIC_BASE_URL}`);
    }
    return (
        <div style={styles.container}>
            <div style={styles.login}>
                <div style={styles.imageContainer}>
                    <Image 
                    src="/ec-2.jpg" 
                    alt="login image" 
                    width="400" 
                    height="400"
                    style={styles.image}>

                    </Image>
                </div>
                
                <div style={styles.mainLogin}>
                    <h2 style={styles.heading}>
                        Welcome Back :)
                    </h2>

                    <form 
                        onSubmit={handleSubmit} 
                        style={styles.form}
                    >
                        <label style={styles.label}>
                            Username: 
                            <input type="text" 
                            name="userName" 
                            required 
                            value={formData.userName}
                            onChange={handleChange}
                            style={styles.input}/>
                        </label>

                        <label style={styles.label}>
                            Password:
                            <div 
                                style={styles.passwordContainer}
                                onFocus={() => setIsPasswordFocus(true)} 
                                onBlur={() => setIsPasswordFocus(false)} 
                            > 
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                                {(isPasswordFocus &&
                                    <span
                                        style={styles.icon}
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? <FaEyeSlash/> : <FaEye/>}
                                    </span>
                                )}
                            </div>
                        </label>

                        <div style={styles.password}>
                            <label style={styles.rememberMe}>
                                <input
                                        type="checkbox"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        style={styles.checkbox}
                                />
                                Remember Me
                            </label>
                            <Link href="/forgot-password">Forgot Password?</Link>
                        </div>
                        <div style={styles.buttons}>
                            <button 
                                type="submit" 
                                style={styles.loginBtn}
                            >
                                Login
                            </button>
                            <button 
                                type="button" 
                                style={styles.signup} 
                                onClick={handleSignup}
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: "#f5f5f5", // Light grey background
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    login:{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff", // White card
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow
        borderRadius: "10px",
        padding: "2rem",
        maxWidth: "900px",
        width: "90%", // Responsive width
        gap: "2rem",
        flexWrap: "wrap",
    },
    imageContainer: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    image:{
        borderRadius: "10px", // Rounded corners for the image
        objectFit: "cover",
        maxWidth: "100%",
    },
    mainLogin: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
    },
    heading: {
        fontSize: "24px",
        color: "#222",
    },
    form:{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "100%",
    },
    label:{
        display: "flex",
        flexDirection: "column",
        fontSize: "16px",
        color: "#444", // Slightly lighter grey
        fontWeight: "500",
    },
    passwordContainer: {
        position: "relative",
        width: "100%",
    },
    icon: {
        position: "absolute",
        top: "50%", // Vertically center the icon
        right: "1rem", // Position the icon to the right of the input
        transform: "translateY(-50%)", // Center the icon vertically
        cursor: "pointer",
        fontSize: "18px",
        color: "#888",
        transition: "color 0.2s ease",
    }, 
    input: {
        width: "100%", // Full width of the input
        padding: "0.5rem 2.5rem 0.5rem 0.5rem", // Add right padding for the icon
        fontSize: "16px",
        border: "1px solid #ddd",
        borderRadius: "6px",
        outline: "none",
        transition: "border-color 0.2s ease",
        boxSizing: "border-box",
    }, 
    password: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "0.9rem",
        width: "100%",
    },
    rememberMe: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
    },
    checkbox: {
        cursor: "pointer",
    },
    buttons: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        gap: "1rem",
    },
    loginBtn:{
        padding: "0.8rem 1rem",
        backgroundColor: "#0056b3", // Deep blue for the button
        color: "#fff",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
        borderRadius: "8px",
        flex: 1,
    },
    signup: {
        padding: "0.8rem 1rem",
        backgroundColor: "#eef", // Deep blue for the button
        color: "#000",
        border: "none",
        cursor: "pointer",
        fontSize: "16px",
        borderRadius: "8px",
        flex: 1,
    }
}