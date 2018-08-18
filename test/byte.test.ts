import {Bit} from '../src/bit';
import {Byte} from '../src/byte';
import {padZero, range} from '../src/lib/util';

const TEST_ARRAY = range(0, 256);

function forEachByte(func: (i: number) => void) {
    TEST_ARRAY.forEach(func);
}

function referentialIntegrity(pre: Byte, transformer: (b: Byte) => void){
    const byte: Byte = Byte.OF(255);
    const bits : Bit[] = range(0, 8).map(i => byte.getBit(i));
    transformer(byte);
    bits.forEach((o, i) => expect(byte.getBit(i)).toBe(o));
}

describe('constructor', () => {
    it('undefined bits', () => {
        expect(() => new Byte(undefined)).not.toThrow();
        expect(new Byte().toNumber()).toBe(0);
    });
    it('invalid bit length', () => {
        expect(() => new Byte([new Bit()])).toThrow();
    });
    it('happy bits', () => {
        expect(() => new Byte([new Bit(), new Bit(), new Bit(), new Bit(), new Bit(), new Bit(), new Bit(), new Bit()]))
    });
});

describe('getBit', () => {
    it('invalid bit index', () => {
        expect(() => new Byte().getBit(0x$1)).toThrow();
        expect(() => new Byte().getBit(8)).toThrow();
    })
    it('valid bit index', () => {
        const b: Byte = new Byte([new Bit(), new Bit(), new Bit(), new Bit(1), new Bit(), new Bit(), new Bit(), new Bit()]);
        expect(b.getBit(3).val()).toBe(1);
        expect(b.getBit(7).val()).toBe(0);
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
    it('referential integrity', () => {
        referentialIntegrity(Byte.OF(0), b => b.flip())
    })
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
    it('referential integrity', () => {
        referentialIntegrity(Byte.OF(0), b => b.swap())
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

    it('referential integrity', () => {
        referentialIntegrity(Byte.OF(0), b => {b.increment(); b.decrement()})
    });
});

describe('copy', () => {
    it('copies properly with referential integrity', () => {
        const byte: Byte = Byte.OF(0);
        referentialIntegrity(Byte.OF(0), b => {
            byte.copy(Byte.OF(255));
            range(0, 8).forEach(i => expect(byte.getBit(i).val()).toBe(1));
        });
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
    it('referential integrity', () => {
        const byte: Byte = Byte.OF(20);
        referentialIntegrity(byte, b => b.rotate(5));
    });
});