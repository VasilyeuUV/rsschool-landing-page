import { products } from '../../data/products.js';

let currentCategory = 'coffee';         // Глобальное состояние каталога
let displayMultiplier = 1;              // Множитель порций (1 порция = 2 строки товаров для текущего экрана)

/**
 * Создать карточку товара.
 * 
 * @param {object} product - Данные товара.
 * @returns {HTMLElement} - Карточка товара.
 */
function createProductCard(product) {
    const card = document.createElement('article');
    card.className = 'catalog__card';
    card.innerHTML = `
        <div class="catalog__card--image">
            <img class="catalog__card--pic" src="${product.image}" alt="${product.name}">
        </div>
        <div class="catalog__card--content">
            <h3 class="catalog__card--title">${product.name}</h3>
            <p class="catalog__card--description">${product.description}</p>
            <h3 class="catalog__card--price">${product.price}</h3>
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
 * Получить товары категории.
 *
 * @param {string} category - Категория товаров.
 * @returns {object[]} Товары категории.
 */
function getProductsByCategory(category) {
    return products.filter(
        product => product.category === category
            && !product.isFavorite
    );
}

/**
 * Инициализировать каталог.
 */
function initCatalog() {
    const buttons = document.querySelectorAll('.catalog__btn-category');
    const refreshBtn = document.querySelector('.catalog__refresh-btn');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            currentCategory = button.dataset.category;
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

initCatalog();
