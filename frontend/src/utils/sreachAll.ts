import { apiRequest } from "./apiRequest";
import { BACKEND_URL } from "./env";
import StorageUtil from "./storageUtil";
import { Product } from "../types/productType";

// URLs
const urlSearchId = `${BACKEND_URL}/products/`;
const urlSearchName = `${BACKEND_URL}/products/name/`;
const urlSearchCategory = `${BACKEND_URL}/products/category/`;
const urlSearchTag = `${BACKEND_URL}/products/tags/`;

// Token
const token = StorageUtil.getItem("token");

// Função para buscar produtos por ID, Nome, Categoria e Tag
const searchAll = async (search: string): Promise<Product[]> => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const resultsId: Product[] = [];
        const resultsName: Product[] = [];
        const resultsCategory: Product[] = [];
        const resultsTag: Product[] = [];

        // Busca por ID
        try {
            const responseId = await apiRequest<Product>({
                method: "GET",
                url: `${urlSearchId}${search}`,
                headers,
            });

            if (responseId.code === 200 && responseId.data) {
                resultsId.push(responseId.data);
            }
        }
        catch (error) {
            console.error("Error fetching product by ID:", error);
        }

        // Busca por Nome
        try {
            const responseName = await apiRequest<Product[]>({
                method: "GET",
                url: `${urlSearchName}${search}`,
                headers,
            });

            if (responseName.code === 200 && Array.isArray(responseName.data)) {
                resultsName.push(...responseName.data);
            }
        } catch (error) {
            console.error("Error fetching products by name:", error);
        }

        // Busca por Categoria
        try {
            const responseCategory = await apiRequest<Product[]>({
                method: "GET",
                url: `${urlSearchCategory}${search}`,
                headers,
            });

            if (responseCategory.code === 200 && Array.isArray(responseCategory.data)) {
                resultsCategory.push(...responseCategory.data);
            }
        } catch (error) {
            console.error("Error fetching products by category:", error);
        }

        // Busca por Tag
        try {
            const responseTag = await apiRequest<Product[]>({
                method: "GET",
                url: `${urlSearchTag}${search}`,
                headers,
            });

            if (responseTag.code === 200 && Array.isArray(responseTag.data)) {
                resultsTag.push(...responseTag.data);
            }
        } catch (error) {
            console.error("Error fetching products by tag:", error);
        }

        // Concatena os resultados com prioridade: ID > Nome > Categoria > Tag
        const combined = [
            ...resultsId,
            ...resultsName,
            ...resultsCategory,
            ...resultsTag,
        ];

        // Remove duplicados por ID
        const uniqueMap = new Map<number, Product>();
        for (const product of combined) {
            uniqueMap.set(Number(product.id ?? 0), product);
        }

        return Array.from(uniqueMap.values());
    } catch (error) {
        console.error("Error searching products:", error);
        return [];
    }
};

export default searchAll;
