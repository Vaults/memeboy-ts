import {Bit} from '../src/bit';

describe('constructor initializes', () => {
    it('happy', () => {
        expect(new Bit(1).val()).toBe(1);
        expect(new Bit(0).val()).toBe(0);
    });
    it('with exceptions', () => {
        expect(() => new Bit(20)).toThrow();
        expect(() => new Bit(-1)).toThrow();
        expect(() => new Bit(0.5)).toThrow();
    });
});

describe('flip and val', () => {
    it('happy', () => {
        const b: Bit = new Bit(0);
        b.flip();
        expect(b.val()).toBe(1);
        b.flip();
        expect(b.val()).toBe(0);
    });
});


describe('copy and val', () => {
    it('happy', () => {
        const b: Bit = new Bit(0);
        b.copy(new Bit(1));
        expect(b.val()).toBe(1);
        b.copy(new Bit(0));
        expect(b.val()).toBe(0);
    });
});