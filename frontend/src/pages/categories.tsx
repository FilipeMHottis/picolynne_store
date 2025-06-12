import { apiRequest } from "../utils/apiRequest";
import { BACKEND_URL } from "../utils/env";
import { useState, useEffect } from "react";
import StorageUtil from "../utils/storageUtil";
import Navegate from "../components/navegate";

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

            <h1 className="text-4xl font-bold mb-8">Categorias</h1>

            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">

                    <h2 className="text-2xl font-semibold mb-4">Lista de Categorias</h2>

                    {/* add botao ao lado de lista de categorias, botao para com escritop criar nova categoria */}
                    <button
                        onClick={() => createCategory({ 
                            name: "Nova Categoria", 
                            price: 0, 
                            price_above_20_units: 0, 
                            price_above_50_units: 0 
                        })}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-yellow-400 transition-colors"
                    >
                        Criar Categoria
                    </button>
                </div>



                { categories.length === 0 ? (
                    <p className="text-gray-500">Nenhuma categoria encontrada.</p>
                ) : 
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-200">
                                <th>Nome</th>
                                <th>Preço</th>
                                <th>Preço acima de 20 unidades</th>
                                <th>Preço acima de 50 unidades</th>
                                <th>Atualizar</th>
                                <th>Deletar</th>
                            </tr>
                        </thead>

                        <tbody className="">
                            {categories.map((category) => (
                                <tr key={category.id} className="border-b hover:bg-gray-100">
                                    <td className="px-4 py-2">{category.name}</td>
                                    <td className="px-4 py-2">{category.price.toFixed(2)}</td>
                                    <td className="px-4 py-2">{category.price_above_20_units.toFixed(2)}</td>
                                    <td className="px-4 py-2">{category.price_above_50_units.toFixed(2)}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => updateCategory(category.id, { 
                                                name: "Atualizado " + category.name,
                                                price: category.price,
                                                price_above_20_units: category.price_above_20_units,
                                                price_above_50_units: category.price_above_50_units
                                            })}
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                        >
                                            Atualizar
                                        </button>
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => deleteCategory(category.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                        >
                                            Deletar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
            </div>

        </div>
    );
}

export default Categories;
