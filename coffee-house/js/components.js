document.addEventListener('DOMContentLoaded', loadComponents);

/**
 * Асинхронная загрузка компонентов страницы.
 */
async function loadComponents() {
    const components = document.querySelectorAll('[data-component]');

    for (const component of components) {
        await loadComponent(component);
    }
}


/**
 * Загрузить вложенные компоненты компонента.
 *
 * @param {HTMLElement} component - Загруженный компонент.
 */
async function loadNestedComponents(component) {
    if (!component)
        return;

    try {

        const elementsToCheck = Array.isArray(component)
            ? component
            : [component];
        const nestedComponents = [];

        for (const el of elementsToCheck) {
            if (el.hasAttribute('data-component')) {
                nestedComponents.push(el);
            }

            nestedComponents.push(...el.querySelectorAll('[data-component]'));
        }

        for (const nestedComponent of nestedComponents) {
            await loadComponent(nestedComponent);
        }
    } catch (error) {
        console.error(`Failed to load nested component/module:`, error);
    }

    // try {
    //     const nestedComponents = component.querySelectorAll('[data-component]');

    //     for (const nestedComponent of nestedComponents) {
    //         await loadComponent(nestedComponent);
    //     }
    // } catch (error) {
    //     console.error(
    //         `Failed to load nested component/module:`,
    //         error
    //     );
    // }
}


/**
 * Загрузить HTML-компонент или модуль, и связанные с ним CSS и JavaScript.
 *
 * @param {HTMLElement} element - Элемент-загрузчик компонента.
 */
async function loadComponent(element) {
    const componentUrl = element.dataset.component;

    try {
        const html = await loadFile(componentUrl);

        if (element.tagName === 'HEAD') {
            loadHead(element, html);
            return;
        }

        const component = replaceComponent(element, html);

        await loadStyle(element.dataset.style);
        await loadScript(element.dataset.script);
        await loadNestedComponents(component);

    } catch (error) {
        console.error(
            `Failed to load component/module: ${componentUrl}`,
            error
        );
    }
}


/**
 * Загрузить текстовый файл.
 *
 * @param {string} url - URL файла.
 * @returns {Promise<string>} Содержимое файла.
 */
async function loadFile(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Failed to load file: ${url} (${response.status})`
        );
    }

    return response.text();
}


/**
 * Вставить компонент в <head> и установить заголовок страницы.
 *
 * @param {HTMLHeadElement} head - Элемент <head>.
 * @param {string} html - Содержимое компонента.
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
 * Заменить элемент-загрузчик содержимым компонента.
 *
 * @param {HTMLElement} element - Элемент-загрузчик.
 * @param {string} html - HTML компонента.
 */
function replaceComponent(element, html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();

    // const component = template.content.firstElementChild;
    // if (!component) {
    //     throw new Error(
    //         `Component is empty: ${element.dataset.component}`
    //     );
    // }

    const newElements = Array.from(template.content.children);

    element.replaceWith(template.content);

    return newElements;
}


/**
 * Загрузить CSS-файл.
 *
 * @param {string|undefined} url - URL CSS-файла.
 * @returns {Promise<void>}
 */
function loadStyle(url) {
    if (!url) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const link = document.createElement('link');

        link.rel = 'stylesheet';
        link.href = url;

        link.addEventListener('load', resolve);
        link.addEventListener('error', () => {
            reject(new Error(`Failed to load stylesheet: ${url}`));
        });

        document.head.append(link);
    });
}


/**
 * Загрузить JavaScript-файл.
 *
 * @param {string|undefined} url - URL JS-файла.
 * @returns {Promise<void>}
 */
function loadScript(url) {
    if (!url) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');

        script.type = 'module';
        script.src = url;

        script.addEventListener('load', resolve);
        script.addEventListener('error', () => {
            reject(new Error(`Failed to load script: ${url}`));
        });

        document.body.append(script);
    });
}