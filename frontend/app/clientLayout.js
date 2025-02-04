"use client";
import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const noNavbarPages = ["/login", "/register"];
  
  return (
    <div style={{ paddingTop: noNavbarPages.includes(pathname) ? "0" : "4.3rem" }}>
      {!(noNavbarPages.includes(pathname)) && <Navbar />}
      {children}
    </div>
  );
}
