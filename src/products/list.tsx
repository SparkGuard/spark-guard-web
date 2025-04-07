import { useList } from "@refinedev/core";

export const ListProducts = () => {
    const { data, isLoading } = useList({ resource: "products" });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Products</h1>
            <ul>
                {data?.data?.map((product) => (
                    <li key={product.id}>
                        <p>
                            {product.name}
                            <br />
                            Price: {product.price}
                            <br />
                            Material: {product.material}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};