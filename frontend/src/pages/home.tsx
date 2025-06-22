import Navegate from "../components/navegate";
import LoginPopup from "../components/loginPopup";
import searchAll from "../utils/sreachAll";
import { Product } from "../types/productType";
import { BACKEND_URL } from "../utils/env";
import { apiRequest } from "../utils/apiRequest";
import StorageUtil from "../utils/storageUtil";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import SearchBar from "../components/searchbar";

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
        <div className="flex flex-col items-center min-h-screen bg-gray-100 px-4 pb-20 pt-6">
            <LoginPopup />
            <Navegate />
            <SearchBar
                handleSearch={handleSearch}
                setSearch={setSearch}
                search={search}
            />

            {loading ? (
                <p className="mt-8 text-gray-600">Buscando produtos...</p>
            ) : products.length > 0 ? (
            <div className="grid gap-4 mt-8 grid-cols-1 sm:grid-cols-2">
                {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
            </div>
            ) : (
            <p className="mt-8 text-gray-600">Nenhum produto encontrado.</p>
            )}
        </div>
    );
}

export default Home;
