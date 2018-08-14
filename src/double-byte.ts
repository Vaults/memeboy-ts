import {Byte} from './byte';

export class DoubleByte {
    public hi: Byte;
    public lo: Byte;

    private CACHED_NUMBER: number;

    constructor(hi: Byte, lo: Byte) {
        this.hi = hi;
        this.lo = lo;
    }

    public static OF(dByte: number) {
        const doubleByte = new DoubleByte(new Byte(), new Byte());
        doubleByte.setByNumber(dByte);
        return doubleByte;
    }

    public toNumber(): number {
        return this.hi.toNumber() << 8 | this.lo.toNumber();
    }

    public copy(dByte: DoubleByte) {
        this.hi.copy(dByte.hi);
        this.lo.copy(dByte.lo);
    }

    public add(byte: Byte) {
        if (this.lo.toNumber() + byte.toNumber() >= 256){
            this.hi.increment();
        }
        this.lo.add(byte);
    }

    public addSigned(d: Byte) {
        this.lo.addSigned(d);
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

    private setByNumber(dByte: number): void {
        const lo = dByte % 256;
        const hi = (dByte - lo) / 256;
        this.lo.copy(Byte.OF(lo));
        this.hi.copy(Byte.OF(hi));
    }


}
