import { useOne } from "@refinedev/core";

export const ShowProduct = () => {
    const {data, isLoading} = useOne({resource: "products", id: 13});

    if (isLoading) {
        return <div>Loading...</div>;
    }
    return <div>{data?.data.name}</div>;
}