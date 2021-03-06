import {ALU} from './alu';
import {Byte} from './byte';
import {DoubleByte} from './double-byte';
import {Memory} from './memory';
import {OpCode} from './opcodes/op-code';
import {OpCodeRegistry} from './opcodes/op-code-registry';
import {RegisterRegistry} from './register-registry';
import {Stack} from './stack';

export class CPU {

    public static readonly batchTime: number = 16; //ms
    public static readonly clockSpeed: number = 4194304;
    private static readonly EXTENDED_OPS: number = 0xCB;
    private readonly opCodeRegistry: OpCodeRegistry;
    private readonly memory: Memory;
    private readonly programCounter: DoubleByte;
    private readonly registerRegistry: RegisterRegistry;
    private readonly stack: Stack;
    private readonly alu: ALU;

    public currentClock: number = 0;

    constructor(memory: Memory, programCounter: DoubleByte, opCodeRegistry: OpCodeRegistry, registerRegistry: RegisterRegistry) {
        this.memory = memory;
        this.opCodeRegistry = opCodeRegistry;
        this.programCounter = programCounter;
        this.registerRegistry = registerRegistry;
        this.stack = new Stack(memory);
        this.alu = new ALU(registerRegistry);
    }

    public run() {
        while (this.currentClock < this.getBatchSize() && this.programCounter.toNumber() !== 0x00FE) {
            this.runInstruction();
        }
    }

    public runInstruction() {
        const nextByte = this.getInstructionByte();
        if (nextByte.toNumber() !== CPU.EXTENDED_OPS) {
            const opCode: OpCode = this.opCodeRegistry.getOpCode(nextByte);
            if (opCode.dataBytes === 0) {
                opCode.logic(this.registerRegistry, this.memory, this.stack, this.alu);
            } else if (opCode.dataBytes === 1) {
                this.programCounter.increment();
                const data = this.getInstructionByte();
                opCode.logic(this.registerRegistry, this.memory, this.stack, this.alu, data);
            } else {
                this.programCounter.increment();
                const lo = this.getInstructionByte();
                this.programCounter.increment();
                const hi = this.getInstructionByte();

                opCode.logic(this.registerRegistry, this.memory, this.stack, this.alu, new DoubleByte(hi, lo));
            }
            this.currentClock += opCode.cycles;
        } else {
            this.programCounter.increment();
            const extOpCodeByte = this.getInstructionByte();
            const extOpCode: OpCode = this.opCodeRegistry.getExtendedOpCode(extOpCodeByte);
            extOpCode.logic(this.registerRegistry, this.memory, this.stack, this.alu);
            this.currentClock += extOpCode.cycles;
        }

        this.programCounter.increment();
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

    public getBatchSize() {
        return CPU.clockSpeed / (CPU.batchTime / 1000);
    }
}
