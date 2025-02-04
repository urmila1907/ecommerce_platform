import "../styles/page.css";

export default async function Products(){
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/product`,{
            method: "GET",
            credentials: "include"
        });
        if (!res.ok) {
            return <div style={styles.error}>Failed to fetch products</div>;
        }
        const data = await res.json();
        const products = data.products || [];

        if (products.length === 0) {
            return <div className="noProducts">No products available</div>;
        }
        return (
            <div>
                <div className="products">
                    {products.map((product) => (
                        <div key={product._id} className="product">
                            <h3 className="productName">{product.productName}</h3>
                            <h4 className="productDescription">{product.description}</h4>
                            <h5 className="productPrice">Price: ₹{product.price}</h5>
                            <h5 className="productQuantity">Available: {product.quantity}</h5>
                        </div>
                    ))}
                </div>
            </div>
        );
    }catch (err) {
        console.error('Error fetching products:', err);
        return <div className="error">Server error while fetching products</div>;
    }
}