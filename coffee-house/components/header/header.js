/**
 * Инициализация логики хедера после его загрузки.
 */
function initHeader() {
    const currentPath = window.location.pathname;

    // Изменение стиля пункта меню в зависимости от страницы
    const menuLink = document.querySelector('.header__burger-link');
    if (!menuLink) return;
    if (currentPath.includes('menu.html')) {
        menuLink.classList.add('header__burger-link--active');
        menuLink.setAttribute('tabindex', '-1');
    }
}

initHeader();