export default async function Order(){
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/order`,{
                            method: "GET",
                            credentials: "include"
                        }
                    );
    if (!res.ok) {
        const errorText = await res.text();
        console.error("Error fetching orders:", errorText);
        return <div>Failed to fetch order details: {errorText}</div>;
    }
                    
    const orders = await res.json();
    console.log(orders);
    if(orders.length == 0) {
        return <div>Do some shopping!</div>;
    }
    return (
        <>
            {orders.map((order)=>(
                <div key={order.id}>
                    <h3>{order.product}</h3>
                    <h4>{order.totalCost}</h4>
                    <h4>{order.quantity}</h4>
                    <h4>{order.status}</h4>
                    <h4>{order.createdAt}</h4>
                </div>
            ))}
        </>
    )
}