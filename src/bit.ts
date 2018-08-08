export class Bit {
    private on: boolean;

    constructor(value: number = 0) {
        if (!(value === 0 || value === 1)) { throw new Error('INVALID NUMBER GIVEN TO BIT'); }
        this.on = value === 1;
    }

    public val(): number {
        return this.on ? 1 : 0;
    }

    public flip(): void {
        this.on = !this.on;
    }
}
