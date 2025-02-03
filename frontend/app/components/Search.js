import {useState} from "react";
import { CiSearch } from "react-icons/ci";

export default function Search({onSearch}){
    const [query, setQuery] = useState("");
    const handleSearch = (e) =>{
        e.preventDefault();
        if(query.trim() != ""){
            onSearch(query);
        }
    }
    return (
        <div style={styles.search}>
            <CiSearch style={styles.searchIcon}/>
            <form onSubmit={handleSearch} className="searchForm">
                <input type="text"
                    placeholder="Search for products here"
                    value={query}
                    onChange={(e)=> setQuery(e.target.value)}
                    className="searchInput">
                </input>
            </form>
        </div>
    )
}

const styles = {
    search: {
        display: "flex",
        gap: "0.5rem",
        backgroundColor: "#fff",
        color: "#000"
    },
    searchIcon: {
        height: "1.5rem"
    }
}