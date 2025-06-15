import { apiRequest } from "../utils/apiRequest";
import { BACKEND_URL } from "../utils/env";
import { useState, useEffect } from "react";
import StorageUtil from "../utils/storageUtil";
import Navegate from "../components/navegate";
import { Edit3, Trash2, PlusCircle } from "lucide-react";


interface Response<T> {
    code: number;
    message: string;
    data: T;
}

interface Category {
    id: number;
    name: string;
    price: number;
    price_above_20_units: number;
    price_above_50_units: number;
}

const isCategory = (data: any): data is Category => {
    return (
        typeof data === 'object' &&
        data !== null &&
        'id' in data && typeof data.id === 'number' &&
        'name' in data && typeof data.name === 'string' &&
        'price' in data && typeof data.price === 'number' &&
        'price_above_20_units' in data && typeof data.price_above_20_units === 'number' &&
        'price_above_50_units' in data && typeof data.price_above_50_units === 'number'
    );
}

function Categories() {
    // Toeken para autenticação
    const token = StorageUtil.getItem("token");
    const URL = BACKEND_URL + "/categories";
    const [categories, setCategories] = useState<Category[]>([]);
    
    // Pegar todas as categorias
    const fetchCategories = async () => {
        try {
            const response = await apiRequest<Response<Category[]>>({
                method: "GET",
                url: URL,
                headers: {
                    "Authorization": `Bearer ${token}`,
                },              
            });

            if (response.code === 200 && Array.isArray(response.data)) {
                setCategories(response.data);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }   
    }

    // Criar uma categoria
    const createCategory = async (category: Omit<Category, 'id'>) => {        
        try {
            const response = await apiRequest<Response<Category>>({
                method: "POST",
                url: URL,
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: category,
            });

            if (response.code === 201 && isCategory(response.data)) {
                const data = response.data as Category;
                setCategories(prevCategories => [...prevCategories, data]);
            } else {
                console.error("Erro ao criar categoria:", response.message);
            }
        } catch (error) {
            console.error("Erro ao criar categoria:", error);
        }
    }

    // Atualizar uma categoria
    const updateCategory = async (id: number, category: Partial<Omit<Category, 'id'>>) => {
        try {
            const response = await apiRequest<Response<Category>>({
                method: "PUT",
                url: `${URL}/${id}`,
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: category,
            });

            if (response.code === 200 && isCategory(response.data)) {
                const updatedCategory = response.data as Category;
                setCategories(prevCategories =>
                    prevCategories.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat)
                );
            } else {
                console.error("Erro ao atualizar categoria:", response.message);
            }
        } catch (error) {
            console.error("Erro ao atualizar categoria:", error);
        }
    }

    // Deletar uma categoria
    const deleteCategory = async (id: number) => {
        try {
            const response = await apiRequest<Response<null>>({
                method: "DELETE",
                url: `${URL}/${id}`,
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.code === 200) {
                setCategories(prevCategories => prevCategories.filter(cat => cat.id !== id));
            } else {
                console.error("Erro ao deletar categoria:", response.message);
            }
        } catch (error) {
            console.error("Erro ao deletar categoria:", error);
        }
    }

    // Efeito colateral para buscar categorias ao montar o componente
    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <Navegate />

            <h1 className="text-4xl font-bold mb-8 text-center">Categorias</h1>

            <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Lista de Categorias</h2>

                    <button
                        onClick={() => createCategory({ name: "Nova Categoria", price: 0, price_above_20_units: 0, price_above_50_units: 0 })}
                        className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        title="Criar nova categoria"
                    >
                        <PlusCircle className="mr-2" />
                        Criar Categoria
                    </button>
                </div>

                {categories.length === 0 ? (
                    <p className="text-gray-500 text-center">Nenhuma categoria encontrada.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map(category => (
                            <div 
                                key={category.id} 
                                className="bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition-shadow flex flex-col justify-between"
                            >
                                <h3 
                                    className="text-xl font-bold mb-2 flex items-center gap-2"
                                >
                                    📦 {category.name}
                                </h3>
                                
                                <p className="text-gray-700">💰 Preço: R$ {category.price.toFixed(2)}</p>
                                <p className="text-gray-700">📦 +20 und: R$ {category.price_above_20_units.toFixed(2)}</p>
                                <p className="text-gray-700">📦 +50 und: R$ {category.price_above_50_units.toFixed(2)}</p>

                                <div className="mt-4 flex justify-end space-x-2">
                                    <button
                                        onClick={() => updateCategory(category.id, { 
                                                name: "Atualizado " + category.name,
                                                price: category.price,
                                                price_above_20_units: category.price_above_20_units,
                                                price_above_50_units: category.price_above_50_units
                                            })}
                                        className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                        title="Editar categoria"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={() => deleteCategory(category.id)}
                                        className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                        title="Deletar categoria"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Categories;
