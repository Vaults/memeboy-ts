import {Byte} from './byte';
import {DoubleByte} from './double-byte';
import {Bit} from './bit';

export class RegisterRegistry {
    //Usually for data transferring
    public B: Byte = new Byte();
    public C: Byte = new Byte();
    public BC: DoubleByte = new DoubleByte(this.B, this.C);
    //Regular registers
    public D: Byte = new Byte();
    public E: Byte = new Byte();
    public DE: DoubleByte = new DoubleByte(this.D, this.E);
    //Indirect addressing
    public H: Byte = new Byte();
    public L: Byte = new Byte();
    public HL: DoubleByte = new DoubleByte(this.H, this.L);

    //Accumulator
    public A: Byte = new Byte();
    //Flags
    public FZ: Bit = new Bit();
    public FN: Bit = new Bit();
    public FH: Bit = new Bit();
    public FC: Bit = new Bit();

    public F: Byte = new Byte([this.FZ, this.FN, this.FC, this.FH, new Bit(0), new Bit(0), new Bit(0), new Bit(0)]);
    public AF: DoubleByte = new DoubleByte(this.A, this.F);

    public PC: DoubleByte = DoubleByte.OF(0x0000);

    constructor() {

    }
}