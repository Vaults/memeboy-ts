import {Bit} from '../src/bit';
import {Byte} from '../src/byte';
import {padZero, range} from '../src/lib/util';

const TEST_ARRAY = range(0, 256);

function forEachByte(func: (i: number) => void) {
    TEST_ARRAY.forEach(func);
}

describe('getBit', () => {
    it('invalid bit index', () => {
        expect(() => new Byte().getBit(-1)).toThrow();
        expect(() => new Byte().getBit(8)).toThrow();
    })
    it('valid bit index', () => {
        const b: Byte = Byte.OF(16);
        expect(b.getBit(3).val()).toBe(1);
        expect(b.getBit(7).val()).toBe(0);
    });
});


describe('setBit', () => {
    it('invalid bit index', () => {
        expect(() => new Byte().getBit(-1)).toThrow();
        expect(() => new Byte().getBit(8)).toThrow();
    })
    it('valid bit index', () => {
        const b: Byte = Byte.OF(0);
        b.setBit(3, new Bit(1));
        expect(b.getBit(3).val()).toBe(1);
        expect(b.getBit(7).val()).toBe(0);
        expect(b.toNumber()).toBe(16);
        b.setBit(3, new Bit(0));
        expect(b.getBit(3).val()).toBe(0);
        expect(b.getBit(7).val()).toBe(0);
        expect(b.toNumber()).toBe(0);
    });
});

describe('toNumber', () => {
    it('out of bounds', () => {
        expect(() => Byte.OF(256)).toThrow();
        expect(() => Byte.OF(-1)).toThrow();
    });
    it('for all bytes', () => {
       forEachByte(testNumber => {
           const b: Byte = Byte.OF(testNumber);
           const bits: number[] = padZero(testNumber.toString(2), 8).split('').map(s => parseInt(s,2));
           bits.forEach((bit, index) => {
               expect(b.getBit(index).val()).toBe(bit);
           })
       });
    });
});

describe('to/fromNumber', () => {
    it('simple use cases', () => {
       forEachByte(i => {
           expect(Byte.OF(i).toNumber()).toBe(i);
       })
   })
});

describe('flip', () => {
    it('flip for all values', () => {
        forEachByte(i => {
            const byte: Byte = Byte.OF(i);
            byte.flip();
            expect(byte.toNumber()).toBe(255 - i);
        })
    });
});

describe('swap', () => {
    it('swap for all values', () => {
        forEachByte(i => {
            const lo = i % 16;
            const hi = (i - lo) / 16;
            const swapped = (lo * 16) + hi;
            const b: Byte = Byte.OF(i);
            b.swap()
            expect(b.toNumber()).toBe(swapped);
        });
    });
});

describe('increment/decrement', () => {
    it('happy easy', () => {
        const byte = Byte.OF(4);
        byte.increment();
        expect(byte.toNumber()).toBe(5);
        byte.decrement();
        expect(byte.toNumber()).toBe(4);
    });

    it('time for overflow', () => {
        forEachByte(i => {
           const b: Byte = Byte.OF(i);
           b.increment();
           expect(b.toNumber()).toBe((i + 1) % 256);
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
            const b: Byte = Byte.OF(i);
            b.increment();
            while (b.toNumber() !== i) {
                b.increment();
            }
        });
    });

});

describe('copy', () => {
    it('copies properly with referential integrity', () => {
        const byte: Byte = Byte.OF(0);
        const copy: Byte = Byte.OF(255);
        copy.copy(byte);
        expect(copy.toNumber()).toBe(0);
    });
});

describe('rotate', () => {
    it('simple test case', () => {
        const byte: Byte = Byte.OF(16);
        byte.rotate(-1);
        expect(byte.toNumber()).toBe(32);
    });
    it('simple test case 2', () => {
        const byte: Byte = Byte.OF(48);
        byte.rotate(-1);
        expect(byte.toNumber()).toBe(96);
    });
    it('rotates around', () => {
        forEachByte(i => {
            const byte: Byte = Byte.OF(i);
            byte.rotate(8);
            expect(byte.toNumber()).toBe(i);
            byte.rotate(-8);
            expect(byte.toNumber()).toBe(i);
        })
    });
});