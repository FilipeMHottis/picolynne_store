import { useState, useEffect } from "react";
import { Customer } from "../types/customerType";
import { BACKEND_URL } from "../utils/env";
import { apiRequest } from "../utils/apiRequest";
import StorageUtil from "../utils/storageUtil";
import CustomerPopup from "./customerPopup";
import { Pencil, Plus } from "lucide-react";

function CustomersPanel() {
    const token = StorageUtil.getItem("token");
    const [customers, setcustomers] = useState<Customer[]>([]);
    const [selectedcustomer, setSelectedcustomer] = useState<Customer | null>(null);
    const [popupOpen, setPopupOpen] = useState(false);

    const fetchcustomers = async () => {
        try {
            const response = await apiRequest<Customer[]>({
                method: "GET",
                url: `${BACKEND_URL}/customers`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setcustomers(response.data);
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
        }
    };

    useEffect(() => {
        fetchcustomers();
    }, []);

    const handleEdit = (customer: Customer) => {
        setSelectedcustomer(customer);
        setPopupOpen(true);
    };

    const handleCreate = () => {
        setSelectedcustomer(null);
        setPopupOpen(true);
    };

    const handlePopupClose = () => {
        setPopupOpen(false);
        fetchcustomers();
    };

    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">👥 Clientes Cadastrados</h2>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    Novo Cliente
                </button>
            </div>

            <ul className="divide-y divide-gray-200">
                {customers.map((c) => (
                    <li key={c.id} className="py-3 flex justify-between items-center">
                        <div>
                            <p className="font-medium">{c.name}</p>
                            <p className="text-sm text-gray-500">{c.email} • {c.phone_number}</p>
                        </div>
                        <button
                            onClick={() => handleEdit(c)}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                    </li>
                ))}
            </ul>

            <CustomerPopup
                open={popupOpen}
                onClose={handlePopupClose}
                existingcustomer={selectedcustomer}
            />
        </div>
    );
}

export default CustomersPanel;
