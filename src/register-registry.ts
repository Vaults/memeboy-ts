import {Bit} from './bit';
import {Byte} from './byte';
import {DoubleByte} from './double-byte';

export class RegisterRegistry {
    //Usually for data transferring
    public B: Byte = Byte.OF(0);
    public C: Byte = Byte.OF(0);
    public BC: DoubleByte = new DoubleByte(this.B, this.C);
    //Regular registers
    public D: Byte = Byte.OF(0);
    public E: Byte = Byte.OF(0);
    public DE: DoubleByte = new DoubleByte(this.D, this.E);
    //Indirect addressing
    public H: Byte = Byte.OF(0);
    public L: Byte = Byte.OF(0);
    public HL: DoubleByte = new DoubleByte(this.H, this.L);

    //Accumulator
    public A: Byte = Byte.RANDOM();
    //Flags
    public FZ: Bit = Bit.RANDOM();
    public FN: Bit = Bit.RANDOM();
    public FH: Bit = Bit.RANDOM();
    public FC: Bit = Bit.RANDOM();

    public F: Byte = new Byte([this.FZ, this.FN, this.FC, this.FH, Bit.RANDOM(), Bit.RANDOM(), Bit.RANDOM(), Bit.RANDOM()]);
    public AF: DoubleByte = new DoubleByte(this.A, this.F);

    public PC: DoubleByte = DoubleByte.OF(0x0000);

    constructor() {

    }

    public checkZero(b: Byte) {
        this.FZ.setState(b.toNumber() === 0 ? 1 : 0);
    }
}
