export default function Home(){
    return (
        <>
            <div style={styles.main}>
                <h2>Hello to my Ecommerce store!</h2>
            </div>
        </>
    )
}

const styles = {
    main: {
     //   textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "2rem"
    }
}