import { Product } from "../types/productType";
import { ShoppingCart } from "lucide-react";

interface Props {
    product: Product;
    onBuy?: (product: Product) => void;
}

function ProductCard({ product, onBuy }: Props) {
    return (
        <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between w-full max-w-sm">
            {/* Conteúdo principal */}
            <div>
                <img
                    src={product.img_link}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                />

                {/* Nome */}
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>

                {/* Preço e categoria com destaque */}
                <div className="flex items-center justify-between mb-2">
                    <span className="text-green-600 font-bold text-base">
                        R$ {product.category.price.toFixed(2)}
                    </span>
                    <span className="text-sm bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        {product.category.name}
                    </span>
                </div>

                {/* Tags */}
                {product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {product.tags.map((tag) => (
                            <span
                                key={tag.id}
                                className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full text-xs"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Estoque por último */}
                <p className="text-xs text-gray-500">
                    Estoque: {product.stock}
                </p>
            </div>

            {/* Botão de comprar */}
            <button
                onClick={() => onBuy?.(product)}
                className="mt-4 w-full flex justify-center items-center gap-2 bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-green-700 transition"
            >
                <ShoppingCart className="w-4 h-4" />
                Adicionar ao carrinho
            </button>
        </div>
    );
}

export default ProductCard;
