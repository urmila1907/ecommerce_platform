import Link from "next/link";
import Image from "next/image";

export default function Navbar(){
    return (
        <nav style={styles.navbar}>
            <div style={styles.title}>
                <Image src="/logo.png" alt="App logo" width="30" height="30"></Image>
                <h1>E-commerce App</h1>
            </div>
            <ul style={styles.list}>
                <li><Link href="\">Home</Link></li>
                <li><Link href="\products">Products</Link></li>
                <li><Link href="\contact">Contact us</Link></li>
                <li><Link href="\about">About</Link></li>
            </ul>
        </nav>
    );
}

const styles = {
    navbar:{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#333",
        color: "#fff",
    },
    title:{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem"
    },
    list:{
        listStyle: "none",
        display: "flex",
        gap: "1rem",
    }
}