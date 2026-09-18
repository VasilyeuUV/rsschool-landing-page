document.addEventListener('DOMContentLoaded', loadComponents);

/**
 * Асинхронная загрузка компонентов.
 */
async function loadComponents() {
    const components = document.querySelectorAll('[data-component]');

    for (const component of components) {
        await loadComponent(component);
    }
}


/**
 * Загрузить конкретный компонент и определить его тип.
 * 
 * @param {string} element - Найденный компонент
 * @returns 
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
 * Вставить компонент в блок <head> c <title>
 * 
 * @param {string} head - Блок <head> для вставки компонента.
 * @param {string} html - вставляемый код. 
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
 * Вставить компонент в блок <body> с заменой.
 * 
 * @param {string} element - элемент компонента.
 * @param {string} html - вставляемый код компонента.
 */
function replaceComponent(element, html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();

    element.replaceWith(template.content);
}