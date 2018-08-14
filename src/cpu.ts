import {Byte} from './byte';
import {DoubleByte} from './double-byte';
import {OpCodeRegistry} from './opcodes/op-code-registry';
import {OpCode} from './opcodes/op-code';
import {Memory} from './memory';
import {numberToHex, range} from "./lib/util";
import {DEBUG} from './lib/debug';
import {RegisterRegistry} from './register-registry';

export class CPU {

    private static readonly EXTENDED_OPS: number = 0xCB;
    private opCodeRegistry: OpCodeRegistry;
    private memory: Memory;
    private programCounter: DoubleByte;
    private registerRegistry: RegisterRegistry;

    constructor(memory: Memory, programCounter: DoubleByte, opCodeRegistry: OpCodeRegistry, registerRegistry: RegisterRegistry) {
        this.memory = memory;
        this.opCodeRegistry = opCodeRegistry;
        this.programCounter = programCounter;
        this.registerRegistry = registerRegistry;
    }

    public executeBootRom() {
        while (this.getInstructionByte().toNumber() !== 0x50) {
            let debugMessage = '';
            const nextByte = this.getInstructionByte();
            debugMessage += `opCode: ${numberToHex(nextByte.toNumber())}, pointer: ${numberToHex(this.programCounter.toNumber())}, `;
            debugMessage += `flags: Z${this.registerRegistry.FZ.val()} C${this.registerRegistry.FC.val()} H${this.registerRegistry.FH.val()} N${this.registerRegistry.FN.val()}`
            if (nextByte.toNumber() !== CPU.EXTENDED_OPS) {
                const opCode: OpCode = this.opCodeRegistry.getOpCode(nextByte);
                debugMessage += `, ${opCode.logic.toString()}`;
                if (opCode.dataBytes === 0) {
                    opCode.logic();
                } else if (opCode.dataBytes === 1) {
                    this.programCounter.increment();
                    const data = this.getInstructionByte();
                    debugMessage += `, data: ${numberToHex(data.toNumber())}`;
                    opCode.logic(data);
                } else {
                    this.programCounter.increment();
                    const lo = this.getInstructionByte();
                    debugMessage += `, lo: ${numberToHex(lo.toNumber())}`;
                    this.programCounter.increment();
                    const hi = this.getInstructionByte();
                    debugMessage += `, hi: ${numberToHex(hi.toNumber())}`;



                    opCode.logic(new DoubleByte(hi, lo));
                }
            } else {
                this.programCounter.increment();
                const extOpCodeByte = this.getInstructionByte();
                debugMessage += `, ext: ${numberToHex(extOpCodeByte.toNumber())}`;
                const extOpCode: OpCode = this.opCodeRegistry.getExtendedOpCode(extOpCodeByte);
                debugMessage += `, ${extOpCode.logic.toString()}`;
                extOpCode.logic();
            }
            DEBUG.INFO(debugMessage);
            this.programCounter.increment();
        }
        DEBUG.INFO(this.memory.getWord(DoubleByte.OF(0x80FF)).toNumber().toString());
        DEBUG.INFO(this.memory.getWord(DoubleByte.OF(0x80EF)).toNumber().toString());
    }

    private getInstructionByte(): Byte {
        return this.memory.getWord(this.programCounter);
    }

    private halt(): void {

    }

    private stop(): void {

    }

    private disableInterrupts() {

    }

    private enableInterrupts() {

    }


}
