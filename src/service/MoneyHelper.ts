const precision: number = 2;

interface MoneyFormatSvelteAction {
    destroy: () => void;
}

/**
 * Привязка форматтера к полям ввода
 */
export const bindMoneyFormat = (node: HTMLInputElement): MoneyFormatSvelteAction => {
    function onFocus(): void {
        node.value = moneyFormat(node.value).replace(/ /gu, '');
    }

    function onBlur(): void {
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
 */
export const moneyFormat = (value: number | string): string => {
    const re: RegExp = /(\d)(?=(\d\d\d)+([^\d]|$))/gu;
    const num: number = cleanNumber(value);

    // Форматируем с фиксированным количеством знаков после запятой
    const formatted: string = num.toFixed(precision);

    // Добавляем пробелы для разделения тысяч
    return formatted.replace(re, '$1 ');
};

/**
 * Получим очищенное число
 */
export const cleanNumber = (value: number | string): number => {
    let result: number | string = value;

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
