import { Sale } from "../types/saleType";
import { Customer } from "../types/customerType";

interface Props {
    preview: Sale | null;
    customerId: string;
    setCustomerId: (customerId: string) => void;
    customerList: Customer[];
    onClickBuy: () => void;
}

function CartFooter({ 
    preview, 
    setCustomerId,
    customerList,
    customerId,
    onClickBuy
}: Props) {
    const handleCustomerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCustomerId = event.target.value;
        setCustomerId(selectedCustomerId);
    };

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

            <div className="mb-4">
                <label htmlFor="customer-select" className="block mb-2 text-sm font-medium text-gray-700">
                    Cliente:
                </label>
                <select
                    id="customer-select"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    onChange={handleCustomerChange}
                    value={customerId}
                >
                    {customerList.map(customer => (
                        <option key={customer.id} value={customer.id}>
                            {customer.name}
                        </option>
                    ))}
                </select>
            </div>

            <button
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-xl transition font-semibold shadow-sm"
                onClick={() => onClickBuy()}
                disabled={!preview || !preview.items.length}
            >
                Ir para o pagamento
            </button>
        </div>
    );
}

export default CartFooter;
