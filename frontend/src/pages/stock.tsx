import { apiRequest } from "../utils/apiRequest";
import { BACKEND_URL } from "../utils/env";
import { useState, useEffect } from "react";
import StorageUtil from "../utils/storageUtil";
import Navegate from "../components/navegate";
import { Product } from "../types/productType";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import ProductPopup from "../components/productPopup";
import SearchBar from "../components/searchbar";
import searchAll from "../utils/searchAll";
import UniversalPopup from "../components/universalPopup";

const Stock = () => {
    const token = StorageUtil.getItem("token");
    const URL = BACKEND_URL + "/products";
    
    const [products, setProducts] = useState<Product[]>([]);
    const [popupTitle, setPopupTitle] = useState("");
    const [popupMessage, setPopupMessage] = useState("");
    const [popupConfirmAction, setPopupConfirmAction] = useState<(() => void) | null>(null);
    const [popupDoubleButton, setPopupDoubleButton] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [productPopupOpen, setProductPopupOpen] = useState(false); // Para ProductPopup
    const [universalPopupOpen, setUniversalPopupOpen] = useState(false); // Para UniversalPopup

    const handleSearch = async (query?: string) => {
        const value = query ?? search;

        if (!value.trim()) {
            fetchProducts();
            return;
        }

        setLoading(true);
        const result = await searchAll(value.trim());
        setProducts(result);
        setLoading(false);
    };

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

    function showPopup({ title, message, onConfirm, doubleButton = false }: { title: string, message: string, onConfirm?: () => void, doubleButton?: boolean }) {
        setPopupTitle(title);
        setPopupMessage(message);
        setPopupConfirmAction(() => onConfirm || null);
        setPopupDoubleButton(doubleButton);
        setUniversalPopupOpen(true);
    }

    const handleDelete = (id: string) => {
        showPopup({
            title: "Apagar produto",
            message: "Tem certeza que deseja apagar este produto?",
            doubleButton: true,
            onConfirm: async () => {
                setUniversalPopupOpen(false);
            
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
                        showPopup({
                            title: "Erro",
                            message: response.message || "Erro ao deletar produto.",
                        });
                    }
                } catch (error) {
                    showPopup({
                        title: "Erro",
                        message: "Erro ao deletar produto.",
                    });
                }
            },
        });
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
                isOpen={productPopupOpen}
                onClose={() => setProductPopupOpen(false)}
                onSuccess={() => {
                    setProductPopupOpen(false);
                    fetchProducts();
                }}
                product={selectedProduct}
            />

            <UniversalPopup
                open={universalPopupOpen}
                title={popupTitle}
                message={popupMessage}
                onClose={() => setUniversalPopupOpen(false)}
                onConfirm={popupConfirmAction || (() => setUniversalPopupOpen(false))}
                onCancel={() => setUniversalPopupOpen(false)}
                doubleButtonMode={popupDoubleButton}
                confirmText="Confirmar"
                cancelText="Cancelar"
                singleButtonText="OK"
            />

            <div className="w-full flex flex-col items-center mb-8 sm:mt-16">
                <div className="w-full max-w-xl bg-white rounded-xl shadow-md border border-gray-200 p-4">
                    <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Estoque</h1>
                    <SearchBar
                        handleSearch={handleSearch}
                        setSearch={setSearch}
                        search={search}
                    />
                </div>
            </div>

            <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-700">Lista de Produtos</h2>

                    <button
                        className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        onClick={() => {
                        setSelectedProduct(undefined);
                        setProductPopupOpen(true);
                    }}
                    >
                        <PlusCircle className="mr-2 w-5 h-5" />
                        Criar novo produto
                    </button>
                </div>

                { !loading && products.length === 0 ? (
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
                                                    className="bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full text-xs"
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
                                            setProductPopupOpen(true);
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
