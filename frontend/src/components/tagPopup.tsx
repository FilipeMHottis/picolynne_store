import { useState, useEffect } from "react";
import { apiRequest } from "../utils/apiRequest";
import { BACKEND_URL } from "../utils/env";
import StorageUtil from "../utils/storageUtil";
import { Tag } from "../types/tagType";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tag?: Tag; // undefined = criação, definido = edição
}

const isTag = (data: any): data is Tag => {
  const isValid =
    typeof data === "object" &&
    data !== null &&
    (!("id" in data) || typeof data.id === "number") &&
    "name" in data &&
    typeof data.name === "string";

  return isValid;
};

function TagPopup({ isOpen, onClose, onSuccess, tag }: Props) {
  const token = StorageUtil.getItem("token");
  const URL = BACKEND_URL + "/tags";

  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen && tag) {
      setName(tag.name);
    } else {
      setName("");
    }
  }, [isOpen, tag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagData: Omit<Tag, "id"> = { name };

    if (!isTag(tagData)) {
      console.error("Dados da tag inválidos");
      return;
    }

    try {
      const method = tag ? "PUT" : "POST";
      const endpoint = tag ? `${URL}/${tag.id}` : URL;

      const response = await apiRequest<Tag>({
        method,
        url: endpoint,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: tagData,
      });

      const isSuccess = tag ? response.code === 200 : response.code === 201;
      if (isSuccess) {
        onSuccess();
      } else {
        console.error("Erro ao salvar tag:", response.message);
      }
    } catch (error) {
      console.error("Erro ao salvar tag:", error);
    }

    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {tag ? "✏️ Atualizar Tag" : "➕ Criar Nova Tag"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">🏷️ Nome da Tag</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Ex: Sem Lactose"
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              {tag ? "💾 Atualizar" : "✅ Criar Tag"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              ❌ Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TagPopup;
