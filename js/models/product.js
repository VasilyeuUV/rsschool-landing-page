import { ProductCategory } from '../constants/productCategory.js';

/**
 * Класс для продуктов.
 */
export class Product {

    /**
     * CTOR.
     * @param {object} data - данные продукта. 
     */
    constructor(data) {
        this.id = data.id;
        this.category = data.category;
        this.name = data.name;
        this.description = data.description || '';
        this.price = Number(data.price || 0);
        this.image = data.image;
        this.isFavorite = data.isFavorite ?? false;
        this.sizes = data.sizes || [];
        this.additives = data.additives || [];
    }

    /** Проверка доступности товара. */
    get isAvailable() {
        return this.category === ProductCategory.ADDITIVE
         || this.sizes.length > 0; 
    }
}