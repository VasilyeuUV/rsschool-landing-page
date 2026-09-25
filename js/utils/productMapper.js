import { Product } from '../models/product.js';
import { ProductAdditive } from '../models/productAdditive.js';
import { Size } from '../models/size.js';
import { ProductCategory } from '../constants/productCategory.js';

const addPrice = 'add-price';   // - обозначение надбавки.

/**
 * Получить объекты Product из json.
 * @param {Array} jsonArray - JSON.
 * @returns {Product[]} Массив объектов.
 */
export function mapJsonToProducts(jsonArray) {
    const additivesRegistry = createAdditivesRegistry(jsonArray);
    const categoryCounters = {
        [ProductCategory.COFFEE]: 0,
        [ProductCategory.TEA]: 0,
        [ProductCategory.DESSERTS]: 0
    };
    const parsedProducts = jsonArray.map((item) => {
        const cleanCategory = getProductCategory(item.category);

        if (categoryCounters[cleanCategory] !== undefined) {
            categoryCounters[cleanCategory]++;
        } else {
            categoryCounters[cleanCategory] = 1;
        }

        const currentLocalIndex = categoryCounters[cleanCategory];
        const generatedId = `${cleanCategory}-${currentLocalIndex}`;
        const data = {
            id: generatedId,
            category: cleanCategory,
            name: item.name.trim(),
            description: item.description.trim(),
            price: Number(item.price),
            image: `./assets/img/${cleanCategory}/${generatedId}`,
            isFavorite: false,
            sizes: parseSizes(item.sizes),
            additives: parseProductAdditives(item.additives, additivesRegistry)
        }

        return new Product(data);
    });

    const allAdditives = Object.values(additivesRegistry);
    return [...parsedProducts, ...allAdditives];
}


/**
 * Получить константу категории продукта.
 * 
 * @param {string} rawCategory - строка категории продукта. 
 * @returns - Константа категории продукта.
 */
function getProductCategory(rawCategory) {
    const clean = rawCategory
        .trim()
        .toLowerCase();

    if (clean === 'dessert'
        || clean === 'desserts') {
        return ProductCategory.DESSERTS;
    }

    if (clean === 'tea'
        || clean === 'teas') {
        return ProductCategory.TEA;
    }

    if (clean === 'coffee'
        || clean === 'coffees') {
        return ProductCategory.COFFEE;
    }

    return clean;
}


/**
 * Собрать уникальные добавки и определить максимальную цену для каждой.
 * 
 * @param {string[]} jsonArray - json-массив продуктов.  
 * @returns {Product[]} Массив уникальных дополнительных продуктов.  
 */
function createAdditivesRegistry(jsonArray) {
    const registry = {};

    jsonArray.forEach(item => {
        if (!Array.isArray(item.additives)) return;

        item.additives.forEach(add => {
            const rawName = add.name.trim();
            const key = rawName.toLowerCase();
            const currentJsonPrice = Number(add[addPrice] || 0);

            if (!registry[key]) {
                const data = {
                    id: `add-${key}`,
                    category: ProductCategory.ADDITIVE,
                    name: rawName,
                    price: currentJsonPrice,
                    sizes: [],
                    additives: []
                }
                registry[key] = new Product(data);
            } else {
                registry[key].price = Math.max(registry[key].price, currentJsonPrice);
            }
        });
    });

    return registry;
}


/**
 * Парсинг размеров.
 * @param {string} rawSizes - Строка с размерами. 
 * @returns - Массив объектов размеров товаров.
 */
function parseSizes(rawSizes) {
    const sizes = [];

    if (!rawSizes)
        return sizes;

    Object.entries(rawSizes).forEach(([key, data]) => {
        const [value, unit] = data.size.trim().split(' ');
        sizes.push(new Size(key, Number(value), unit || '', Number(data[addPrice] || 0)));
    });
    return sizes;
}


/**
 * ВычВычислить скидку (addPrice) на основе максимальной базовой цены.
 * 
 * @param {*} rawAdditives 
 * @param {*} additivesRegistry 
 * @returns 
 */
function parseProductAdditives(rawAdditives, additivesRegistry) {
    const additives = [];
    if (!Array.isArray(rawAdditives)) return additives;

    rawAdditives.forEach(add => {
        const addKey = add.name.trim().toLowerCase();
        const baseAdditiveProduct = additivesRegistry[addKey];

        if (baseAdditiveProduct) {
            const currentJsonPrice = Number(add[addPrice] || 0);
            const calculatedAddPrice = currentJsonPrice - baseAdditiveProduct.price;

            additives.push(new ProductAdditive(baseAdditiveProduct, calculatedAddPrice));
        }
    });

    return additives;
}