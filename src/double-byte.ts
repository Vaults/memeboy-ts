import {Byte} from './byte';

export class DoubleByte {
    private hi: Byte;
    private lo: Byte;

    constructor(hi: Byte, lo: Byte) {
        this.hi = hi;
        this.lo = lo;
    }

    public toNumber(): number {
        return this.hi.toNumber() << 8 | this.lo.toNumber();
    }
}
