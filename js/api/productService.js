const SERVER_URL = 'https://githubusercontent.com';
const LOCAL_URL = './data/products.json';

/**
 * Получить json продуктов
 * @returns {string} Строка json продуктов.
 */
export async function fetchRawProducts() {
    try {
        const response = await fetch(SERVER_URL);

        if (!response.ok)
             throw new Error(`Ошибка сервера: ${response.status}`);
        
        return await response.json();
    } catch (error) {
        console.warn('Сервер недоступен, загружаем локальный products.json:', error.message);
        
        const localResponse = await fetch(LOCAL_URL);
        return await localResponse.json();
    }
}