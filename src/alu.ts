import {Bit} from './bit';
import {Byte} from './byte';
import {RegisterRegistry} from './register-registry';

export class ALU {
    private registerRegistry: RegisterRegistry;

    constructor(registerRegistry: RegisterRegistry) {
        this.registerRegistry = registerRegistry;
    }

    public add(b: Byte): void {
        this.checkHalfCarry(b);
        this.checkCarry(b);
        this.registerRegistry.A.add(b);
        if (this.registerRegistry.A.toNumber() === 0){
            this.registerRegistry.FZ.setState(0);
        }
        this.registerRegistry.FN.setState(0);
    }

    public adc(b: Byte): void {
        const copy: Byte = new Byte();
        copy.copy(b);
        copy.add(Byte.OF(this.registerRegistry.FC.val()));

        this.checkHalfCarry(b);
        this.checkCarry(b);
        this.registerRegistry.A.add(b);
        if (this.registerRegistry.A.toNumber() === 0){
            this.registerRegistry.FZ.setState(0);
        }
        this.registerRegistry.FN.setState(0);
    }

    public sub(b: Byte): void {
        this.registerRegistry.A.sub(b);
    }
    public sbc(b: Byte): void {
        this.registerRegistry.A.sub(b);
        this.registerRegistry.A.sub(Byte.OF(this.registerRegistry.FC.val()));
    }
    public and(b: Byte): void {
        this.registerRegistry.A.and(b);
    }
    public or(b: Byte): void {
        this.registerRegistry.A.or(b);
    }
    public xor(b: Byte): void {
        this.registerRegistry.A.xor(b);
        if (this.registerRegistry.A.toNumber() === 0){
            this.registerRegistry.FZ.setState(0);
        }
        this.registerRegistry.FN.setState(0);
        this.registerRegistry.FH.setState(0);
        this.registerRegistry.FC.setState(0);

    }
    public cp(b: Byte): void {
        //TODO
    }
    public inc(b: Byte): void {
        this.registerRegistry.A.increment();
    }
    public dec(b: Byte): void {
        this.registerRegistry.A.decrement();
    }

    private checkHalfCarry(b: Byte) {
        const A = this.registerRegistry.A;
        if (((A.toNumber() & 0xF) + (b.toNumber() & 0xF) & 0x10) === 0x10){
            this.registerRegistry.FH.setState(1);
        }
    }

    private checkCarry(b: Byte){
        const A = this.registerRegistry.A;
        if (((A.toNumber() & 0xFF) + (b.toNumber() & 0xFF) & 0x100) === 0x100) {
            this.registerRegistry.FH.setState(1);
        }
    }

}
