import Link from "next/link";
import Image from "next/image";

export default function Navbar({ items }) {
    return (
        <nav style={styles.navbar}>
            <div style={styles.title}>
                <Image src="/logo.png" alt="App logo" width="30" height="30" />
                <h1>E-commerce App</h1>
            </div>
            <ul style={styles.list}>
                {items.map((item) => (
                    <li key={item.name}>
                        <Link href={item.url} style={styles.link}>
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

const styles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#4A90E2",  // Soft blue background for the navbar
        color: "#FFFFFF",  // White text for better contrast
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",  // Soft shadow for depth
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
    }
}
