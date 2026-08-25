import { describe, it, expect, vi } from 'vitest';
import { cleanNumber, moneyFormat, bindMoneyFormat } from './MoneyHelper';

describe('cleanNumber', () => {
    it('returns 0 for falsy values', () => {
        expect(cleanNumber(0)).toBe(0);
        expect(cleanNumber('')).toBe(0);
    });

    it('passes through plain numbers', () => {
        expect(cleanNumber(42)).toBe(42);
        expect(cleanNumber(3.14)).toBeCloseTo(3.14);
        expect(cleanNumber(-100)).toBe(-100);
    });

    it('strips spaces from strings', () => {
        expect(cleanNumber('1 000')).toBe(1000);
        expect(cleanNumber('1 234 567')).toBe(1234567);
    });

    it('replaces comma with dot', () => {
        expect(cleanNumber('3,14')).toBeCloseTo(3.14);
        expect(cleanNumber('1 000,50')).toBeCloseTo(1000.5);
    });

    it('returns 0 for non-numeric strings', () => {
        expect(cleanNumber('abc')).toBe(0);
        expect(cleanNumber('   ')).toBe(0);
    });

    it('handles negative string values', () => {
        expect(cleanNumber('-42')).toBe(-42);
        expect(cleanNumber('-1 234,56')).toBeCloseTo(-1234.56);
    });
});

describe('moneyFormat', () => {
    it('formats zero', () => {
        expect(moneyFormat(0)).toBe('0.00');
    });

    it('formats small numbers without thousand separator', () => {
        expect(moneyFormat(1)).toBe('1.00');
        expect(moneyFormat(999)).toBe('999.00');
    });

    it('adds space as thousand separator', () => {
        expect(moneyFormat(1000)).toBe('1 000.00');
        expect(moneyFormat(1234567)).toBe('1 234 567.00');
    });

    it('formats negative numbers', () => {
        expect(moneyFormat(-1000)).toBe('-1 000.00');
    });

    it('formats decimals with 2 decimal places', () => {
        expect(moneyFormat(1.5)).toBe('1.50');
        expect(moneyFormat(1234.56)).toBe('1 234.56');
        expect(moneyFormat(0.1)).toBe('0.10');
    });

    it('rounds to 2 decimal places', () => {
        expect(moneyFormat(1.005)).toBe('1.00');
        expect(moneyFormat(1.006)).toBe('1.01');
    });

    it('accepts string input', () => {
        expect(moneyFormat('1234567')).toBe('1 234 567.00');
        expect(moneyFormat('0')).toBe('0.00');
    });

    it('handles string input with spaces (from previous formatting)', () => {
        expect(moneyFormat('1 000')).toBe('1 000.00');
    });
});

describe('bindMoneyFormat', () => {
    function createMockNode(initialValue = '') {
        const listeners: Record<string, (e: Event) => void> = {};
        const node = {
            value: initialValue,
            addEventListener: vi.fn((event: string, handler: (e: Event) => void) => {
                listeners[event] = handler;
            }),
            removeEventListener: vi.fn((event: string) => {
                delete listeners[event];
            }),
            dispatch(event: string) {
                listeners[event]?.(new Event(event));
            },
        };
        return node;
    }

    it('formats value on blur', () => {
        const node = createMockNode('1234');
        const action = bindMoneyFormat(node as unknown as HTMLInputElement);

        node.dispatch('blur');
        expect(node.value).toBe('1 234.00');

        action.destroy();
    });

    it('removes spaces on focus', () => {
        const node = createMockNode('1 234.00');
        const action = bindMoneyFormat(node as unknown as HTMLInputElement);

        node.dispatch('focus');
        expect(node.value).toBe('1234.00');

        action.destroy();
    });

    it('cleans up listeners on destroy', () => {
        const node = createMockNode('100');
        const action = bindMoneyFormat(node as unknown as HTMLInputElement);

        action.destroy();

        // After destroy, blur should not re-format
        node.value = '9999';
        node.dispatch('blur');
        expect(node.value).toBe('9999');
    });
});
