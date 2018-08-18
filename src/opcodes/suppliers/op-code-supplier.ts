import {asTupleList, numberToHex} from '../../lib/util';
import {OpCode, OpCodeLogic} from '../op-code';
import {OpCodeMap} from '../op-code-registry';

export abstract class OpCodeSupplier {

    private opCodes: OpCodeMap = {};

    constructor() {
        this.registerOpcodes();
    }

    public supply(): [number, OpCode][] {
        return asTupleList(this.opCodes);
    }

    protected abstract registerOpcodes(): void;

    protected add(byte: number, logic: OpCodeLogic, cycles: number, dataBytes?: number) {
        if (this.opCodes[byte] !== undefined) {
            throw new Error(`OPCODE NUMBER ${numberToHex(byte)} DEFINED TWICE!`);
        }
        this.opCodes[byte] = new OpCode(logic, cycles, dataBytes);
    }



}
