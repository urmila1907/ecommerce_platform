import Navbar from "./Navbar";
import { isAuthenticated } from "../lib/auth";

export default function NavbarWrapper() {
    const isLoggedIn = isAuthenticated(); // Check login status on server
    return <Navbar isLoggedIn={isLoggedIn} />;
}
