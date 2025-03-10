"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Search from "./Search";
import { useAuth } from "../context/authContext";
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for menu toggle

export default function Navbar() {
    const { isUser, loading } = useAuth();
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSearch = (query) => {
        if (query.trim() !== "") {
            router.push(`/search?query=${query}`);
        }
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) setMenuOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <nav className="fixed top-0 left-0 w-full bg-blue-500 text-white shadow-md p-4 flex justify-between items-center z-50">
            {/* Logo & Title */}
            <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="App logo" width="30" height="30" />
                <h1 className="text-lg font-semibold">E-commerce App</h1>
            </div>

            {/* Search Component */}
            <Search onSearch={handleSearch} />

            {/* Hamburger Menu (visible on mobile) */}
            <div className="md:hidden text-2xl cursor-pointer" onClick={toggleMenu}>
                {menuOpen ? <FaTimes /> : <FaBars />}
            </div>

            {/* Nav Links */}
            <ul className={`md:flex gap-6 text-lg absolute md:static top-16 right-0 w-full md:w-auto bg-blue-500 md:bg-transparent p-5 md:p-0 transition-all duration-300 ${menuOpen ? "block" : "hidden"}`}>
                {isUser ? (
                    <>
                        <li><Link href="/user/home" className="hover:text-red-400">Home</Link></li>
                        <li><Link href="/user/products" className="hover:text-red-400">Products</Link></li>
                        <li><Link href="/user/orders" className="hover:text-red-400">My Orders</Link></li>
                        <li><Link href="/user/wishlist" className="hover:text-red-400">Wishlist</Link></li>
                        <li><Link href="/user/cart" className="hover:text-red-400">My Cart</Link></li>
                        <li><Link href="/user/profile" className="hover:text-red-400">Profile</Link></li>
                        <li><Link href="/user/logout" className="hover:text-red-400">Log out</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link href="/" className="hover:text-red-400">Home</Link></li>
                        <li><Link href="/products" className="hover:text-red-400">Products</Link></li>
                        <li><Link href="/login" className="hover:text-red-400">Login</Link></li>
                        <li><Link href="/register" className="hover:text-red-400">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}
