import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { BACKEND_URL } from "../utils/env";
import { apiRequest } from "../utils/apiRequest";
import StorageUtil from "../utils/storageUtil";
import { Product } from '../types/productType';
import { Category } from '../types/categoryType';
import { Tag } from '../types/tagType';

interface Props {
    handleSearch: (query: string) => void;
    setSearch: (query: string) => void;
    search: string;
}

type SuggestionItem = { original: string; normalized: string };

function SearchBar({ handleSearch, setSearch, search }: Props) {
    const token = StorageUtil.getItem("token");
    const [allTags, setAllTags] = useState<SuggestionItem[]>([]);
    const [allCategories, setAllCategories] = useState<SuggestionItem[]>([]);
    const [allProducts, setAllProducts] = useState<SuggestionItem[]>([]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch(search.trim());
        }
    };

    const normalize = (text: string) =>
        text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const searchAll = async () => {
        const headers = { Authorization: `Bearer ${token}` };

        try {
            const [tagsRes, categoriesRes, productsRes] = await Promise.all([
                apiRequest<Tag[]>({
                    method: "GET",
                    url: `${BACKEND_URL}/tags`,
                    headers,
                }),
                apiRequest<Category[]>({
                    method: "GET",
                    url: `${BACKEND_URL}/categories`,
                    headers,
                }),
                apiRequest<Product[]>({
                    method: "GET",
                    url: `${BACKEND_URL}/products`,
                    headers,
                }),
            ]);

            setAllTags(tagsRes.data?.map(tag => ({
                original: tag.name,
                normalized: normalize(tag.name),
            })) || []);

            setAllCategories(categoriesRes.data?.map(cat => ({
                original: cat.name,
                normalized: normalize(cat.name),
            })) || []);

            setAllProducts(productsRes.data?.map(prod => ({
                original: prod.name,
                normalized: normalize(prod.name),
            })) || []);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        }
    };

    useEffect(() => {
        searchAll();
    }, []);

    const filteredTags = allTags.filter(tag =>
        tag.normalized.includes(normalize(search))
    );

    const filteredCategories = allCategories.filter(cat =>
        cat.normalized.includes(normalize(search))
    );

    const filteredProducts = allProducts.filter(prod =>
        prod.normalized.includes(normalize(search))
    );

    const handleClick = (value: string) => {
        setSearch(value);
        handleSearch(value);
    };

    return (
        <div className="w-full max-w-md mt-8 flex flex-col relative">
            {/* Input */}
            <div className="flex w-full">
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Buscar produto por ID, nome, categoria ou tag..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                    onClick={() => handleSearch(search.trim())}
                    className="ml-2 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                    <Search className="inline" />
                </button>
            </div>

            {/* Sugestões */}
            {search.trim() &&
                (filteredProducts.length > 0 ||
                    filteredTags.length > 0 ||
                    filteredCategories.length > 0) && (
                    <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-md z-10 max-h-60 overflow-y-auto">
                        {filteredProducts.length > 0 && (
                            <div>
                                <p className="px-4 pt-3 pb-1 text-sm font-semibold text-gray-600">📦 Produtos</p>
                                {filteredProducts.map((item, i) => (
                                    <div
                                        key={`prod-${i}`}
                                        onClick={() => handleClick(item.original)}
                                        className="px-4 py-2 hover:bg-yellow-100 cursor-pointer"
                                    >
                                        {item.original}
                                    </div>
                                ))}
                            </div>
                        )}

                        {filteredTags.length > 0 && (
                            <div>
                                <p className="px-4 pt-3 pb-1 text-sm font-semibold text-gray-600">🏷️ Tags</p>
                                {filteredTags.map((name, i) => (
                                    <div
                                        key={`tag-${i}`}
                                        onClick={() => handleClick(name.original)}
                                        className="px-4 py-2 hover:bg-yellow-100 cursor-pointer"
                                    >
                                        {name.original}
                                    </div>
                                ))}
                            </div>
                        )}

                        {filteredCategories.length > 0 && (
                            <div>
                                <p className="px-4 pt-3 pb-1 text-sm font-semibold text-gray-600">📂 Categorias</p>
                                {filteredCategories.map((name, i) => (
                                    <div
                                        key={`cat-${i}`}
                                        onClick={() => handleClick(name.original)}
                                        className="px-4 py-2 hover:bg-yellow-100 cursor-pointer"
                                    >
                                        {name.original}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
        </div>
    );
}

export default SearchBar;
