import { useEffect, useState } from "react";
import StorageUtil from "../utils/storageUtil";
import { apiRequest } from "../utils/apiRequest";
import { BACKEND_URL } from "../utils/env";
import { Sale } from "../types/saleType";
import { ShoppingCartIcon, UserIcon, CalendarIcon, ListIcon } from "lucide-react";

function SaleHistory() {
    const token = StorageUtil.getItem("token");

    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSales = async () => {
        try {
            const response = await apiRequest<Sale[]>({
                url: `${BACKEND_URL}/sales`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.code === 200 && Array.isArray(response.data)) {
                setSales(response.data);
            } else {
                console.error("Falha ao buscar vendas:", response.message);
            }
        } catch (error) {
            console.error("Erro ao buscar vendas:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteSale = async (saleId: string) => {
        if (!window.confirm("Tem certeza que deseja apagar esta venda?")) return;

        try {
            const response = await apiRequest({
                url: `${BACKEND_URL}/sales/${saleId}`,
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.code === 200) {
                setSales((prevSales) => prevSales.filter(sale => sale.id !== saleId));
            } else {
                console.error("Falha ao apagar venda:", response.message);
            }
        } catch (error) {
            console.error("Erro ao apagar venda:", error);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 mt-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-600">
                <ShoppingCartIcon className="w-6 h-6" />
                Histórico de Vendas
            </h2>

            {loading ? (
                <div className="text-center text-gray-500">Carregando vendas...</div>
            ) : sales.length > 0 ? (
                <ul className="space-y-6">
                    {sales.map(sale => (
                        <li
                            key={sale.id}
                            className="p-4 border rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition-all"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-lg font-semibold text-gray-800">
                                    Venda #{sale.id}
                                </span>
                                <button
                                    onClick={() => deleteSale(sale.id)}
                                    className="text-red-600 hover:text-red-800 text-sm"
                                >
                                    Apagar
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-700 mb-4 gap-1">
                                <div className="flex items-center gap-2">
                                    <UserIcon className="w-4 h-4 text-gray-500" />
                                    Cliente: <span className="font-medium">{sale.customer?.name ?? "Desconhecido"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                                    Data: <span className="font-medium">Não disponível</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <ListIcon className="w-4 h-4" />
                                    <span className="font-semibold">Itens comprados:</span>
                                </div>
                                <ul className="ml-4 list-disc space-y-1 text-gray-800 text-sm">
                                    {sale.items.map(item => (
                                        <li key={item.product_id}>
                                            {item.product_name ?? "Produto desconhecido"} — {item.quantity}x @ R$ {item.price.toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex justify-between text-sm font-medium text-gray-800 mt-2 border-t pt-2">
                                <span>Total de itens: {sale.total_quantity}</span>
                                <span>Total pago: R$ {sale.total_price.toFixed(2)}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center text-gray-500">Nenhuma venda encontrada.</div>
            )}
        </div>
    );
}

export default SaleHistory;
