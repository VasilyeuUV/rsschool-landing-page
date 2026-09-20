import { products } from '../../data/products.js';

const favoriteProducts = products.filter(
    product => product.isFavorite
);


/**
 * Создать слайд.
 *
 * @param {object} product - Данные товара.
 * @returns {HTMLElement} Слайд.
 */
function createSlide(product) {
    const slide = document.createElement('article');

    slide.className = 'favorite__slider--slide';

    slide.innerHTML = `
        <img
            class="favorite__slider--image"
            src="${product.image}"
            alt="${product.name}"
        >

        <div class="favorite__slider--content">

            <h3 class="favorite__slider--content-name">
                ${product.name}
            </h3>

            <p class="favorite__slider--content-description">
                ${product.description}
            </p>

            <h3 class="favorite__slider--content-price">
                ${product.price}
            </h3>

        </div>
    `;

    return slide;
}


/**
 * Создать элементы пагинации.
 *
 * @param {HTMLElement} pagination - Контейнер пагинации.
 * @param {number} count - Количество слайдов.
 */
function createPagination(pagination, count) {
    pagination.replaceChildren();

    for (let index = 0; index < count; index++) {
        const dot = document.createElement('button');

        dot.type = 'button';
        dot.className = 'favorite__slider--dot';

        dot.setAttribute(
            'aria-label',
            `Go to slide ${index + 1}`
        );

        pagination.append(dot);
    }
}


/**
 * Отобразить слайды.
 *
 * @param {HTMLElement} slider - Слайдер.
 * @param {object[]} products - Избранные продукты.
 */
function renderSlider(slider, products) {
    const section = slider.closest('.favorite');
    const track = slider.querySelector('.favorite__slider--track');
    const pagination = section.querySelector('.favorite__slider--pagination');
    const firstSlide = createSlide(products[0]);
    const lastSlide = createSlide(products[products.length - 1]);
    const slides = products.map(createSlide);

    track.replaceChildren(
        lastSlide,
        ...slides,
        firstSlide
    );

    createPagination(
        pagination,
        products.length
    );
}


/**
 * Инициализировать слайдер.
 *
 * @param {HTMLElement} slider - Слайдер.
 */
function initSlider(slider) {
    const section = slider.closest('.favorite');
    const track = slider.querySelector('.favorite__slider--track');
    const previousButton = slider.querySelector('.button__prev');
    const nextButton = slider.querySelector('.button__next');
    const dots = section.querySelectorAll('.favorite__slider--dot');
    const slideCount = favoriteProducts.length;

    let currentSlide = 1;
    let isAnimating = false;

    /**
     * Показать конкретный слайд.
     * 
     * @param {number} index - Номер слайда.
     * @param {boolean} isAnimate - Признак анимации слайда. 
     */
    function showSlide(index, isAnimate = true) {
        track.style.transition = isAnimate
            ? 'transform 0.3s ease'
            : 'none';

        track.style.transform =
            `translateX(-${index * 100}%)`;

        currentSlide = index;
    }

    /**
     * Обновить пагинацию.
     */
    function updatePagination() {
        const dotIndex =
            currentSlide === 0
                ? slideCount - 1
                : currentSlide === slideCount + 1
                    ? 0
                    : currentSlide - 1;

        dots.forEach((dot, index) => {
            dot.classList.toggle(
                'favorite__slider--dot-active',
                index === dotIndex
            );
        });
    }

    /**
     * Перейти к слайду.
     * @param {number} index - Номер слайда. 
     * @returns {HTMLElement} - Слайд.
     */
    function moveToSlide(index) {
        return;

        if (isAnimating) {
            return;
        }

        isAnimating = true;

        showSlide(index);
        updatePagination();
    }

    track.addEventListener('transitionend', event => {
        if (event.propertyName !== 'transform') {
            return;
        }

        if (currentSlide === slideCount + 1) {
            showSlide(1, false);
        } else if (currentSlide === 0) {
            showSlide(slideCount, false);
        }

        updatePagination();

        isAnimating = false;
    });

    previousButton.addEventListener('click', () => {
        moveToSlide(currentSlide - 1);
    });

    nextButton.addEventListener('click', () => {
        moveToSlide(currentSlide + 1);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            moveToSlide(index + 1);
        });
    });

    showSlide(1, false);
    updatePagination();
}


/**
 * Деактивировать слайдер.
 * 
 * @param {HTMLElement} slider - Слайдер. 
 */
function disableSlider(slider) {
    const section = slider.closest('.favorite');
    const previousButton = slider.querySelector('.button__prev');
    const nextButton = slider.querySelector('.button__next');
    const pagination = section.querySelector('.favorite__slider--pagination');

    previousButton.hidden = true;
    nextButton.hidden = true;
    pagination.hidden = true;
}


/**
 * Инициализировать все слайдеры избранных товаров.
 */
function initFavoriteSliders() {
    const sliders = document.querySelectorAll('.favorite__slider');

    sliders.forEach(slider => {
        if (!favoriteProducts.length) {
            disableSlider(slider);
            return;
        }

        renderSlider(slider, favoriteProducts);
        initSlider(slider);
    });
}

initFavoriteSliders();