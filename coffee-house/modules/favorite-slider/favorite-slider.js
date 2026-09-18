/**
 * Массив фаворитов (можно изменять/добавлять).
 */
const slides = [
    {
        image: './assets/img/coffee/coffee-slider-1.png',
        name: 'S’mores Frappuccino',
        description: 'This new drink takes an espresso and mixes it with brown sugar and cinnamon before being topped with oat milk.',
        price: '$5.50'
    },
    {
        image: './assets/img/coffee/coffee-slider-2.png',
        name: 'Caramel Macchiato',
        description: 'Fragrant and unique classic espresso with rich caramel-peanut syrup, with cream under whipped thick foam.',
        price: '$5.00'
    },
    {
        image: './assets/img/coffee/coffee-slider-3.png',
        name: 'Ice Coffee',
        description: 'A popular summer drink that tones and invigorates. Prepared from coffee, milk and ice.',
        price: '$4.50'
    }
];


/**
 * Инициализация слайдов.
 */
function initSliders() {
    const sliders = document.querySelectorAll(
        '.favorite__slider'
    );

    sliders.forEach(slider => {
        renderSlider(slider, slides);
        initSlider(slider);
    });
}


/**
 * Создать один слайд.
 * 
 * @param {object} coffee - Данные фаворита.
 * @returns {HTMLElement} Слайд.
 */
function createSlide(coffee) {
    const slide = document.createElement('article');

    slide.className = 'favorite__slider--slide';

    slide.innerHTML = `
        <img
            class="favorite__slider--image"
            src="${coffee.image}"
            alt="${coffee.name}"
        >

        <div class="favorite__slider--content">
            <h3 class="favorite__slider--content-name">
                ${coffee.name}
            </h3>

            <p class="favorite__slider--content-description">
                ${coffee.description}
            </p>

            <p class="favorite__slider--content-price">
                ${coffee.price}
            </p>
        </div>
    `;

    return slide;
}


/**
 * Создать кнопки пагинации.
 * 
 * @param {object} pagination - Объект пагинации.
 * @param {number} count - Количество фаворитов.
 */
function createPagination(pagination, count) {
    pagination.replaceChildren();

    for (let index = 0; index < count; index++) {
        const dot = document.createElement('button');

        dot.className = 'favorite__slider--dot';

        if (index === 0) {
            dot.classList.add('favorite__slider--dot-active');
        }

        dot.type = 'button';
        dot.setAttribute(
            'aria-label',
            `Go to slide ${index + 1}`
        );

        pagination.append(dot);
    }
}


/**
 * Рендерить данные для слайдера.
 * 
 * @param {object} slider - Слайдер.
 * @param {object[]} coffee - Массив фаворитов.
 */
function renderSlider(slider, coffee) {
    const section = slider.closest('.favorite');
    const track = slider.querySelector('.favorite__slider--track');
    const pagination = section.querySelector('.favorite__slider--pagination');
    const firstSlide = createSlide(coffee[0]);
    const lastSlide = createSlide(coffee[coffee.length - 1]);
    const slides = coffee.map(createSlide);

    track.replaceChildren(
        lastSlide,
        ...slides,
        firstSlide
    );

    createPagination(pagination, coffee.length);
}


/**
 * Инициализация интерактивности слайдера.
 *  
 * @param {object} slider - Слайдер.
 */
function initSlider(slider) {
    const section = slider.closest('.favorite');
    const track = slider.querySelector(        '.favorite__slider--track'    );
    const previousButton = slider.querySelector(        '.button__prev'    );
    const nextButton = slider.querySelector(        '.button__next'    );
    const dots = section.querySelectorAll(        '.favorite__slider--dot'    );
    const slideCount = slides.length;

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

        track.style.transform =            `translateX(-${index * 100}%)`;
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
        if (isAnimating) {
            return;
        }

        isAnimating = true;

        showSlide(index);
        updatePagination();
    }

    track.addEventListener('transitionend', () => {
        if (currentSlide === slideCount + 1) {
            showSlide(1, false);
        } else if (currentSlide === 0) {
            showSlide(slideCount, false);
        }

        updatePagination();
        isAnimating = false;
    });

    previousButton.addEventListener('click', () => {
        return;
        moveToSlide(currentSlide - 1);
    });

    nextButton.addEventListener('click', () => {
        return;
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