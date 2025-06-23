import { Sale, SaleItemForCreate } from "../types/saleType";
import { Product } from "../types/productType";
import { Trash2 } from "lucide-react";

interface CartPanelProps {
    preview: Sale | null;
    selectedItems: SaleItemForCreate[];
    products: Product[];
    handleRemoveFromCart: (productId: string) => void;
    handleQuantityChange: (productId: string, quantity: number) => void;
}


function CardPanelPc({
    preview,
    selectedItems,
    products,
    handleRemoveFromCart,
    handleQuantityChange,
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
                            //  Renderiza cada item do preview
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
                    })
                ) : (
                    <p className="text-sm text-gray-500">Nenhum item selecionado.</p>
                )}
            </div>

            {/* Rodapé */}
            <div className="border-t p-4 bg-white">
            <div className="flex justify-between items-center text-lg font-bold mb-1 text-gray-800">
                <span>Total:</span>
                <span>R$ {preview ? preview.total_price.toFixed(2) : "0,00"}</span>
            </div>

            <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>Total de itens:</span>
                <span>{preview?.total_quantity ?? 0}</span>
            </div>

            <button
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-xl transition font-semibold shadow-sm"
                onClick={() => alert("Ir para pagamento")}
                disabled={!preview || !preview.items.length}
            >
                Ir para o pagamento
            </button>
            </div>
        </aside>
    );
}

export default CardPanelPc;
