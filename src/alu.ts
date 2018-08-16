import {Bit} from './bit';
import {Byte} from './byte';
import {RegisterRegistry} from './register-registry';
import {DEBUG} from './lib/debug';
import {numberToHex} from './lib/util';

export class ALU {
    //TODO: CHECK ALL FLAGS
    private registerRegistry: RegisterRegistry;

    constructor(registerRegistry: RegisterRegistry) {
        this.registerRegistry = registerRegistry;
    }

    public add(b: Byte): void {
        this.checkHalfCarry(b);
        this.checkCarry(b);
        this.registerRegistry.A.add(b);
        this.registerRegistry.checkZero(this.registerRegistry.A);
        this.registerRegistry.FN.setState(0);
    }

    public adc(b: Byte): void {
        const copy: Byte = new Byte();
        copy.copy(b);
        copy.add(Byte.OF(this.registerRegistry.FC.val()));

        this.checkHalfCarry(b);
        this.checkCarry(b);
        this.registerRegistry.A.add(b);
        this.registerRegistry.checkZero(this.registerRegistry.A);
        this.registerRegistry.FN.setState(0);
    }

    public sub(b: Byte): void {
        this.registerRegistry.A.sub(b);
        this.registerRegistry.checkZero(this.registerRegistry.A);
        this.registerRegistry.FN.setState(0);
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
        this.registerRegistry.checkZero(this.registerRegistry.A);
        this.registerRegistry.FN.setState(0);
        this.registerRegistry.FH.setState(0);
        this.registerRegistry.FC.setState(0);

    }
    public cp(b: Byte): void {
        const copy: Byte = Byte.OF(0xFF);
        copy.copy(this.registerRegistry.A);
        copy.sub(b);
        this.registerRegistry.checkZero(copy);

        this.registerRegistry.FN.setState(1);
        this.registerRegistry.FH.setState(0);
        this.registerRegistry.FC.setState(0);
    }
    public inc(b: Byte): void {
        b.decrement();
        this.registerRegistry.checkZero(b);
        this.registerRegistry.FN.setState(1);
        //TODO
        this.registerRegistry.FH.setState(0);
        this.registerRegistry.FC.setState(0);
    }
    public dec(b: Byte): void {
        b.decrement();
        this.registerRegistry.checkZero(b);
        this.registerRegistry.FN.setState(1);
        //TODO
        this.registerRegistry.FH.setState(0);
        this.registerRegistry.FC.setState(0);
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
