import {Bit} from './bit';
import {Byte} from './byte';

export class BitByte extends Byte {

    private INTERNAL_DATA: Bit[] = [0, 0, 0, 0, 0, 0, 0, 0].map((i: number) => new Bit(i));

    constructor(bits?: Bit[]) {
        super();
        if (bits === undefined || bits.length !== 8) { throw new Error(`Invalid bits! (${bits})!`); }
        this.INTERNAL_DATA = bits;
        this.updateCachedNumber();
    }

    public static OF(b: number): BitByte {
        const byte: BitByte = new BitByte();
        byte.setByNumber(b);
        return byte;
    }

    public getBit(index: number): Bit {
        if (index < 0 || index > 7) { throw new Error(`Index ${index} out of bounds!`); }
        return this.INTERNAL_DATA[index];
    }

    public setBit(index: number, bit: Bit){
        this.getBit(index).copy(bit);
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

    protected setByNumber(byte: number) {
        if (byte < 0 || byte > 255) {throw new Error(`Byte ${byte} out of bounds!`); }
        this.updateCachedNumber(byte);
        this.INTERNAL_DATA[0].setState(this.bit(0));
        this.INTERNAL_DATA[1].setState(this.bit(1));
        this.INTERNAL_DATA[2].setState(this.bit(2));
        this.INTERNAL_DATA[3].setState(this.bit(3));
        this.INTERNAL_DATA[4].setState(this.bit(4));
        this.INTERNAL_DATA[5].setState(this.bit(5));
        this.INTERNAL_DATA[6].setState(this.bit(6));
        this.INTERNAL_DATA[7].setState(this.bit(7));
    }

    private updateCachedNumber(byte?: number) {
        if (byte !== undefined) {
            this.CACHED_NUMBER = byte;
        } else {
            this.CACHED_NUMBER = parseInt(this.INTERNAL_DATA.map((b: Bit) => b.val()).join(''), 2);
        }

    }
}
