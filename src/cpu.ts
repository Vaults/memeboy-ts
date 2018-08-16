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
        let drmCounter = 0;
        while (this.programCounter.toNumber() !== 0x00FE) {
            if(this.programCounter.toNumber() === 0x00E9 || this.programCounter.toNumber() === 0x00FA) {
                drmCounter++;
                if(drmCounter > 100) {
                    throw new Error('I am dead and I have died because the ROM is invalid :((((((((')
                }
            }
            const nextByte = this.getInstructionByte();
            if (nextByte.toNumber() !== CPU.EXTENDED_OPS) {
                const opCode: OpCode = this.opCodeRegistry.getOpCode(nextByte);
                if (opCode.dataBytes === 0) {
                    opCode.logic();
                } else if (opCode.dataBytes === 1) {
                    this.programCounter.increment();
                    const data = this.getInstructionByte();
                    opCode.logic(data);
                } else {
                    this.programCounter.increment();
                    const lo = this.getInstructionByte();
                    this.programCounter.increment();
                    const hi = this.getInstructionByte();

                    opCode.logic(new DoubleByte(hi, lo));
                }
            } else {
                this.programCounter.increment();
                const extOpCodeByte = this.getInstructionByte();
                const extOpCode: OpCode = this.opCodeRegistry.getExtendedOpCode(extOpCodeByte);
                extOpCode.logic();
            }
            this.programCounter.increment();
        }

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
