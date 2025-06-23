import Navegate from "../components/navegate";
import LoginPopup from "../components/loginPopup";
import searchAll from "../utils/searchAll";
import { Product } from "../types/productType";
import { BACKEND_URL } from "../utils/env";
import { apiRequest } from "../utils/apiRequest";
import StorageUtil from "../utils/storageUtil";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import SearchBar from "../components/searchbar";
import { ShoppingCart, PackageSearch, Boxes } from "lucide-react";

function Home() {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        try {
            const headers = {
                Authorization: `Bearer ${StorageUtil.getItem("token")}`,
            };
            const response = await apiRequest<Product[]>({
                method: "GET",
                url: `${BACKEND_URL}/products`,
                headers,
            });
            if (response.code === 200 && Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                console.error("Failed to fetch products:", response.message);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 px-4 pb-20 pt-[calc(1rem+env(safe-area-inset-top))]">
            <LoginPopup />
            <Navegate />

            {/* Conteúdo principal */}
            <main className="w-full max-w-7xl flex flex-col sm:flex-row sm:mr-80">

                {/* Coluna da esquerda com barra de pesquisa + produtos */}
                <section className="flex-1 flex flex-col">

                    {/* SearchBar agora centralizada com o conteúdo */}
                    <div className="w-full flex flex-col items-center mb-8 sm:mt-16">
                        <div className="w-full max-w-xl bg-white rounded-xl shadow-md border border-gray-200 p-4">
                            <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Vendas</h1>
                            <SearchBar
                                handleSearch={handleSearch}
                                setSearch={setSearch}
                                search={search}
                                />
                        </div>
                    </div>

                    {/* Box dos produtos com destaque visual */}
                    <div className="bg-white shadow-xl rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4 text-gray-800">
                            <Boxes className="w-5 h-5" />
                            <h2 className="text-xl font-semibold">Produtos disponíveis</h2>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {loading ? (
                                <div className="col-span-full flex items-center gap-2 text-gray-600">
                                    <PackageSearch className="w-5 h-5 animate-pulse" />
                                    <p>Buscando produtos...</p>
                                </div>
                            ) : products.length > 0 ? (
                                products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))
                            ) : (
                                <p className="text-gray-500 mt-4 text-center col-span-full">
                                    Nenhum produto encontrado.
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Painel lateral do carrinho */}
                <aside className="hidden sm:flex fixed top-0 right-0 w-80 h-full bg-white border-l border-gray-300 shadow-xl z-50 flex-col">
                    <div className="p-4 border-b flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        <h2 className="text-xl font-bold">Carrinho</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        <div className="flex justify-between items-center text-sm border-b pb-2">
                            <span>Produto A x2</span>
                            <span className="font-medium">R$ 10,00</span>
                        </div>
                        <p className="text-sm text-gray-500">Nenhum item selecionado.</p>
                    </div>

                    <div className="border-t p-4 bg-white">
                        <div className="flex justify-between items-center text-lg font-bold mb-4">
                            <span>Total:</span>
                            <span>R$ 0,00</span>
                        </div>
                        <button
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition"
                            onClick={() => alert("Ir para pagamento")}
                        >
                            Ir para o pagamento
                        </button>
                    </div>
                </aside>
            </main>
        </div>
    );
}

export default Home;
