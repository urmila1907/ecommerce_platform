export default function Home() {
  return (
    <div>
      <main style={styles.main}>
        <h1 style={styles.tagline}>Welcome to my e-commerce store!</h1>
      </main>
    </div>
  );
}

const styles = {
  main: {
    scrollBehavior: "smooth", 
    minHeight: "100vh",
    paddingBottom: "4rem",
  },
  tagline: {
    color: "#456",
    padding: "1rem",
    textAlign: "center",
  },
};
