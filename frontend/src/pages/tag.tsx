import { useEffect, useState } from "react";
import { apiRequest } from "../utils/apiRequest";
import { BACKEND_URL } from "../utils/env";
import StorageUtil from "../utils/storageUtil";
import Navegate from "../components/navegate";
import { Edit3, Trash2, PlusCircle } from "lucide-react";
import { Tag } from "../types/tagType";
import TagPopup from "../components/tagPopup"; // vamos criar depois

function Tags() {
    const token = StorageUtil.getItem("token");
    const URL = BACKEND_URL + "/tags";
    const [tags, setTags] = useState<Tag[]>([]);
    const [popupOpen, setPopupOpen] = useState(false);
    const [selectedTag, setSelectedTag] = useState<Tag | undefined>(undefined);

    const fetchTags = async () => {
        try {
            const response = await apiRequest<Tag[]>({
                method: "GET",
                url: URL,
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.code === 200 && Array.isArray(response.data)) {
                setTags(response.data);
            } else {
                setTags([]);
            }
        } catch (error) {
            console.error("Erro ao buscar tags:", error);
        }
    };

    const deleteTag = async (id: number) => {
        try {
            const response = await apiRequest({
                method: "DELETE",
                url: `${URL}/${id}`,
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.code === 200) {
                setTags(prev => prev.filter(tag => tag.id !== id));
            } else {
                console.error("Erro ao deletar tag:", response.message);
            }
        } catch (error) {
            console.error("Erro ao deletar tag:", error);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    return (
        <div className="
            flex flex-col 
            items-center 
            justify-center 
            min-h-screen
            bg-gray-100 
            overflow-auto 
            px-4 
            pb-18
            pt-[calc(1rem+env(safe-area-inset-top))]
        ">
            <Navegate />
            <TagPopup
                isOpen={popupOpen}
                onClose={() => setPopupOpen(false)}
                onSuccess={fetchTags}
                tag={selectedTag}
            />


            <h1 className="text-4xl font-bold mb-8 text-center">Tags</h1>

            <div className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Lista de Tags</h2>

                    <button
                        className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        onClick={() => {
                            setSelectedTag(undefined);
                            setPopupOpen(true);
                        }}
                        title="Criar nova tag"
                    >
                        <PlusCircle className="mr-2" />
                        Criar Tag
                    </button>
                </div>

                {tags.length === 0 ? (
                    <p className="text-gray-500 text-center">Nenhuma tag encontrada.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tags.map(tag => (
                            <div
                                key={tag.id}
                                className="bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition-shadow flex flex-col justify-between"
                            >
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    🏷️ {tag.name}
                                </h3>

                                <div className="mt-4 flex justify-end space-x-2">
                                    <button
                                        className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                        title="Editar tag"
                                        onClick={() => {
                                            setSelectedTag(tag);
                                            setPopupOpen(true);
                                        }}
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={() => tag.id !== undefined && deleteTag(tag.id)}
                                        className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                        title="Deletar tag"
                                    >
                                        <Trash2 className="w-4 h-4" />
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

export default Tags;
