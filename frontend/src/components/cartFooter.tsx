import { Sale } from "../types/saleType";

function CartFooter({ preview }: { preview: Sale | null }) {
    return (
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
    );
}

export default CartFooter;
