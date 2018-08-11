import {Bit} from './bit';
import {padZero, trueModulo} from './lib/util';

export class Byte {
    private INTERNAL_DATA: Bit[] = [0, 0, 0, 0, 0, 0, 0, 0].map((i: number) => new Bit(i));

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

    public getBit(index: number): Bit {
        if (index < 0 || index > 7) { throw new Error(`Index ${index} out of bounds!`); }
        return this.INTERNAL_DATA[index];
    }

    public toNumber(): number {
        return parseInt(this.INTERNAL_DATA.map((b: Bit) => b.val()).join(''), 2);
    }

    public add(byte: Byte) {
        const newNumber = this.safeOverflow(trueModulo(this.toNumber() + byte.toNumber(), 256));
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
    }

    public flip() {
        this.INTERNAL_DATA.forEach(b => b.flip());
    }

    public swap() {
        const hiNibble = this.INTERNAL_DATA.slice(0, 4);
        const loNibble = this.INTERNAL_DATA.slice(4, 8);
        const swapped: Byte = new Byte();
        loNibble.concat(hiNibble).forEach((o, i) => swapped.getBit(i).copy(o));
        this.copy(swapped);
    }

    private safeOverflow(n: number): number{
        return trueModulo(n, 256);
    }

    private setByNumber(byte: number) {
        if (byte < 0 || byte > 255) {throw new Error(`Byte ${byte} out of bounds!`); }
        const binary = padZero(byte.toString(2), 8).split('').map(i => parseInt(i, 2));
        binary.map((bit, index) => this.INTERNAL_DATA[index].copy(new Bit(bit)));
    }
}
