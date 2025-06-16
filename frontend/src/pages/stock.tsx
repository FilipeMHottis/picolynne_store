import { apiRequest } from "../utils/apiRequest";
import { BACKEND_URL } from "../utils/env";
import { useState, useEffect } from "react";
import StorageUtil from "../utils/storageUtil";
import Navegate from "../components/navegate";
import { Product } from "../types/productType";
import { PlusCircle } from "lucide-react";
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

            <h1 className="text-4xl font-bold mb-8 text-center">Stock</h1>

            <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">

                    <h2 className="text-2xl font-semibold">Lista de Produtos</h2>

                    <button
                            className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            onClick={() => {
                                setSelectedProduct(undefined);
                                setPopupOpen(true);
                            }}
                            title="Criar novo produto"
                        >
                            <PlusCircle className="mr-2" />
                            Criar novo produto
                    </button>
                </div>

                { products.length === 0 ? (
                    <p className="text-gray-500 mt-4">Nenhum produto encontrado.</p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="border rounded-lg p-4 shadow hover:shadow-md transition bg-gray-50 flex flex-col justify-between"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>

                                    <p className="text-sm"><strong>Estoque:</strong> {product.stock}</p>
                                    <p className="text-sm">
                                        <strong>Categoria:</strong> {product.category.name}
                                    </p>

                                    {product.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {product.tags.map(tag => (
                                                <span
                                                    key={tag.id}
                                                    className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full"
                                                >
                                                    {tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setPopupOpen(true);
                                        }}
                                        className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id ?? "")}
                                        className="text-sm bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                                    >
                                        Apagar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )

};

export default Stock;
