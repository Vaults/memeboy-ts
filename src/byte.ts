export class Byte {
    private INTERNAL_DATA: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

    constructor(byte: number = 0) {
        this.setByNumber(byte);
    }

    public getBit(index: number): number {
        if (index < 0 || index > 7) { throw new Error(`Index ${index} out of bounds!`); }
        return this.INTERNAL_DATA[index];
    }

    public toNumber() {
        return parseInt(this.INTERNAL_DATA.join(''), 2);
    }

    public add(byte: Byte) {
        const newNumber = (this.toNumber() + byte.toNumber()) % 2 ** 8;
        this.setByNumber(newNumber);
    }

    private setByNumber(byte: number) {
        if (byte < 0 || byte > 255) {throw new Error(`Byte ${byte} out of bounds!`); }
        this.INTERNAL_DATA = byte.toString(2).split('').map(Number);
    }
}
