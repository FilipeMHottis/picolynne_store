import { apiRequest } from "../utils/apiRequest";
import { BACKEND_URL } from "../utils/env";
import StorageUtil from "../utils/storageUtil";
import Navegate from "../components/navegate";

interface Category {
    id: number;
    name: string;
}

function Categories() {
    // Toeken para autenticação
    const token = StorageUtil.getItem("token");
    const URL = BACKEND_URL + "/categories";
    
    // Pegar todas as categorias
    const fetchCategories = async () => {
        try {
            const response = await apiRequest<Category[]>({
                method: "GET",
                url: URL,
                headers: {
                    "Authorization": `Bearer ${token}`,
                },              
            });
            console.log("Categorias:", response);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }   
    }

    // Chamar a função para buscar as categorias
    fetchCategories();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <Navegate />

            <h1 className="text-4xl font-bold mb-8">Categorias</h1>
        </div>
    );
}

export default Categories;
