import {DoubleByte} from '../src/double-byte';
import {range} from '../src/lib/util';
import {Byte} from '../src/byte';
import {Bit} from '../src/bit';

const TEST_ARRAY = range(0, 2 ** 16).filter(i => Math.random() < 0.1);

function forEachByte(func: (i: number) => void) {
    TEST_ARRAY.forEach(func);
}

function referentialIntegrity(pre: DoubleByte, transformer: (b: DoubleByte) => void){
    const hi: Byte = pre.hi;
    const lo: Byte = pre.lo;
    transformer(pre);
    expect(pre.hi).toBe(hi);
    expect(pre.lo).toBe(lo);
}

describe('toNumber/fromNumber', () => {
    it('try all possibles', () => {
        forEachByte(i => {
            expect(DoubleByte.OF(i).toNumber()).toBe(i);
        })
    });
    it('throws if out of bounds', () => {
        expect(() => DoubleByte.OF(-1)).toThrow();
        expect(() => DoubleByte.OF(2 ** 16 + 1)).toThrow();
    })
});

describe('copy', () => {
    it('simple use case', () => {
        const dByte: DoubleByte = DoubleByte.OF(0);
        dByte.copy(DoubleByte.OF(0xFFFF));
        expect(dByte.toNumber()).toBe(0xFFFF);
    });
    it('referential integrity', () => {
        referentialIntegrity(DoubleByte.OF(0), b => b.copy(DoubleByte.OF(0xFFFF)));
    });
});

describe('add', () => {
    it('happy easy', () => {
        const doubleByte = DoubleByte.OF(0x00FF);
        doubleByte.add(Byte.OF(0xFF));
        expect(doubleByte.toNumber()).toBe(0x00FF + 0xFF);
    });
    it('referential integrity', () => {
        referentialIntegrity(DoubleByte.OF(0), b => {b.add(Byte.OF(200)) })
    });
});

describe('increment/decrement', () => {
    it('happy easy', () => {
        const doubleByte = DoubleByte.OF(0x0100);
        doubleByte.increment();
        expect(doubleByte.toNumber()).toBe(0x0101);
        doubleByte.decrement();
        expect(doubleByte.toNumber()).toBe(0x0100);
    });

    it('time for overflow', () => {
        forEachByte(i => {
            const b: DoubleByte = DoubleByte.OF(i);
            b.increment();
            expect(b.toNumber()).toBe((i + 1) % 2 ** 16);
            b.decrement();
            expect(b.toNumber()).toBe(i);
            b.decrement();
            expect(b.toNumber()).toBeGreaterThanOrEqual(0);
            b.increment();
            expect(b.toNumber()).toBe(i);
        });
    })

    it('time for SUPER overflow', () => {
        forEachByte(i => {
            if (Math.random() < 0.1) {
                const b: DoubleByte = DoubleByte.OF(i);
                b.increment();
                while (b.toNumber() !== i) {
                    b.increment();
                }
            }
        });
    });

    it('referential integrity', () => {
        referentialIntegrity(DoubleByte.OF(0), b => {b.increment(); b.decrement()})
    });
});


