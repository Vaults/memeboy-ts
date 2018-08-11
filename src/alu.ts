import {Bit} from './bit';
import {Byte} from './byte';
import {RegisterRegistry} from './register-registry';

export class ALU {
    private registerRegistry: RegisterRegistry;

    constructor(registerRegistry: RegisterRegistry) {
        this.registerRegistry = registerRegistry;
    }

    public add(b: Byte): void { }
    public adc(b: Byte): void { }
    public sub(b: Byte): void { }
    public sbc(b: Byte): void { }
    public and(b: Byte): void { }
    public or(b: Byte): void { }
    public xor(b: Byte): void { }
    public cp(b: Byte): void { }
    public inc(b: Byte): void { }
    public dec(b: Byte): void { }

}
