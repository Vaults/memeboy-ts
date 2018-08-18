import {ALU} from '../alu';
import {Byte} from '../byte';
import {DEBUG} from '../lib/debug';
import {numberToHex, range} from '../lib/util';
import {Memory} from '../memory';
import {RegisterRegistry} from '../register-registry';
import {Stack} from '../stack';
import {OpCode} from './op-code';
import {OpCodeSupplier} from './suppliers/op-code-supplier';

export type OpCodeMap = {[key: number] : OpCode};

export class OpCodeRegistry {
    public readonly opCodes: OpCodeMap = {};
    public readonly extendedOpCodes: OpCodeMap = {};

    private readonly registerRegistry: RegisterRegistry;
    private readonly memory: Memory;
    private readonly stack: Stack;
    private readonly alu: ALU;

    constructor(registerRegistry: RegisterRegistry, memory: Memory, opcodes: OpCodeSupplier[], extOpcodes: OpCodeSupplier[]){
        this.registerRegistry = registerRegistry;
        this.memory = memory;
        this.mergeSuppliers(opcodes, extOpcodes);
    }


    public checkInitializedOpcodes() {

        const checkInitialized = (opCodes: {[key: number] : OpCode}, iden: string) => {
            if (Object.keys(opCodes).length !== 255) {
                const numbers = range(0, 256).filter(i => opCodes[i] === undefined);
                const numberList = numbers.map(i => numberToHex(i)).join(',');
                const message: string = `Not all ${iden}opcodes were initialized (missing ${numbers.length})!\n Missing ${iden}opcodes: ${numberList}`;
                DEBUG.WARN(message);
            }
        };

        checkInitialized(this.opCodes, '');
        checkInitialized(this.extendedOpCodes, 'extended');

    }

    public getOpCode(b: Byte) {
        const opCode: OpCode = this.opCodes[b.toNumber()];
        if (opCode) {
            return this.opCodes[b.toNumber()];
        } else {
            throw new Error(`Opcode ${numberToHex(b.toNumber())} does not exist!`);
        }
    }

    public getExtendedOpCode(b: Byte) {
        const opCode: OpCode = this.extendedOpCodes[b.toNumber()];
        if (opCode) {
            return this.extendedOpCodes[b.toNumber()];
        } else {
            throw new Error(`Extended Opcode ${numberToHex(b.toNumber())} does not exist!`);
        }
    }

    private mergeSuppliers(opcodes: OpCodeSupplier[], extOpcodes: OpCodeSupplier[]) {
        opcodes.forEach(supplier => this.mergeSupplier(this.opCodes, supplier));
        extOpcodes.forEach(supplier => this.mergeSupplier(this.extendedOpCodes, supplier));
    }

    private mergeSupplier(map: OpCodeMap, supplier: OpCodeSupplier) {
        supplier.supply().forEach(tuple => {
            const location: number = tuple[0];
            if (map[location] !== undefined) {
                throw new Error(`OPCODE NUMBER ${numberToHex(location)} DEFINED TWICE!`);
            }
            map[location] = tuple[1];
        });

    }

}
