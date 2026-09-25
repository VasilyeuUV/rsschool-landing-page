/**
 * Класс-связка: Добавка для конкретного Продукта.
 */
export class ProductAdditive {
    /**
     * CTOR.
     * @param {Product} product - Ссылка надополнительный Product (с категорией 'additive').
     * @param {number} addPrice - Индивидуальная наценка на добавку в контексте этого блюда.
     */
    constructor(product, addPrice = 0) {
        this.product = product;
        this.addPrice = Number(addPrice);
    }

    /** Проксируем имя из базового продукта для удобства UI */
    get name() {
        return this.product.name;
    }

    /** Презентационный геттер цены для вывода на экран */
    get displayPrice() {
        return Math.max(0, this.product.price + this.addPrice);
    }
}