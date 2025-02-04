"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout(){
    const router = useRouter();

    useEffect(()=>{
        const logout = async () => {
            try{
                const res = await fetch("/api/proxy/user/logout", {
                    method: "GET",
                    credentials: "include"
                });
                if(!res.ok){
                    const errorText = await res.text();
                    console.error("Failed to log out :" , errorText);
                    return;
                }
                const data = await res.json();
                router.push("/login"); // Redirect after successful logout
            }catch(err){
                console.error("Error during logout:", err);
            }
        };
        logout();
    }, [router]); // Dependency array includes `router`

    return <div style={styles.logout}>Logging out...</div>;
}

const styles = {
    logout: {
        fontSize: "2rem",
        color: "#4A90E2",
        textAlign: "center",
        margin: "2rem"
    }
}