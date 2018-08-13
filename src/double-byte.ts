import {Byte} from './byte';

export class DoubleByte {
    public hi: Byte;
    public lo: Byte;

    constructor(hi: Byte, lo: Byte) {
        this.hi = hi;
        this.lo = lo;
    }

    public static OF(dByte: number) {
        const lo = dByte % 256;
        const hi = (dByte - lo) / 256;
        return new DoubleByte(Byte.OF(hi), Byte.OF(lo));
    }

    public toNumber(): number {
        return this.hi.toNumber() << 8 | this.lo.toNumber();
    }

    public copy(dByte: DoubleByte) {
        this.hi.copy(dByte.hi);
        this.lo.copy(dByte.lo);
    }

    public add(byte: Byte) {
        this.lo.add(byte);
        if (this.lo.toNumber() === 0) {
            this.hi.increment();
        }
    }

    public decrement(): void {
        this.lo.decrement();
        if (this.lo.toNumber() === 255) {
            this.hi.decrement();
        }
    }

    public increment(): void {
        this.lo.increment();
        if (this.lo.toNumber() === 0) {
            this.hi.increment();
        }
    }

}
