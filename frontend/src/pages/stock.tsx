import { apiRequest } from "../utils/apiRequest";
import { BACKEND_URL } from "../utils/env";
import { useState, useEffect } from "react";
import StorageUtil from "../utils/storageUtil";
import Navegate from "../components/navegate";
import { Product } from "../types/productType";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import ProductPopup from "../components/productPopup";

const Stock = () => {
    const token = StorageUtil.getItem("token");
    const URL = BACKEND_URL + "/products";
    const [products, setProducts] = useState<Product[]>([]);
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

    const fetchProducts = async () => {
        try {
            const response = await apiRequest<Product[]>({
                method: "GET",
                url: URL,
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.code === 200 && Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    }

    const handleDelete = async (id: string) => {
        const confirm = window.confirm("Tem certeza que deseja apagar este produto?");
        if (!confirm) return;

        try {
            const response = await apiRequest({
                method: "DELETE",
                url: `${URL}/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.code === 200) {
                fetchProducts();
            } else {
                console.error("Erro ao deletar produto:", response.message);
            }
        } catch (error) {
            console.error("Erro ao deletar produto:", error);
        }
    };

    
    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div
            className="
                flex flex-col 
                items-center 
                justify-center 
                min-h-screen
                bg-gray-100 
                overflow-auto 
                px-4 
                pb-18
                pt-[calc(1rem+env(safe-area-inset-top))]
            "
        >

            <Navegate />
            <ProductPopup
                isOpen={popupOpen}
                onClose={() => setPopupOpen(false)}
                onSuccess={() => {
                    setPopupOpen(false);
                    fetchProducts();
                }}
                product={selectedProduct}
            />

            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Estoque</h1>

            <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700">Lista de Produtos</h2>

                    <button
                        className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        onClick={() => {
                        setSelectedProduct(undefined);
                        setPopupOpen(true);
                    }}
                    >
                        <PlusCircle className="mr-2 w-5 h-5" />
                        Criar novo produto
                    </button>
                </div>

                {products.length === 0 ? (
                    <p className="text-gray-500 mt-4 text-center">Nenhum produto encontrado.</p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between"
                            >
                                <div>
                                    <img
                                        src={product.img_link}
                                        alt={product.name}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />

                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>

                                    <p className="text-sm text-gray-600">
                                        <strong>Estoque:</strong> {product.stock}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Categoria:</strong> {product.category.name}
                                    </p>

                                    {product.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {product.tags.map((tag) => (
                                                <span
                                                    key={tag.id}
                                                    className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full"
                                                >
                                                    {tag.name}
                                                 </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between mt-5">
                                    <button
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setPopupOpen(true);
                                        }}
                                        className="flex items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Editar
                                    </button>

                                    <button
                                        onClick={() => handleDelete(product.id ?? "")}
                                        className="flex items-center gap-1 text-sm bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Apagar
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

export default Stock;
