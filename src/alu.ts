import {Bit} from './bit';
import {Byte} from './byte';
import {RegisterRegistry} from './register-registry';

export class ALU {
    private registerRegistry: RegisterRegistry;

    constructor(registerRegistry: RegisterRegistry) {
        this.registerRegistry = registerRegistry;
    }

    public add(b: Byte): void {
        this.registerRegistry.A.add(b);
        this.registerRegistry.FN.setState(0);
    }

    public adc(b: Byte): void {
        this.registerRegistry.A.add(b);
        this.registerRegistry.A.add(Byte.OF(this.registerRegistry.FC.val()));
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

    }

    private checkCarry(b: Byte){

    }

}
