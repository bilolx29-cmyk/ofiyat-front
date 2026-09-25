import type { Product } from "../data/products";
import ProductCard from "./ProductCard";

type Props = {
    products: Product[];
    onAdd: (product: Product) => void;
};

export default function ProductGrid({
    products,
    onAdd,
}: Props) {
    return (
        <div className="products-grid">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={onAdd}
                />
            ))}
        </div>
    );
}