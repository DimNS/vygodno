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
        node.value = moneyFormat(node.value).replace(/ /gu, '');
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
    const re = /(\d)(?=(\d\d\d)+([^\d]|$))/gu;
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
    let result = value;

    if (!result) {
        result = 0;
    }

    if (typeof result !== 'number') {
        result = result.replace(/ /gu, '');
        result = result.replace(/,/gu, '.');

        result = parseFloat(result);

        if (isNaN(result)) {
            result = 0;
        }
    }

    return Number(result);
};
