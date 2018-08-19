import {Bit} from './bit';
import {bitmask, safeByteOverflow, trueModulo} from './lib/util';

export class Byte {

    protected CACHED_NUMBER: number;

    constructor() {
        this.CACHED_NUMBER = 0;
    }

    public static OF(b: number): Byte {
        const byte: Byte = new Byte();
        byte.setByNumber(b);
        return byte;
    }

    public static RANDOM(): Byte {
        return Byte.OF(~~(Math.random() * 256));
    }

    public getBit(index: number): Bit {
        this.checkIndex(index);
        return new Bit(this.bit(index));
    }

    public toNumber(): number {
        return this.CACHED_NUMBER;
    }

    public toSignedNumber(): number {
        let num = this.toNumber();
        const isNeg = (num & 0x80) > 0;
        if (isNeg) { num = num - 0x100; }
        return num;
    }

    public add(byte: Byte) {
        const newNumber = safeByteOverflow(this.toNumber() + byte.toNumber());
        this.setByNumber(newNumber);
    }

    public addSigned(byte: Byte) {
        const newNumber = safeByteOverflow(this.toNumber() + byte.toSignedNumber());
        this.setByNumber(newNumber);
    }

    public decrement() : void {
        this.setByNumber(safeByteOverflow(this.toNumber() - 1));
    }

    public increment() : void {
        this.setByNumber(safeByteOverflow(this.toNumber() + 1));
    }

    public copy(overrider: Byte) {
        this.setByNumber(overrider.toNumber())
    }

    public flip() {
        this.CACHED_NUMBER = 255 - this.CACHED_NUMBER;
    }

    public swap() {
        const lo = this.CACHED_NUMBER % 16
        const hi = (this.CACHED_NUMBER - lo) / 16;
        this.CACHED_NUMBER = lo * 16 + hi;
    }

    public rotate(shift: number) {
        const bitMask = (2 ** 8) - 1;
        const rot = trueModulo(shift, 8) & 7;
        const num: number = this.toNumber();
        const rotated : number = ((num >>> rot) | (num << (8 - rot))) & bitMask;
        this.setByNumber(rotated);
    }

    public sub(b: Byte): void {
        this.setByNumber(safeByteOverflow(this.toNumber() - b.toNumber()));
    }

    public and(b: Byte): void {
        this.setByNumber(this.toNumber() & b.toNumber());
    }

    public or(b: Byte): void {
        this.setByNumber(this.toNumber() | b.toNumber());
    }

    public xor(b: Byte): void {
        this.setByNumber(this.toNumber() ^ b.toNumber());
    }

    public setBit(index: number, bit: Bit) {
        this.checkIndex(index);
        const mask = bitmask(index);
        if (bit.isSet()) {
            this.setByNumber(this.CACHED_NUMBER | mask);
        } else {
            this.setByNumber(this.CACHED_NUMBER & ~mask);
        }
    }

    protected setByNumber(byte: number) {
        if (byte < 0 || byte > 255) {throw new Error(`Byte ${byte} out of bounds!`); }
        this.CACHED_NUMBER = byte;
    }

    protected bit(index: number) {
        return (this.CACHED_NUMBER & bitmask(index)) ? 1 : 0;
    }

    private checkIndex(index: number) {
        if (index < 0 || index > 7) {
            throw new Error(`Index ${index} out of bounds!`);
        }
    }

}
