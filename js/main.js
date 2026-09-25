import { fetchRawProducts } from './api/productService.js';
import { mapJsonToProducts } from './utils/productMapper.js';
import { store } from './state/store.js';
import { initCatalog } from '../components/catalog/catalog.js';
// import { initModal } from './ui/modal.js';


/**
 * Главная функция инициализации данных приложения.
 */
async function initApplication() {
    try {
        const rawData = await fetchRawProducts();
        store.products = mapJsonToProducts(rawData);

        initCatalog();
        // initModal();
    } catch (error) {
        console.error('Критическая ошибка инициализации приложения:', error);
    }
}

document.addEventListener('components:loaded', initApplication);