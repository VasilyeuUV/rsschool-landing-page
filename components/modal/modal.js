import { store } from '../../js/state/store.js';
import { calculateOrderPrice } from '../../js/services/orderService.js';

// Текущий выбор пользователя в открытой модалке
let currentSize = null;       // Сюда запишется объект класса Size
let currentAdditives = [];    // Массив выбранных объектов ProductAdditive


/**
 * Инициализация слушателей модального окна.
 */
export function initModal() {
    const catalogContainer = document.querySelector('.catalog__products');
    const overlay = document.querySelector('.modal__overlay');

    if (!catalogContainer || !overlay) return;

    catalogContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.catalog__card');
        if (!card) return;

        const productId = card.dataset.id;
        const product = store.products.find(p => p.id === productId);

        if (product && product.isAvailable) {
            openModal(product);
        }
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
}


/**
 * Открытие модального окна с заполнением данных.
 * 
 * @param {Product} product - 
 */
function openModal(product) {
    // Собираем всё необходимое состояние для старта модалки
    store.currentProduct = product;
    currentSize = product.sizes.find(s => s.addPrice === 0) || product.sizes[0];
    currentAdditives = [];

    const windowContainer = document.querySelector('.modal__window');
    const overlay = document.querySelector('.modal__overlay');

    // Наполняем контентом, собирая HTML по частям
    windowContainer.innerHTML = buildModalLayoutHtml(product);

    // Подключаем интерактивность и базовые кнопки управления
    windowContainer.querySelector('.modal__close').addEventListener('click', closeModal);
    setupModalInteractive(windowContainer, product);

    // Синхронизируем цену и плавно отображаем на экране
    updateTotalCost(product);
    overlay.classList.add('modal--active');
    document.body.style.overflow = 'hidden';
}



/**
 * Логика переключения интерактивных кнопок
 * 
 * @param {*} container - Контейнер.
 * @param {*} product - Продукт.
 */
function setupModalInteractive(container, product) {
    // 1. Логика Радиокнопок для Размеров
    const sizeButtons = container.querySelectorAll('.product__size-buttons .modal__button');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            sizeButtons.forEach(b => b.classList.remove('btn--active'));
            btn.classList.add('btn--active');

            currentSize = product.sizes.find(s => s.key === btn.dataset.sizeKey);
            updateTotalCost(product);
        });
    });

    // 2. Логика Чекбоксов для Добавок
    const additiveButtons = container.querySelectorAll('.product__additives-buttons .modal__button');
    additiveButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetAdditive = product.additives.find(a => a.name === btn.dataset.additiveName);

            if (currentAdditives.some(a => a.name === targetAdditive.name)) {
                currentAdditives = currentAdditives.filter(a => a.name !== targetAdditive.name);
                btn.classList.remove('btn--active');
            } else {
                currentAdditives.push(targetAdditive);
                btn.classList.add('btn--active');
            }
            updateTotalCost(product);
        });
    });
}


/**
 * Перерасчет стоимости.
 * 
 * @param {*} product - Продукт.
 * @returns {number} Общая стоимость.
 */
function updateTotalCost(product) {
    const costElement = document.querySelector('.product__total-cost');
    if (!costElement) return;

    const additiveNames = currentAdditives.map(a => a.name);
    const finalPrice = calculateOrderPrice(product, currentSize.key, additiveNames);
    costElement.textContent = `\$${finalPrice.toFixed(2)}`;
}


/**
 * Закрыть модальное окно.
 */
function closeModal() {
    const overlay = document.querySelector('.modal__overlay');
    if (overlay) {
        overlay.classList.remove('modal--active');
        document.body.style.overflow = '';
        store.currentProduct = null;
    }
}


/**
 * Главный шаблон каркаса модального окна
 */
function buildModalLayoutHtml(product) {
    return `
        <div class="modal__product">
            ${buildImageBlockHtml(product)}
            <div class="modal__product-content">
                <h3 class="product__title">${product.name}</h3>
                <p class="offer__card-description product__description description">${product.description}</p>
                
                ${buildSizesBlockHtml(product.sizes)}
                ${buildAdditivesBlockHtml(product.additives)}
                ${buildTotalBlockHtml()}
                
                <div class="modal__hr"></div>
                <div class="product__info">
                    <p class="product__info-icon"></p>
                    <p class="product__info-message">
                        The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.
                    </p>
                </div>
                <button class="modal__close">Close</button>
            </div>
        </div>
    `;
}

/**
 * Формирование блока изображения с поддержкой массива расширений
 */
function buildImageBlockHtml(product) {
    const extensions = ['jpg', 'png', 'webp', 'jpeg'];
    return `
        <div class="modal__product-imageblock">
            <img 
                class="product__pic" 
                src="${product.image}.jpg" 
                alt="${product.name}"
                data-ext-index="0"
                data-ext-list="${extensions.join(',')}"
                onerror="
                    const index = parseInt(this.dataset.extIndex) + 1;
                    const exts = this.dataset.extList.split(',');
                    if (index < exts.length) {
                        this.dataset.extIndex = index;
                        this.src = '${product.image}.' + exts[index];
                    } else {
                        this.src = './assets/img/default-fallback.jpg';
                        this.onerror = null;
                    }
                "
            >
        </div>
    `;
}


/**
 * Формирование блока выбора размеров
 * @param {Size[]} sizes 
 */
function buildSizesBlockHtml(sizes) {
    return `
        <div class="product__size">
            <p class="offer__card-description product__description product__size-title">Size</p>
            <div class="product__buttons product__size-buttons">
                ${sizes.map(size => {
        const isActive = size.key === currentSize.key
            ? 'btn--active'
            : '';
        return `
            <button class="modal__button ${isActive}" data-size-key="${size.key}">
                <span class="modal__text-circle">${size.key.toUpperCase()}</span>
                <span>${size.displayName}</span>
            </button>
        `;
    }).join('')}
            </div>
        </div>
    `;
}


/**
 * Формирование блока выбора дополнительных товаров.
 * 
 * @param {ProductAdditive[]} additives 
 */
function buildAdditivesBlockHtml(additives) {
    return `
        <div class="product__additives">
            <p class="offer__card-description product__description product__size-title">Additives</p>
            <div class="product__buttons product__additives-buttons">
                ${additives.map((additive, index) => `
                    <button class="modal__button" data-additive-name="${additive.name}">
                        <span class="modal__text-circle">${index + 1}</span>
                        <span>${additive.name}</span>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}


/**
 * Формирование блока итоговой стоимости
 */
function buildTotalBlockHtml() {
    return `
        <div class="product__total">
            <h3 class="product__total-title">Total</h3>
            <h3 class="product__total-cost">$0.00</h3>
        </div>
    `;
}