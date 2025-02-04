import { useState } from "react";
import { IoSearch } from "react-icons/io5";

export default function Search({ onSearch }) {
    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim() !== "") {
            onSearch(query);
        }
    };

    return (
        <div style={styles.search}>
            <IoSearch style={styles.searchIcon} />
            <form onSubmit={handleSearch} className="searchForm" style={styles.form}>
                <input
                    type="text"
                    placeholder="Search for products here"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={styles.searchInput}
                />
            </form>
        </div>
    );
}

const styles = {
    search: {
        display: "flex",
        alignItems: "center",
        gap: "0.2rem",
        backgroundColor: "#fff",
        color: "#333",
        borderRadius: "20px", // More subtle rounded corners
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
        padding: "0.2rem 0.5rem", // Smaller padding for a minimalistic look
        width: "auto", // Automatically adjusts to content size
    },
    searchIcon: {
        height: "1.2rem", // Smaller icon for a cleaner look
        color: "#4A90E2", // Soft blue for the icon to match the navbar
    },
    searchInput: {
        flex: 1,
        padding: "0.4rem 1rem", // Smaller padding for input field
        borderRadius: "20px", // Match the container rounded corners
        outline: "none", // Remove default focus outline
        fontSize: "1rem",
        color: "#333",
        backgroundColor: "#fff", // Match the input background with the container
        transition: "all 0.3s ease", // Smooth transition for focus and hover effects
    },
    form: {
        width: "100%",
    }
};