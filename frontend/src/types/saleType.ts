interface CustomerSale {
    id: string;
    name: string;
}

interface SaleType {
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
}

interface SaleItemForCreate {
    product_id: string;
    quantity: number;
}

interface Sale {
    id: string;
    customer: CustomerSale;
    items: SaleType[];
    total_quantity: number;
    total_price: number;
}

interface SaleCreate {
    customer_id: string;
    items: SaleItemForCreate[];
}

export type { 
    Sale,
    SaleItemForCreate,
    SaleCreate,
    CustomerSale,
    SaleType,
 };