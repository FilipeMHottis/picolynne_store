import { apiRequest } from "../utils/apiRequest";
import { BACKEND_URL } from "../utils/env";
import { useState, useEffect } from "react";
import StorageUtil from "../utils/storageUtil";
import { Category } from "../types/categoryType";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    category?: Category; // undefined = criação, definido = edição
}

const isCategory = (data: any): data is Category => {
    const isTrue = (
        typeof data === 'object' &&
        data !== null &&
        (!('id' in data) || typeof data.id === 'number') && // ID é opcional
        'name' in data && typeof data.name === 'string' &&
        'price' in data && typeof data.price === 'number' &&
        'price_above_20_units' in data && typeof data.price_above_20_units === 'number' &&
        'price_above_50_units' in data && typeof data.price_above_50_units === 'number'
    );

    return isTrue;
}

// parametro opcial do tipo Category
function CategoryPopup({ isOpen, onClose, onSuccess, category }: Props) {
    const token = StorageUtil.getItem("token");
    const URL = BACKEND_URL + "/categories";
    
    // Definição de estados
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [priceAbove20, setPriceAbove20] = useState(0);
    const [priceAbove50, setPriceAbove50] = useState(0);

    // Efeito para carregar os dados da categoria se estiver em modo de edição
    useEffect(() => {
        if (isOpen && category) {
            setName(category.name);
            setPrice(category.price);
            setPriceAbove20(category.price_above_20_units);
            setPriceAbove50(category.price_above_50_units);
        } else {
            // Limpar os campos se não estiver em modo de edição
            setName("");
            setPrice(0);
            setPriceAbove20(0);
            setPriceAbove50(0);
        }
    }
    , [isOpen, category]);


    // Função para lidar com o envio do formulário
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const categoryData: Omit<Category, 'id'> = {
            name,
            price,
            price_above_20_units: priceAbove20,
            price_above_50_units: priceAbove50
        };

        if (!isCategory(categoryData)) {
            console.error("Dados da categoria inválidos");
            return;
        }

        try {
            const method = category ? "PUT" : "POST";
            const endpoint = category ? `${URL}/${category.id}` : URL;

            const response = await apiRequest<Category>({
                method,
                url: endpoint,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: categoryData,
            });

            const isSuccess = category ? response.code === 200 : response.code === 201;
            if (isSuccess) {
                onSuccess();
                onClose();
            } else {
                console.error("Erro ao salvar a categoria:", response.message);
            }
        } catch (error) {
            console.error("Erro ao fazer a requisição:", error);
        }
    }
    
    // Renderizar o popup ou nao
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">
                {category ? "✏️ Atualizar Categoria" : "➕ Criar Nova Categoria"}
            </h2>

            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">📦 Nome</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Ex: Gourmet"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">💰 Preço base</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(parseFloat(e.target.value))}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Ex: 3.50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">📦 +20 unidades</label>
                    <input
                        type="number"
                        value={priceAbove20}
                        onChange={(e) => setPriceAbove20(parseFloat(e.target.value))}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Ex: 3.20"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">📦 +50 unidades</label>
                    <input
                        type="number"
                        value={priceAbove50}
                        onChange={(e) => setPriceAbove50(parseFloat(e.target.value))}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Ex: 2.90"
                    />
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        {category ? "💾 Atualizar" : "✅ Criar Categoria"}
                    </button>
                    
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        ❌ Cancelar
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CategoryPopup;
