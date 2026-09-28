/**
 * Генерировать HTML-строку тега img с автоматическим перебором расширений при ошибке загрузки.
 * 
 * @param {string} basePath - Базовый путь к картинке без расширения (например, './assets/img/coffee/coffee-1')
 * @param {string} altText - Альтернативный текст для картинки
 * @param {string} className - CSS-класс для тега img
 * @returns {string} Готовая HTML разметка тега <img>
 */
export function buildDynamicImageHtml(basePath, altText = '', className = '') {
    // Массив расширений изображений.
    const extensions = ['jpg', 'png', 'webp', 'svg', 'jpeg'];
    const classAttr = className
        ? `class="${className}"`
        : '';

    return `
        <img 
            ${classAttr}
            src="${basePath}.${extensions[0]}" 
            alt="${altText}"
            data-ext-index="0"
            data-ext-list="${extensions.join(',')}"
            onerror="
                const index = parseInt(this.dataset.extIndex) + 1;
                const exts = this.dataset.extList.split(',');
                
                if (index < exts.length) {
                    this.dataset.extIndex = index;
                    this.src = '${basePath}.' + exts[index];
                } else {
                    this.src = './assets/img/default-fallback.jpg';
                    this.onerror = null;
                }
            "
        >
    `;
}