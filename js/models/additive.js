/**
 * Класс для добавок (дополнительных товаров).
 */
export class Additive {

    /**
     * CTOR.
     * @param {string} name - Имя дополнительного товара.
     * @param {number} price - Базовая стоимость дополнительного товара.
     * @param {number} addPrice - Сумма дополнения к базовой стоимости товара (может быть отрицательная)
     */
    constructor(name, price, addPrice = 0) {
        this.name = name;
        this.basePrice = price;
        this.addPrice = addPrice;
    }

    /** Геттер автоматически считает финальную цену с защитой (>= 0) */
    get price() {
        return Math.max(0, this.basePrice + this.addPrice);
    }


    /**
     * 
     * @param {number} addPrice - Сумма дополнения к базовой стоимости товара (может быть отрицательная) 
     * @returns {number} Окончательная стоимость дополнительного товара.
     */
    with(addPrice) {
        return new Additive(this.name, this.basePrice, addPrice);
    }
}