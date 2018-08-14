import {Bit} from './bit';
import {padZero, trueModulo} from './lib/util';

export class Byte {
    private INTERNAL_DATA: Bit[] = [0, 0, 0, 0, 0, 0, 0, 0].map((i: number) => new Bit(i));

    private CACHED_NUMBER: number;

    constructor(bits?: Bit[]) {
        if (bits !== undefined) {
            if (bits.length !== 8) { throw new Error(`Invalid bit length (${bits.length})!`); }
            const byte: Byte = new Byte();
            byte.INTERNAL_DATA = bits;
            return byte;
        }
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
        if (index < 0 || index > 7) { throw new Error(`Index ${index} out of bounds!`); }
        return this.INTERNAL_DATA[index];
    }

    public toNumber(): number {
        if (this.CACHED_NUMBER === undefined) { this.updateCachedNumber(); }
        return this.CACHED_NUMBER;
    }

    public toSignedNumber(): number {
        let num = this.toNumber();
        const isNeg = (num & 0x80) > 0;
        if (isNeg) { num = num - 0x100; }
        return num;
    }

    public add(byte: Byte) {
        const newNumber = this.safeOverflow(this.toNumber() + byte.toNumber());
        this.setByNumber(newNumber);
    }

    public addSigned(byte: Byte){
        const newNumber = this.safeOverflow(this.toNumber() + byte.toSignedNumber());
        this.setByNumber(newNumber);
    }

    public decrement() : void {
        this.setByNumber(this.safeOverflow(this.toNumber() - 1));
    }

    public increment() : void {
        this.setByNumber(this.safeOverflow(this.toNumber() + 1));
    }

    public copy(overrider: Byte) {
        overrider.INTERNAL_DATA.forEach((b: Bit, i: number) => {
            this.INTERNAL_DATA[i].copy(b);
        });
        this.updateCachedNumber();
    }

    public flip() {
        this.INTERNAL_DATA.forEach(b => b.flip());
        this.updateCachedNumber();
    }

    public swap() {
        const hiNibble = this.INTERNAL_DATA.slice(0, 4);
        const loNibble = this.INTERNAL_DATA.slice(4, 8);
        const swapped: Byte = new Byte();
        loNibble.concat(hiNibble).forEach((o, i) => swapped.getBit(i).copy(o));
        this.updateCachedNumber(swapped.toNumber());
        this.copy(swapped);
    }

    public rotate(shift: number) {
        const bitMask = (2 ** 8) - 1;
        const rot = shift & 7;
        const num: number = this.toNumber();
        const rotated : number = ((num >>> rot) | (num << (8 - rot))) & bitMask;
        this.setByNumber(rotated);
    }


    public sub(b: Byte): void {
        this.setByNumber(this.safeOverflow(this.toNumber() - b.toNumber()));
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

    private safeOverflow(n: number): number {
        return trueModulo(n, 256);
    }

    private setByNumber(byte: number) {
        if (byte < 0 || byte > 255) {throw new Error(`Byte ${byte} out of bounds!`); }
        this.updateCachedNumber(byte);
        const calc = (n: number) => (byte & (1 << (8 - n))) ? 1 : 0;
        this.INTERNAL_DATA[0].setState(calc(1));
        this.INTERNAL_DATA[1].setState(calc(2));
        this.INTERNAL_DATA[2].setState(calc(3));
        this.INTERNAL_DATA[3].setState(calc(4));
        this.INTERNAL_DATA[4].setState(calc(5));
        this.INTERNAL_DATA[5].setState(calc(6));
        this.INTERNAL_DATA[6].setState(calc(7));
        this.INTERNAL_DATA[7].setState(calc(8));
    }

    private updateCachedNumber(byte?: number) {
        if (byte !== undefined) {
            this.CACHED_NUMBER = byte;
        } else {
            this.CACHED_NUMBER = parseInt(this.INTERNAL_DATA.map((b: Bit) => b.val()).join(''), 2);
        }

    }
}
