import { Sale, SaleItemForCreate } from "../types/saleType";
import { Product } from "../types/productType";
import CartItemCard from "./cartItemCard";
import CartFooter from "./cartFooter";
import { Customer } from "../types/customerType";

interface CartPanelProps {
    preview: Sale | null;
    selectedItems: SaleItemForCreate[];
    products: Product[];
    handleRemoveFromCart: (productId: string) => void;
    handleQuantityChange: (productId: string, quantity: number) => void;
    setCustomerId: (customerId: string) => void;
    customerList: Customer[];
    customerId: string;
    onClickBuy: () => void;
}


function CartPanelPc({
    preview,
    selectedItems,
    products,
    handleRemoveFromCart,
    handleQuantityChange,
    setCustomerId,
    customerList,
    customerId,
    onClickBuy
}: CartPanelProps) {
    return (
        <aside className="hidden sm:flex fixed top-0 right-0 w-80 h-full bg-white border-l border-gray-200 shadow-2xl z-50 flex-col rounded-l-2xl overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {preview && Array.isArray(preview.items) && preview.items.length > 0 ? (
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
                    <p className="text-sm text-gray-500">Nenhum item selecionado.</p>
                )}
            </div>

            {/* Rodapé */}
            <CartFooter 
                preview={preview}
                setCustomerId={setCustomerId}
                customerList={customerList}
                customerId={customerId}
                onClickBuy={onClickBuy}
            />
        </aside>
    );
}

export default CartPanelPc;
