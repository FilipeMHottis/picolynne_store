import { useEffect, useState } from "react";
import { Customer } from "../types/customerType";
import { BACKEND_URL } from "../utils/env";
import { apiRequest } from "../utils/apiRequest";
import StorageUtil from "../utils/storageUtil";
import { X, Save } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
    existingcustomer: Customer | null;
}

function CustomerPopup({ open, onClose, existingcustomer }: Props) {
    const token = StorageUtil.getItem("token");
    const [formData, setFormData] = useState<Customer>({
        name: "",
        email: "",
        phone_number: "",
    });

    useEffect(() => {
        if (existingcustomer) {
            setFormData(existingcustomer);
        } else {
            setFormData({ name: "", email: "", phone_number: "" });
        }
    }, [existingcustomer]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (existingcustomer) {
                await apiRequest({
                    method: "PUT",
                    url: `${BACKEND_URL}/customers/${existingcustomer.id}`,
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                await apiRequest({
                    method: "POST",
                    url: `${BACKEND_URL}/customers`,
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            onClose();
        } catch (error) {
            console.error("Erro ao salvar cliente:", error);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
            <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-semibold mb-4">
                    {existingcustomer ? "Editar Cliente" : "Novo Cliente"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nome"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Telefone"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        <Save className="w-5 h-5" />
                        Salvar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CustomerPopup;
