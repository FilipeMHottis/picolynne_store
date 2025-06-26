import CartItemCard from "./cartItemCard";
import CartFooter from "./cartFooter";
import { Sale, SaleItemForCreate } from "../types/saleType";
import { Product } from "../types/productType";
import { useEffect } from "react";

interface CartPanelProps {
    preview: Sale | null;
    selectedItems: SaleItemForCreate[];
    products: Product[];
    handleRemoveFromCart: (productId: string) => void;
    handleQuantityChange: (productId: string, quantity: number) => void;
    onClose: () => void;
}

function CartPanelMobile({
    preview,
    selectedItems,
    products,
    handleRemoveFromCart,
    handleQuantityChange,
    onClose
}: CartPanelProps) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = "auto"; };
    }, []);

    return (
        <div
            className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex justify-center items-end sm:hidden"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            {/* Para evitar fechar ao clicar dentro do popup */}
            <div
                className="w-full max-h-[80%] bg-white rounded-t-3xl overflow-y-auto p-4 space-y-2"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Botão fechar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold"
                    aria-label="Fechar carrinho"
                >
                    &times;
                </button>

                {/* Lista de itens */}
                {preview && preview.items.length > 0 ? (
                    preview.items.map(item => {
                        // Encontra a quantidade do item selecionado ou usa 1 como padrão
                        const quantity = selectedItems.find(p => p.product_id === item.product_id)?.quantity || 1;
                        
                        // Encontra o item no preview e obtém a quantidade total
                        const quantityItem = preview.total_quantity ??  0;
                        const productItem = products.find(p => p.id === item.product_id);
                        const category = productItem?.category;
                        let price = 0

                        // Define o preço com base na quantidade
                        if (quantityItem > 20 && quantityItem < 50) {
                            price = category?.price_above_20_units ?? item?.price ?? 0;
                        } else if (quantityItem >= 50) {
                            price = category?.price_above_50_units ?? item?.price ?? 0;
                        } else {
                            price = item?.price ?? 0;
                        }

                    return (
                        <CartItemCard
                            key={item.product_id}
                            item={item}
                            product={productItem}
                            quantity={quantity}
                            totalQuantity={preview.total_quantity ?? 0}
                            price={price}
                            handleRemoveFromCart={handleRemoveFromCart}
                            handleQuantityChange={handleQuantityChange}
                        />
                    );
                    })
                ) : (
                    <p className="text-center text-gray-500 mt-10">Nenhum item selecionado.</p>
                )}

                {/* Rodapé */}
                <CartFooter
                    preview={preview}
                />
            </div>
        </div>
    );
}

export default CartPanelMobile;
