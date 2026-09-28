/**
 * Рассчитать итоговую стоимость выбранной конфигурации продукта.
 * 
 * @param {Product} product - Доменная модель основного продукта (из store.products)
 * @param {string} selectedSizeKey - Ключ выбранного размера ('s', 'm', 'l')
 * @param {string[]} selectedAdditiveNames - Массив названий выбранных добавок (например: ['Sugar', 'Syrup'])
 * @returns {number} Итоговая стоимость в виде числа
 */
export function calculateOrderPrice(product, selectedSizeKey, selectedAdditiveNames = []) {
    if (!product
        || !product.isAvailable)
        return 0;

    let totalPrice = product.price;
    const sizeObj = product.sizes
        .find(s => s.key === selectedSizeKey);
    if (sizeObj) {
        totalPrice += sizeObj.addPrice;
    }

    selectedAdditiveNames.forEach(name => {
        const additiveObj = product.additives.find(
            a => a.name.toLowerCase() === name.toLowerCase()
        );

        if (additiveObj) {
            totalPrice += additiveObj.displayPrice;
        }
    });

    return totalPrice;
}