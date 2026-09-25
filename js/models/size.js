/**
 * Класс для размеров.
 */
export class Size {

    /**
     * CTOR.
     * @param {string} key - Ключ размера (название).
     * @param {number} value - Значение размера.
     * @param {string} unit - Единица измерения размера.
     * @param {number} addPrice - Наценка за размер.
     */
    constructor(key, value, unit, addPrice = 0) {
        this.key = key;
        this.value = value;
        this.unit = unit;
        this.addPrice = Number(addPrice);
    }


    /** Геттер  для вывода на веб-страницу (например: "200 ml"). */
    get display() { 
        return `${this.value} ${this.unit}`;
     }
}