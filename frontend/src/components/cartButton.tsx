import { ShoppingCart } from "lucide-react";
import { Sale } from "../types/saleType";

interface CartButtonProps {
    onClick: () => void;
    preview: Sale | null;
}

function CartButton({ onClick, preview }: CartButtonProps) {
    return (
        <button
            className="flex flex-col items-center fixed top-4 right-4 bg-yellow-400 hover:bg-yellow-500 text-white p-3 rounded-full shadow-xl sm:hidden z-50"
            onClick={onClick}
            aria-label="Abrir carrinho"
        >
            <ShoppingCart className="w-6 h-6" />
            <span 
                className="text-xs mt-1 font-medium text-white text-center"
            >
                R$ {preview ? preview.total_price.toFixed(2) : "0,00"}
            </span>
        </button>
    );
}

export default CartButton;
