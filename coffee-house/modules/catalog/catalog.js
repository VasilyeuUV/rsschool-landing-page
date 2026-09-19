const coffee = [
    {
        image: './assets/img/coffee/coffee-1.jpg',
        name: 'Irish coffee',
        description: 'Fragrant black coffee with Jameson Irish whiskey and whipped milk',
        price: '$7.00'
    },
    {
        image: './assets/img/coffee/coffee-2.jpg',
        name: 'Kahlua coffee',
        description: 'Classic coffee with milk and Kahlua liqueur under a cap of frothed milk',
        price: '$7.00'
    },
    {
        image: './assets/img/coffee/coffee-3.jpg',
        name: 'Honey raf',
        description: 'Espresso with frothed milk, cream and aromatic honey',
        price: '$5.50'
    },
    {
        image: './assets/img/coffee/coffee-4.jpg',
        name: 'Ice cappuccino',
        description: 'Cappuccino with soft thick foam in summer version with ice',
        price: '$5.00'
    },
    {
        image: './assets/img/coffee/coffee-5.jpg',
        name: 'Espresso',
        description: 'Classic black coffee',
        price: '$4.50'
    },
    {
        image: './assets/img/coffee/coffee-6.jpg',
        name: 'Latte',
        description: 'Espresso coffee with the addition of steamed milk and dense milk foam',
        price: '$5.50'
    },
    {
        image: './assets/img/coffee/coffee-7.jpg',
        name: 'Latte macchiato',
        description: 'Espresso with frothed milk and chocolate',
        price: '$5.50'
    },
    {
        image: './assets/img/coffee/coffee-8.jpg',
        name: 'Coffee with cognac',
        description: 'Fragrant black coffee with cognac and whipped cream',
        price: '$6.50'
    }
];

const tea = [
    {
        image: './assets/img/tea/tea-1.png',
        name: 'Moroccan',
        description: 'Fragrant black tea with the addition of tangerine, cinnamon, honey, lemon and mint',
        price: '$4.50'
    },
    {
        image: './assets/img/tea/tea-2.png',
        name: 'Ginger',
        description: 'Original black tea with fresh ginger, lemon and honey',
        price: '$5.00'
    },
    {
        image: './assets/img/tea/tea-3.png',
        name: 'Cranberry',
        description: 'Invigorating black tea with cranberry and honey',
        price: '$5.00'
    },
    {
        image: './assets/img/tea/tea-4.png',
        name: 'Sea buckthorn',
        description: 'Toning sweet black tea with sea buckthorn, fresh thyme and cinnamon',
        price: '$5.50'
    }
];

const dessert = [
    {
        image: './assets/img/desserts/dessert-1.png',
        name: 'Marble cheesecake',
        description: 'Philadelphia cheese with lemon zest on a light sponge cake and red currant jam',
        price: '$3.50'
    },
    {
        image: './assets/img/desserts/dessert-2.png',
        name: 'Red velvet',
        description: 'Layer cake with cream cheese frosting',
        price: '$4.00'
    },
    {
        image: './assets/img/desserts/dessert-3.png',
        name: 'Cheesecakes',
        description: 'Soft cottage cheese pancakes with sour cream and fresh berries and sprinkled with powdered sugar',
        price: '$4.50'
    },
    {
        image: './assets/img/desserts/dessert-4.png',
        name: 'Creme brulee',
        description: 'Delicate creamy dessert in a caramel basket with wild berries',
        price: '$4.00'
    },
    {
        image: './assets/img/desserts/dessert-5.png',
        name: 'Pancakes',
        description: 'Tender pancakes with strawberry jam and fresh strawberries',
        price: '$4.50'
    },
    {
        image: './assets/img/desserts/dessert-6.png',
        name: 'Honey cake',
        description: 'Classic honey cake with delicate custard',
        price: '$4.50'
    },
    {
        image: './assets/img/desserts/dessert-7.png',
        name: 'Chocolate cake',
        description: 'Cake with hot chocolate filling and nuts with dried apricots',
        price: '$5.50'
    },
    {
        image: './assets/img/desserts/dessert-8.png',
        name: 'Black forest',
        description: 'A combination of thin sponge cake with cherry jam and light chocolate mousse',
        price: '$6.50'
    },
];

const catalog = {
    coffee,
    tea,
    dessert
};


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
            <h2 class="catalog__card--title">
                ${product.name}
            </h2>

            <p class="catalog__card--description">
                ${product.description}
            </p>

            <p class="catalog__card--price">
                ${product.price}
            </p>
        </div>
    `;

    return card;
}


/**
 * Отобразить товары выбранной категории.
 * 
 * @param {object[]} products - Массив продуктов в категории.
 */

function renderProducts(products) {
    const container = document.querySelector('.catalog__products');

    if (!container) {
        return;
    }

    const cards = products.map(createProductCard);

    container.replaceChildren(...cards);
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

            renderProducts(catalog[category]);

            buttons.forEach(item => {
                item.classList.toggle(
                    'catalog__category-active',
                    item === button
                );
            });
        });
    });

    renderProducts(catalog.coffee);
}

initCatalog();