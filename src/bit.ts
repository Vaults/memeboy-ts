export class Bit {
    private on: boolean;

    constructor(value: number = 0) {
        this.setState(value);
    }

    public static RANDOM() {
        return new Bit(Math.round(Math.random()));
    }

    public val(): number {
        return this.on ? 1 : 0;
    }

    public setState(value: number) {
        if (!(value === 0 || value === 1)) { throw new Error(`INVALID NUMBER GIVEN TO BIT: ${value}`); }
        this.on = value === 1;
    }

    public isSet(): boolean {
        return this.on;
    }

    public flip(): void {
        this.on = !this.on;
    }

    public copy(b: Bit) {
        this.on = b.on;
    }
}
