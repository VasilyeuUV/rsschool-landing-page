import { navigationItems } from '../../data/navigation.js';

/**
 * Получить конкретную страницу.
 * 
 * @returns Страница html.
 */
function getCurrentPage() {
    return window.location.pathname.split('/').pop()
        || 'index.html';
}

/**
 * Создать пункты навигации.
 * 
 * @param {*} item - Пункт навигации.
 * @returns 
 */
function createNavigationItem(item) {
    const listItem = document.createElement('li');
    const link = document.createElement('a');

    listItem.className = 'header__item';

    link.className = 'link interactive__link';
    link.href = item.href;
    link.textContent = item.title;

    if (item.id === 'menu') {
        link.classList.add('header__burger-link');

        if (item.icon) {
            link.style.backgroundImage = `url('${item.icon}')`;
        }

        if (getCurrentPage() === 'menu.html') {
            link.classList.add('header__burger-link--active');
            link.setAttribute('tabindex', '-1');
            link.setAttribute('aria-current', 'page');
        }
    }

    listItem.append(link);

    return listItem;
}


/**
 * Отрисовать пункты меню.
 * 
 * @returns 
 */
function renderNavigation() {
    const list = document.querySelector('.header__list');
    const menuContainer = document.querySelector('.header__menu-link');

    if (!list || !menuContainer) {
        return;
    }

    const regularItems = navigationItems.filter(item => item.id !== 'menu');
    const menuItem = navigationItems.find(item => item.id === 'menu');

    regularItems.forEach(item => {
        list.append(createNavigationItem(item));
    });

    if (menuItem) {
        const menuLink = createNavigationItem(menuItem)
            .querySelector('a');

        menuContainer.append(menuLink);
    }
}

renderNavigation();