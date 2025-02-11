"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Search from "./Search";
import { useAuth } from "../context/authContext";

export default function Navbar() {
    const {isUser, loading} = useAuth();
    const router = useRouter();

    const handleSearch = (query)=>{
        if(query.trim() != ""){
            router.push(`/search?query=${query}`);
        }
    }
    if(loading){
        return <div>Loading...</div>;
    }

    return (
        <nav style={styles.navbar}>
            <div style={styles.title}>
                <Image src="/logo.png" alt="App logo" width="30" height="30" />
                <h1>E-commerce App</h1>
            </div>

            <Search onSearch={handleSearch}/>

            <ul style={styles.list}>
                {isUser ? (
                    <>
                        <li>
                            <Link href="/user/home" style={styles.link}>Home</Link>
                        </li>
                        <li>
                            <Link href="/user/products" style={styles.link}>Products</Link>
                        </li>
                        <li>
                            <Link href="/user/orders" style={styles.link}>My Orders</Link>
                        </li>
                        <li>
                            <Link href="/user/wishlist" style={styles.link}>Wishlist</Link>
                        </li>
                        <li>
                            <Link href="/user/cart" style={styles.link}>My Cart</Link>
                        </li>
                        <li>
                            <Link href="/user/profile" style={styles.link}>Profile</Link>
                        </li>
                        <li>
                            <Link href="/user/logout" style={styles.link}>Log out</Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link href="/" style={styles.link}>Home</Link>
                        </li>
                        <li>
                            <Link href="/products" style={styles.link}>Products</Link>
                        </li>
                        <li>
                            <Link href="/login" style={styles.link}>Login</Link>
                        </li>
                        <li>
                            <Link href="/register" style={styles.link}>Register</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

const styles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.8rem 2rem",
        backgroundColor: "#4A90E2",  // Soft blue background for the navbar
        color: "#FFFFFF",  // White text for better contrast
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",  // Soft shadow for depth
        overflowX: "auto", /* Enables horizontal scroll */
        whiteSpace: "nowrap",
        position: "fixed", 
        width: "100%", 
        top: 0,
        left: 0,
        zIndex: 1000
    },
    title: {
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
    },
    list: {
        listStyle: "none",
        display: "flex",
        gap: "1.5rem",  // Slightly more space between navbar links
    },
    link: {
        color: "#FFFFFF",  // White text for links
        textDecoration: "none",  // Removing underline from links
        fontSize: "1.1rem",
        fontWeight: "500",  // Medium font weight for the links
        transition: "color 0.3s ease",  // Smooth transition on hover
    },
    linkHover: {
        color: "#FF6F61",  // Red-orange color for the hover effect
    },
}
