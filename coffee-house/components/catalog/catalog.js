import { products } from '../../data/products.js';

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
            <img
                class="catalog__card--pic"
                src="${product.image}"
                alt="${product.name}"
            >
        </div>

        <div class="catalog__card--content">
            <h3 class="catalog__card--title">
                ${product.name}
            </h3>

            <p class="catalog__card--description">
                ${product.description}
            </p>

            <h3 class="catalog__card--price">
                ${product.price}
            </h3>
        </div>
    `;

    return card;
}


/**
 * Отобразить товары выбранной категории.
 * 
 * @param {object[]} categoryProducts - Массив продуктов в категории.
 */
function renderProducts(categoryProducts) {
    const container = document.querySelector(
        '.catalog__products'
    );

    if (!container) {
        return;
    }

    const cards = categoryProducts.map(createProductCard);

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
        product =>
            product.category === category
            && !product.isFavorite
    );
}


/**
 * Инициализировать каталог.
 */
function initCatalog() {
    const buttons = document.querySelectorAll(
        '.catalog__category'
    );

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;

            renderProducts(
                getProductsByCategory(category)
            );

            buttons.forEach(item => {
                item.classList.toggle(
                    'catalog__category-active',
                    item === button
                );
            });
        });
    });

    renderProducts(
        getProductsByCategory('coffee')
    );
}

initCatalog();