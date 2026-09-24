import { navigationItems } from '../../data/navigation.js';

let button;
let panel;
let list;


/**
 * Получить имя текущей HTML-страницы из адресной строки браузера.
 * 
 * @returns {string} Имя файла (например, 'menu.html' или 'index.html').
 */
function getCurrentPage() {
    return window.location.pathname.split('/').pop()
        || 'index.html';
}


/**
 * Проверить, является ли текущий пункт навигации активной страницей Меню.
 * 
 * @param {Object} item - Объект пункта навигации из базы данных.
 * @returns {boolean} True, если это страница меню и пункт относится к меню.
 */
function isActiveItem(item) {
    return item.id === 'menu'
        && getCurrentPage() === 'menu.html';
}


/**
 * Создать HTML-элемент списка (li) для мобильного бургер-меню.
 * 
 * @param {Object} item - Объект с данными пункта навигации (href, title, id).
 * @returns {HTMLLIElement} Созданный элемент списка с вложенной ссылкой.
 */
function createNavigationItem(item) {
    const listItem = document.createElement('li');
    const link = document.createElement('a');

    listItem.className = 'burger-menu__item';

    link.className = 'burger-menu__link';
    link.href = item.href;
    link.textContent = item.title;

    configureMenuItem(link, item);

    listItem.append(link);
    return listItem;
}


/**
 * Сконфигурировать специфичные свойства и классы для ссылки меню.
 * 
 * @param {HTMLAnchorElement} link - HTML-элемент создаваемой ссылки.
 * @param {Object} item - Данные текущего пункта навигации.
 */
function configureMenuItem(link, item) {
    if (item.id === 'menu') {
        link.classList.add('burger-menu__link--menu');
    }

    if (isActiveItem(item)) {
        setActiveMenuItem(link);
    }
}


/**
 * Установить для ссылки класс активности и атрибуты доступности (Accessibility).
 * 
 * @param {HTMLAnchorElement} link - Элемент ссылки, которую нужно сделать активной.
 */
function setActiveMenuItem(link) {
    link.classList.add('burger-menu__link--active');
    link.setAttribute('tabindex', '-1');
    link.setAttribute('aria-current', 'page');
}


/**
 * Отрендерить (вывести) все пункты навигации внутрь списка бургер-меню.
 */
function renderNavigation() {
    navigationItems.forEach(item => {
        list.append(createNavigationItem(item));
    });
}


/**
 * Открыть мобильное бургер-меню.
 */
function openMenu() {
    button.classList.add('burger-menu__button--open');
    panel.classList.add('burger-menu__panel--open');

    button.setAttribute('aria-expanded', 'true');
    button.setAttribute('aria-label', 'Close menu');

    panel.setAttribute('aria-hidden', 'false');

    document.body.classList.add('menu-open');
}


/**
 * Закрыть мобильное бургер-меню.
 */
function closeMenu() {
    if (!button
        || !panel)
        return;

    button.classList.remove('burger-menu__button--open');
    panel.classList.remove('burger-menu__panel--open');

    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open menu');

    panel.setAttribute('aria-hidden', 'true');

    document.body.classList.remove('menu-open');
}


/**
 * Переключить состояние меню (открыть, если закрыто, и наоборот) на основе состояния ARIA.
 */
function toggleMenu() {
    const isOpen = button.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}


/**
 * Обработать клик по элементам внутри списка бургер-меню.
 * 
 * @param {PointerEvent} event - Объект события клика.
 */
function handleNavigationClick(event) {
    if (event.target.matches('.burger-menu__link')) {
        closeMenu();
    }
}


/**
 * Обработать нажатие клавиш на клавиатуре.
 * 
 * @param {KeyboardEvent} event - Объект события клавиатуры.
 */
function handleKeyDown(event) {
    if (event.key === 'Escape') {
        closeMenu();
    }
}


/**
 * Главная функция инициализации бургер-меню.
 * Находит элементы в DOM и вешает обработчики событий.
 */
function initializeBurgerMenu() {
    button = document.querySelector('.burger-menu__button');
    panel = document.querySelector('.burger-menu__panel');
    list = document.querySelector('.burger-menu__list');

    renderNavigation();

    button.addEventListener('click', toggleMenu);
    list.addEventListener('click', handleNavigationClick);
    document.addEventListener('keydown', handleKeyDown);
}


initializeBurgerMenu();