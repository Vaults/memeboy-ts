import {Byte} from './byte';

export class DoubleByte {
    public hi: Byte;
    public lo: Byte;

    constructor(hi: Byte, lo: Byte) {
        this.hi = hi;
        this.lo = lo;
    }

    public static OF(dByte: number) {
        const lo = dByte % 255;
        const hi = (dByte - lo) / 256;
        return new DoubleByte(new Byte(hi), new Byte(lo));
    }

    public toNumber(): number {
        return this.hi.toNumber() << 8 | this.lo.toNumber();
    }

    public copy(dByte: DoubleByte) {
        this.hi.copy(dByte.hi);
        this.lo.copy(dByte.lo);
    }

    public add(byte: Byte): DoubleByte {
        //TODO
        return this;
    }

    public decrement(): void {
        //TODO
    }

    public increment(): void {
        //TODO
    }

}
