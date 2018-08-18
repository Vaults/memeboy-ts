import {asTupleList, numberToHex, padZero, range, trueModulo} from '../../src/lib/util';

describe('padZero', () => {
    it('sanity checks', () => {
        expect(padZero('a', 10)).toBe('000000000a');
        expect(padZero('a', 1)).toBe('a');
        expect(padZero('a', 0)).toBe('a');
    });
});

describe('numberToHex', () => {
    it('sanity checks', () => {
        expect(numberToHex(255)).toBe('0xFF');
        expect(numberToHex(0)).toBe('0x00');
        expect(numberToHex(1024)).toBe('0x400');
    });
});

describe('mod', () => {
    it('sanity checks', () => {
        expect(trueModulo(1, 10)).toBe(1);
        expect(trueModulo(11, 10)).toBe(1);
        expect(trueModulo(-9, 10)).toBe(1);
    });
});

describe('range', () => {
    it('sanity checks', () => {
        expect(range(0, 10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
});

describe('asTupleList', () => {
    it('sanity checks', () => {
        const input: {[key: number] : string} = {
            1: 'a',
            2: 'b',
            47: 'c'
        };
        const expected: [number, string][] = [
            [1, 'a'],
            [2, 'b'],
            [47, 'c']
        ]
        expect(asTupleList(input)).toEqual(expected);
    });
});