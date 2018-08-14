import {Byte} from './byte';
import {DoubleByte} from './double-byte';
import {Bit} from './bit';

export class RegisterRegistry {
    //Usually for data transferring
    public B: Byte = Byte.RANDOM();
    public C: Byte = Byte.RANDOM();
    public BC: DoubleByte = new DoubleByte(this.B, this.C);
    //Regular registers
    public D: Byte = Byte.RANDOM();
    public E: Byte = Byte.RANDOM();
    public DE: DoubleByte = new DoubleByte(this.D, this.E);
    //Indirect addressing
    public H: Byte = Byte.RANDOM();
    public L: Byte = Byte.RANDOM();
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
}