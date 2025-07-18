const precision = 2;

/**
 * Привязка форматтера к полям ввода
 *
 * @param {HTMLInputElement} node
 *
 * @returns {{ destroy: () => void }}
 */
export const bindMoneyFormat = (node) => {
    function onFocus() {
        node.value = moneyFormat(node.value).replace(/ /g, '');
    }

    function onBlur() {
        node.value = moneyFormat(node.value);
    }

    node.addEventListener('focus', onFocus);
    node.addEventListener('blur', onBlur);

    return {
        destroy() {
            node.removeEventListener('focus', onFocus);
            node.removeEventListener('blur', onBlur);
        },
    };
};

/**
 * Получить человеко-читаемое значение
 *
 * @param {number|string} value
 *
 * @returns {string}
 */
export const moneyFormat = (value) => {
    const re = /(\d)(?=(\d\d\d)+([^\d]|$))/g;
    const num = cleanNumber(value);

    // Форматируем с фиксированным количеством знаков после запятой
    const formatted = num.toFixed(precision);

    // Добавляем пробелы для разделения тысяч
    return formatted.replace(re, '$1 ');
};

/**
 * Получим очищенное число
 *
 * @param {number|string} value
 */
export const cleanNumber = (value) => {
    if (!value) {
        value = 0;
    }

    if (typeof value !== 'number') {
        value = value.replace(/ /g, '');
        value = value.replace(/,/g, '.');

        value = parseFloat(value);

        if (isNaN(value)) {
            value = 0;
        }
    }

    return Number(value);
};
