import { store } from '../../js/state/store.js';
import { ProductCategory } from '../../js/constants/productCategory.js';
import { buildDynamicImageHtml } from '../../js/utils/imageHelper.js';

let currentCategory = ProductCategory.COFFEE;       // Глобальное состояние каталога
let displayMultiplier = 1;                          // Множитель отображаемых товаров (1 порция = 2 строки товаров для текущего экрана)


/**
 * Создать карточку товара.
 * 
 * @param {object} product - Данные товара.
 * @returns {HTMLElement} - Карточка товара.
 */
function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'catalog__card';
    card.dataset.id = product.id;

    // Массив расширений для поиска существующего файла
    const extensions = ['jpg', 'png', 'webp', 'svg', 'jpeg'];

    card.innerHTML = `
        <div class="catalog__card--image">
            ${buildDynamicImageHtml(product.image, product.name, 'catalog__card--pic')}
        </div>
        <div class="catalog__card--content">
            <h3 class="catalog__card--title">${product.name}</h3>
            <p class="catalog__card--description">${product.description}</p>
            <h3 class="catalog__card--price">\$${product.price.toFixed(2)}</h3>
        </div>
    `;
    return card;
}


/**
 * Рассчитать, сколько товаров помещается в 2 строки на основе текущей ширины экрана.
 * 
 * @returns {number} Количество элементов в одной порции (2 строки).
 */
function getPortionSizeByScreenWidth() {
    const width = window.innerWidth;
    if (width > 1200) return 8;
    if (width > 768) return 6;
    if (width > 480) return 4;
    return 2;
}


/**
 * Отобразить товары выбранной категории с учетом текущего лимита строк.
 */
function renderProducts() {
    const container = document.querySelector('.catalog__products');
    const refreshBtn = document.querySelector('.catalog__refresh-btn');

    if (!container || !refreshBtn) return;

    const allCategoryProducts = getProductsByCategory(currentCategory);
    const portionSize = getPortionSizeByScreenWidth();
    const currentLimit = portionSize * displayMultiplier;

    let productsToRender = allCategoryProducts;

    if (allCategoryProducts.length > currentLimit) {
        productsToRender = allCategoryProducts.slice(0, currentLimit);
        refreshBtn.classList.remove('visually-hidden');
    } else {
        refreshBtn.classList.add('visually-hidden');
    }

    const cards = productsToRender.map(createProductCard);
    container.replaceChildren(...cards);
}


/**
 * Получить товары категории из глобального хранилища store.
 *
 * @param {string} category - Категория товаров (из ProductCategory).
 * @returns {Product[]} Отфильтрованные доменные модели товаров.
 */
function getProductsByCategory(category) {
    return store.products.filter(
        product => product.category === category
            && !product.isFavorite
            && product.isAvailable
    );
}

/**
 * Инициализировать каталог.
 */
export function initCatalog() {
    const buttons = document.querySelectorAll('.catalog__btn-category');
    const refreshBtn = document.querySelector('.catalog__refresh-btn');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const buttonCategory = button.dataset.category;
            currentCategory = ProductCategory[buttonCategory.toUpperCase()]
                || buttonCategory;

            displayMultiplier = 1;

            renderProducts();

            buttons.forEach(item => {
                item.classList.toggle('catalog__btn-category-active', item === button);
            });
        });
    });

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            displayMultiplier++;
            renderProducts();
        });
    }

    window.addEventListener('resize', () => {
        renderProducts();
    });

    renderProducts();
}
