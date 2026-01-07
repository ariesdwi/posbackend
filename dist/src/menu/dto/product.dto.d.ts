import { ProductStatus } from '@prisma/client';
export declare class CreateProductDto {
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: string;
    imageUrl?: string;
    status?: ProductStatus;
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    categoryId?: string;
    imageUrl?: string;
    status?: ProductStatus;
}
export declare class UpdateStockDto {
    stock: number;
}
