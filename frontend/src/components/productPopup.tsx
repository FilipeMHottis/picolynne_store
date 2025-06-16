import { useState, useEffect } from "react";
import { apiRequest } from "../utils/apiRequest";
import { BACKEND_URL } from "../utils/env";
import StorageUtil from "../utils/storageUtil";
import { Product, ProductRequest } from "../types/productType";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    product?: Product; // undefined = criação, definido = edição
}

function ProductPopup({ isOpen, onClose, onSuccess, product }: Props) {
    const token = StorageUtil.getItem("token");
    const URL = BACKEND_URL + "/products";

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState(0);
    const [categoryId, setCategoryId] = useState("");
    const [tagsId, setTagsId] = useState<number[]>([]);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [tags, setTags] = useState<{ id: number; name: string }[]>([]);

    
    const fetchCategories = async () => {
        try {
            const response = await apiRequest<{ id: string; name: string }[]>({
                method: "GET",
                url: BACKEND_URL + "/categories",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            setCategories(response.code === 200 ? response.data : []);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await apiRequest<{ id: number; name: string }[]>({
                method: "GET",
                url: BACKEND_URL + "/tags",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setTags(response.code === 200 ? response.data : []);
        } catch (error) {
            console.error("Erro ao buscar tags:", error);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const productData: ProductRequest = {
            name,
            description,
            stock,
            category_id: Number(categoryId),
            tags_id: tagsId,
        };
        
        try {
            const method = product ? "PUT" : "POST";
            const endpoint = product ? `${URL}/${product.id}` : URL;

            const response = await apiRequest<Product>({
                method,
                url: endpoint,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: productData,
            });

            const isSuccess = product ? response.code === 200 : response.code === 201;
            if (isSuccess) {
                onSuccess();
            } else {
                console.error("Erro ao salvar produto:", response.message);
            }
        } catch (error) {
            console.error("Erro ao salvar produto:", error);
        }
        
        onClose();
    };
    
    useEffect(() => {
        fetchCategories();
        fetchTags();
    }, []);

    useEffect(() => {
        if (isOpen && product) {
            setName(product.name);
            setDescription(product.description);
            setStock(product.stock);
            setCategoryId(product.category.id?.toString() ?? "");
            setTagsId(product.tags.map(tag => tag.id ?? 0));
        } else {
            setName("");
            setDescription("");
            setStock(0);
            setCategoryId("");
            setTagsId([]);
        }
    }, [isOpen, product]);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <h2 className="text-xl font-bold text-center mb-2">
                        {product ? "Editar Produto" : "Novo Produto"}
                    </h2>

                    <input
                        type="text"
                        className="border rounded-lg px-4 py-2"
                        placeholder="Nome do produto"
                        value={name}
                        onChange={(e) => setName(e.target.value)}

                        required
                    />

                    <textarea
                        className="border rounded-lg px-4 py-2"
                        placeholder="Descrição"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />

                    <input
                        type="number"
                        className="border rounded-lg px-4 py-2"
                        placeholder="Estoque"
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        min={0}
                        required
                    />

                    <select
                        className="border rounded-lg px-4 py-2"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    >
                        <option value="">Selecione uma categoria</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <fieldset className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <label
                                key={tag.id}
                                className="flex items-center gap-1 border px-2 py-1 rounded-full text-sm cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={tagsId.includes(tag.id)}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setTagsId((prev) =>
                                            checked
                                                ? [...prev, tag.id]
                                                : prev.filter((id) => id !== tag.id)
                                        );
                                    }}
                                />
                                {tag.name}
                            </label>
                        ))}
                    </fieldset>

                    <div className="flex justify-between mt-4">
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                        >
                            {product ? "Salvar Alterações" : "Criar Produto"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductPopup;
