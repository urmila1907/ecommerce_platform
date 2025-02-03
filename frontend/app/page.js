import Navbar from "@/app/components/Navbar";
import About from "./components/About";
import Contact from "./components/Contact"; 

export default function Home() {
  return (
    <div>
      <main style={styles.main}>
        <Navbar
          items={[
            { name: "Home", url: "/" },
            { name: "Products", url: "/products" },
            { name: "About", url: "#about" },
            { name: "Contact us", url: "#contact" },
            { name: "Login / Register", url: "/login" },
          ]}
        />
        <h1 style={styles.tagline}>Welcome to my e-commerce store!</h1>
      </main>

      <section id="about" style={styles.section}>
        <About />
      </section>

      <section id="contact" style={styles.section}>
        <Contact /> 
      </section>
    </div>
  );
}

const styles = {
  main: {
    scrollBehavior: "smooth", 
    height: "100vh",
  },
  tagline: {
    color: "#456",
    padding: "1rem",
    textAlign: "center",
  },
};
