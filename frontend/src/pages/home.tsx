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
import { PackageSearch, Boxes } from "lucide-react";
import { Sale, SaleCreate, SaleItemForCreate } from "../types/saleType";
import CartPanelPc from "../components/cartPanelPc";
import CartPanelMobile from "../components/cartPanelMobile";
import CartButton from "../components/cartButton";
import { Customer } from "../types/customerType";
import UniversalPopup from "../components/universalPopup";

function Home() {
    const token = StorageUtil.getItem("token");
    
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState<SaleItemForCreate[]>([]);
    const [preview, setPreview] = useState<Sale | null>(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [customerId, setCustomerId] = useState<string>("1");
    const [customerList, setCustomerList] = useState<Customer[]>([]);
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [popupMessage, setPopupMessage] = useState("");
    const [popupAction, setPopupAction] = useState<(() => void) | null>(null);

    const fetchCustomers = async () => {
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const response = await apiRequest<Customer[]>({
                method: "GET",
                url: `${BACKEND_URL}/customers`,
                headers,
            });
            if (response.code === 200 && Array.isArray(response.data)) {
                setCustomerList(response.data);
            } else {
                console.error("Failed to fetch customers:", response.message);
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    const handleRemoveFromCart = (productId: string) => {
        const updatedItems = selectedItems.filter(item => item.product_id !== productId);
        setSelectedItems(updatedItems);
        updatePreview(updatedItems);
    };

    const handleQuantityChange = (productId: string, quantity: number) => {
        const updatedItems = selectedItems.map(item =>
            item.product_id === productId ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
        );
        setSelectedItems(updatedItems);
        updatePreview(updatedItems);
    };

    const updatePreview = async (items: SaleItemForCreate[]) => {
        try {
            const headers = {
                Authorization:  `Bearer ${token}`,
            };

            const body: SaleCreate = {
                customer_id: customerId, 
                items,
            };

            const response = await apiRequest<Sale>({
                method: "POST",
                url: `${BACKEND_URL}/sales/preview`,
                body,
                headers,
            });

            if (response.code === 200 && response.data) {
                setPreview(response.data);
            } else {
                console.error("Erro ao gerar preview:", response.message);
            }
        } catch (error) {
            console.error("Erro ao atualizar preview:", error);
        }
    };

    const handleAddToCart = (productId: string) => {
        const updatedItems = [...selectedItems];
        const existing = updatedItems.find(item => item.product_id === productId);

        if (existing) {
            existing.quantity += 1;
        } else {
            updatedItems.push({ product_id: productId, quantity: 1 });
        }

        setSelectedItems(updatedItems);
        updatePreview(updatedItems);
    };

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

    const onClickBuy = async () => {
        let message = "Carrinho vazio";
        let title = "Adicione produtos ao carrinho antes de finalizar a compra.";

        if (!preview || !preview.items.length) {
            showPopup({
                title,
                message,
            });
            return;
        }

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            const body: SaleCreate = {
                customer_id: customerId,
                items: selectedItems,
            };

            const response = await apiRequest<Sale>({
                method: "POST",
                url: `${BACKEND_URL}/sales`,
                body,
                headers,
            });

            if (response.code === 201 && response.data) {
                setSelectedItems([]);
                setPreview(null);
                setCartOpen(false);
                fetchProducts();

                title = "Compra finalizada com sucesso!";
                message = "Venda realizada com sucesso!";
            } else {
                title = "Erro ao finalizar compra";
                message = response.message || "Ocorreu um erro ao processar a venda.";
            }
        } catch (error) {
            message = "Ocorreu um erro ao processar a venda: " + (error instanceof Error ? error.message : "Erro desconhecido");
            console.error("Erro ao finalizar compra:", error);
        } finally {
            showPopup({
                title,
                message,
                action: () => {
                    if (title.includes("sucesso")) {
                        fetchCustomers();
                    }
                },
            });
        }
    };

    function showPopup({ title, message, action }: { title: string, message: string, action?: () => void }) {
        setPopupTitle(title);
        setPopupMessage(message);
        setPopupAction(() => action || null);
        setPopupOpen(true);
    }

    useEffect(() => {
        fetchProducts();
        fetchCustomers();
    }, []);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 px-4 pb-20 pt-[calc(1rem+env(safe-area-inset-top))]">
            <LoginPopup />
            <Navegate />
            <UniversalPopup
                open={popupOpen}
                title={popupTitle}
                message={popupMessage}
                onClose={() => {
                    setPopupOpen(false);
                    if (popupAction) popupAction();
                }}
            />

            {/* Conteúdo principal */}
            <main className="w-full max-w-8xl flex flex-col md:flex-row pr-0 md:pr-80 transition-all duration-300">

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

                        <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
                            {loading ? (
                                <div className="col-span-full flex items-center gap-2 text-gray-600">
                                    <PackageSearch className="w-5 h-5 animate-pulse" />
                                    <p>Buscando produtos...</p>
                                </div>
                            ) : products.length > 0 ? (
                                products.map(product => (
                                    <ProductCard 
                                        key={product.id ?? ""} 
                                        product={product} 
                                        onBuy={() => handleAddToCart(product.id ?? "")} 
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500 mt-4 text-center col-span-full">
                                    Nenhum produto encontrado.
                                </p>
                            )}
                        </div>

                        {/* Cart Panel */}
                        <CartButton
                            preview={preview}
                            onClick={() => setCartOpen(!cartOpen)}
                        />

                        { cartOpen && (
                            <CartPanelMobile
                                preview={preview}
                                selectedItems={selectedItems}
                                products={products}
                                handleRemoveFromCart={handleRemoveFromCart}
                                handleQuantityChange={handleQuantityChange}
                                onClose={() => setCartOpen(false)}
                                customerList={customerList}
                                setCustomerId={setCustomerId}
                                customerId={customerId}
                                onClickBuy={onClickBuy}
                            />
                        )}

                        {/* Painel do carrinho para desktop */}
                        <CartPanelPc
                            preview={preview}
                            selectedItems={selectedItems}
                            products={products}
                            handleRemoveFromCart={handleRemoveFromCart}
                            handleQuantityChange={handleQuantityChange}
                            customerList={customerList}
                            setCustomerId={setCustomerId}
                            customerId={customerId}
                            onClickBuy={onClickBuy}
                        />
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Home;
