import { Category } from "./categoryType";
import { Tag } from "./tagType";

interface Product {
    id?: string;
    name: string;
    img_link: string;
    stock: number;
    category: Category;
    tags: Tag[];
}

interface ProductRequest {
    name: string;
    img_link: string;
    stock: number;
    category_id: number;
    tags_id: number[];
}

export type { Product, ProductRequest };
