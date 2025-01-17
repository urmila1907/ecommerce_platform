import Navbar from "@/app/components/Navbar";

export default function Home() {
  return (
    <div>
      <main >
        <Navbar/>
        <h1 style={styles.tagline}>Welcome to my e-commerce store!</h1>
      </main>   
    </div>
  );
}

const styles = {
  tagline: {
    color: "#456",
    padding: "1rem",
    textAlign: "center",
  }
}