import {Bit} from './bit';

export class Byte {
    private INTERNAL_DATA: Bit[] = [0, 0, 0, 0, 0, 0, 0, 0].map((i: number) => new Bit(i));

    constructor(byte: number = 0) {
        this.setByNumber(byte);
    }

    public static OF(bits: Bit[]) {
        if (bits.length !== 8) { throw new Error('Invalid bits!'); }
        const byte: Byte = new Byte();
        byte.INTERNAL_DATA = bits;
        return byte;
    }

    public getBit(index: number): Bit {
        if (index < 0 || index > 7) { throw new Error(`Index ${index} out of bounds!`); }
        return this.INTERNAL_DATA[index];
    }

    public toNumber() {
        return parseInt(this.INTERNAL_DATA.map((b: Bit) => b.val()).join(''), 2);
    }

    public add(byte: Byte) {
        const newNumber = (this.toNumber() + byte.toNumber()) % 2 ** 8;
        this.setByNumber(newNumber);
    }

    public decrement() : void {
        this.setByNumber(this.toNumber() - 1);
    }

    public increment() : void {
        this.setByNumber(this.toNumber() + 1);
    }

    public copy(overwriter: Byte){
        overwriter.INTERNAL_DATA.forEach((b: Bit, i: number) => {
            this.INTERNAL_DATA[i].copy(b);
        });
    }

    private setByNumber(byte: number) {
        if (byte < 0 || byte > 255) {throw new Error(`Byte ${byte} out of bounds!`); }
        this.INTERNAL_DATA = byte.toString(2).split('').map(Number).map((i: number) => new Bit(i));
    }
}
