import { useState, useEffect } from "react";
import { apiRequest } from "../utils/apiRequest";
import { BACKEND_URL } from "../utils/env";
import StorageUtil from "../utils/storageUtil";
import { Product, ProductRequest } from "../types/productType";
import {
    ImageIcon,
    TagIcon,
    PackageIcon,
    LayersIcon,
    SaveIcon,
    XIcon,
} from "lucide-react";

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
    const [img_link, setImgLink] = useState("");
    const [stock, setStock] = useState(0);
    const [categoryId, setCategoryId] = useState("");
    const [tagsId, setTagsId] = useState<number[]>([]);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [tags, setTags] = useState<{ id: number; name: string }[]>([]);

    const [imageMessage, setImageMessage] = useState<{
        type: "error" | "warning" | "success";
        text: string;
    } | null>(null);
    
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
            img_link,
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

    const validateImageLink = (url: string) => {
        const img = new Image();
        img.src = url;

        img.onload = () => {
            if (img.naturalWidth < 540 || img.naturalHeight < 540) {
                setImageMessage({
                    type: "warning",
                    text: "⚠️ A imagem deve ter pelo menos 540x540 pixels.",
                });
                setImgLink(""); // Limpa o link
            } else {
                setImageMessage({
                    type: "success",
                    text: "✅ Imagem válida!",
                });
            }
        };

        img.onerror = () => {
            setImageMessage({
                type: "error",
                text: "❌ Não foi possível carregar a imagem. Verifique o link.",
            });
            setImgLink("");
        };
    };
    
    useEffect(() => {
        fetchCategories();
        fetchTags();
    }, []);

    useEffect(() => {
        if (isOpen && product) {
            setName(product.name);
            setImgLink(product.img_link);
            setStock(product.stock);
            setCategoryId(product.category.id?.toString() ?? "");
            setTagsId(product.tags.map(tag => tag.id ?? 0));
        } else {
            setName("");
            setImgLink("");
            setStock(0);
            setCategoryId("");
            setTagsId([]);
        }
    }, [isOpen, product]);

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold text-center flex items-center justify-center gap-2">
                        <PackageIcon className="w-6 h-6" />
                        {product ? "Editar Produto" : "Novo Produto"}
                    </h2>

                    {img_link && (
                        <img
                            src={img_link}
                            alt="Pré-visualização"
                            className="w-32 h-32 mx-auto object-cover border rounded-lg"
                        />
                    )}

                    {imageMessage && (
                        <div
                            className={`
                                text-sm px-3 py-2 rounded-md border
                                ${imageMessage.type === "error" ? "bg-red-100 text-red-700 border-red-300" : ""}
                                ${imageMessage.type === "warning" ? "bg-yellow-100 text-yellow-800 border-yellow-300" : ""}
                                ${imageMessage.type === "success" ? "bg-green-100 text-green-700 border-green-300" : ""}
                            `}
                        >
                            {imageMessage.text}
                        </div>
                    )}

                    <div className="relative">
                        <ImageIcon className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Link da imagem (ex: https://...)"
                        value={img_link}
                        onChange={(e) => {
                            const url = e.target.value;
                            setImgLink(url);
                            if (url) validateImageLink(url);
                        }}
                        required
                    />
                    </div>

                    <div className="relative">
                        <PackageIcon className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nome do produto"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative">
                        <LayersIcon className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                        type="number"
                        className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Estoque"
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        min={0}
                        required
                    />
                    </div>

                    <select
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="flex items-center gap-1 border px-3 py-1.5 rounded-full text-sm cursor-pointer hover:bg-gray-50 transition"
                            >
                                <input
                                    type="checkbox"
                                    checked={tagsId.includes(tag.id)}
                                    onChange={(e) => {
                                    const checked = e.target.checked;
                                    setTagsId((prev) =>
                                        checked ? [...prev, tag.id] : prev.filter((id) => id !== tag.id)
                                    );
                                    }}
                                />
                                <TagIcon className="w-4 h-4 text-gray-500" />
                                    {tag.name}
                            </label>
                        ))}
                    </fieldset>

                    <div className="flex justify-between mt-4 gap-2">
                        <button
                            type="submit"
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            <SaveIcon className="w-4 h-4" />
                            {product ? "Salvar" : "Criar"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
                        >
                            <XIcon className="w-4 h-4" />
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductPopup;
