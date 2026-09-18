document.addEventListener('DOMContentLoaded', loadComponents);

/**
 * Асинхронная загрузка компонентов.
 */
async function loadComponents() {
    const components = document.querySelectorAll('[data-component]');

    for (const component of components) {
        await loadComponent(component);
    }

    initializeModules();
}


/**
 * Загрузка конкретного компонента и определение его типа.
 *
 * @param {HTMLElement} element - Найденный компонент.
 */
async function loadComponent(element) {
    const url = element.dataset.component;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Failed to load component: ${url} (${response.status})`
            );
        }

        const html = await response.text();

        if (element.tagName === 'HEAD') {
            loadHead(element, html);
            return;
        }

        replaceComponent(element, html);
    } catch (error) {
        console.error(error);
    }
}


/**
 * Вставка компонента в блок <head> с установкой <title>.
 *
 * @param {HTMLHeadElement} head - Блок <head>.
 * @param {string} html - Вставляемый код.
 */
function loadHead(head, html) {
    head.innerHTML = html;

    const title = head.querySelector('title');
    const pageTitle = head.dataset.pageTitle;

    if (title && pageTitle) {
        title.textContent = pageTitle;
    }
}


/**
 * Вставка компонента в <body> с заменой элемента-загрузчика.
 *
 * @param {HTMLElement} element - Элемент-загрузчик компонента.
 * @param {string} html - Вставляемый код компонента.
 */
function replaceComponent(element, html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();

    element.replaceWith(template.content);
}


/**
 * Инициализация функциональных модулей.
 */
function initializeModules() {
    initSliders();
}