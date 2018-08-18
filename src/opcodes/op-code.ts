import {ALU} from '../alu';
import {Byte} from '../byte';
import {DoubleByte} from '../double-byte';
import {Memory} from '../memory';
import {RegisterRegistry} from '../register-registry';
import {Stack} from '../stack';

export type OpCodeLogic = (r: RegisterRegistry, m: Memory, s: Stack, a: ALU, data?: Byte | DoubleByte) => void;

export class OpCode {

    public logic: OpCodeLogic;
    public cycles: number;
    public dataBytes: number;

    constructor(logic: OpCodeLogic, cycles: number, dataBytes: number = 0) {
        this.logic = logic;
        this.cycles = cycles;
        this.dataBytes = dataBytes;
    }
}
