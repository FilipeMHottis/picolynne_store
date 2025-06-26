import { Trash2 } from "lucide-react";
import { Product } from "../types/productType";
import { SaleType } from "../types/saleType";

interface CartItemCardProps {
    item: SaleType;
    product: Product | undefined;
    quantity: number;
    totalQuantity: number;
    price: number;
    handleRemoveFromCart: (productId: string) => void;
    handleQuantityChange: (productId: string, quantity: number) => void;
}

function CartItemCard({
    item,
    quantity,
    price,
    handleRemoveFromCart,
    handleQuantityChange,
}: CartItemCardProps) {
    return (
        <div
            key={item.product_id}
            className="bg-gray-50 p-3 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-2"
        >
            <div className="flex justify-between items-center text-sm font-medium text-gray-700">
                <span className="truncate">{item.product_name}</span>
                <button
                onClick={() => handleRemoveFromCart(item.product_id)}
                className="text-red-500 hover:text-red-700 transition"
                title="Remover item"
                >
                <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-2 text-sm">
                <label className="text-gray-500">Qtd:</label>
                <input
                type="number"
                className="w-16 border rounded-md px-2 py-1 text-gray-800 text-sm focus:ring focus:outline-none"
                min={1}
                value={quantity}
                onChange={(e) =>
                    handleQuantityChange(item.product_id, Number(e.target.value) || 1)
                }
            />
                <span className="ml-auto font-semibold text-blue-600">
                R$ {price.toFixed(2)}
                </span>
            </div>
        </div>
    );
}

export default CartItemCard;
