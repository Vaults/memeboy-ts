import {Bit} from './bit';
import {Byte} from './byte';

export class ALU {

    private flags: Byte;

    private A: Byte;

    private F: Bit;
    private N: Bit;
    private H: Bit;
    private C: Bit;

    constructor(A: Byte, flags: Byte) {
        this.A = A;
        this.flags = flags;
        this.F = flags.getBit(0);
        this.N = flags.getBit(1);
        this.H = flags.getBit(2);
        this.C = flags.getBit(3);
    }

    public add(b: Byte): void { }
    public adc(b: Byte): void { }
    public sub(b: Byte): void { }
    public sbc(b: Byte): void { }
    public and(b: Byte): void { }
    public or(b: Byte): void { }
    public xor(b: Byte): void { }
    public cp(b: Byte): void { }
    public inc(b: Byte): void { }
    public dec(b: Byte): void { }

}
