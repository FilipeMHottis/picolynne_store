import { Product } from "../types/productType";

interface Props {
    product: Product;
}

function ProductCard({ product }: Props) {
    return (
        <div className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-2 w-full max-w-sm">
            <img
                src={product.img_link}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md"
            />
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-600">
                Categoria: {product.category.name} — R$ {product.category.price.toFixed(2)}
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
                {product.tags.map(tag => (
                    <span
                    key={tag.id}
                    className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full text-xs"
                    >
                    {tag.name}
                    </span>
                ))}
            </div>
            <p className="text-sm text-gray-700">Estoque: {product.stock}</p>
        </div>
    );
}

export default ProductCard;
