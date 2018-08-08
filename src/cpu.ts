import {Bit} from './bit';
import {Byte} from './byte';
import {DoubleByte} from './double-byte';
import {Memory} from './memory';
import {OpCode} from './op-code';

class CPU {
    //Accumulator
    private A: Byte = new Byte();
    //Usually for data transferring
    private B: Byte = new Byte();
    private C: Byte = new Byte();
    private BC: DoubleByte;
    //Regular registers
    private D: Byte = new Byte();
    private E: Byte = new Byte();
    private DE: DoubleByte;
    //Indirect addressing
    private H: Byte = new Byte();
    private L: Byte = new Byte();
    private HL: DoubleByte;

    private Z: Bit = new Bit();
    private N: Bit = new Bit();
    private H: Bit = new Bit();
    private C: Bit = new Bit();

    private opCodes: {[key: number] : OpCode} = {};
    private memory: Memory;

    constructor(memory: Memory) {
        this.initializeOpcodes();
        this.memory = Memory;
        this.BC = new DoubleByte(this.B, this.C);
        this.DE = new DoubleByte(this.D, this.E);
        this.HL = new DoubleByte(this.H, this.L);
    }

    private initializeOpcodes(): void {
        const add = (byte: number, logic: (data?: Byte | DoubleByte) => void, cycles: number) => {
            if (this.opCodes[byte]) {
                throw new Error(`OPCODE NUMBER ${byte} DEFINED TWICE!`);
            }
            this.opCodes[byte] = {logic, cycles};
        };
        const NOOP = () => {};

        //LD nn,n
        add(0x06, (d: Byte) => this.B = d, 8);
        add(0x0E, (d: Byte) => this.C = d, 8);
        add(0x16, (d: Byte) => this.D = d, 8);
        add(0x1E, (d: Byte) => this.E = d, 8);
        add(0x26, (d: Byte) => this.H = d, 8);
        add(0x2E, (d: Byte) => this.L = d, 8);

        //LD r1,r2
        add(0x7F, NOOP, 4);
        add(0x78, () => { this.A = this.B; }, 4);
        add(0x79, () => { this.A = this.C; }, 4);
        add(0x7A, () => { this.A = this.D; }, 4);
        add(0x7B, () => { this.A = this.E; }, 4);
        add(0x7C, () => { this.A = this.H; }, 4);
        add(0x7D, () => { this.A = this.L; }, 4);
        add(0x7E, () => { this.A = this.memory.getWord(this.HL); }, 8);

        add(0x40, NOOP , 4);
        add(0x41, () => { this.B = this.C; }, 4);
        add(0x42, () => { this.B = this.D; }, 4);
        add(0x43, () => { this.B = this.E; }, 4);
        add(0x44, () => { this.B = this.H; }, 4);
        add(0x45, () => { this.B = this.L; }, 4);
        add(0x46, () => { this.B = this.memory.getWord(this.HL); }, 8);

        add(0x48, () => { this.C = this.B; }, 4);
        add(0x49, NOOP, 4);
        add(0x4A, () => { this.C = this.D; }, 4);
        add(0x4B, () => { this.C = this.E; }, 4);
        add(0x4C, () => { this.C = this.H; }, 4);
        add(0x4D, () => { this.C = this.L; }, 4);
        add(0x4E, () => { this.C = this.memory.getWord(this.HL); }, 8);

        add(0x50, () => { this.D = this.B; }, 4);
        add(0x51, () => { this.D = this.C; }, 4);
        add(0x52, NOOP, 4);
        add(0x53, () => { this.D = this.E; }, 4);
        add(0x54, () => { this.D = this.H; }, 4);
        add(0x55, () => { this.D = this.L; }, 4);
        add(0x56, () => { this.D = this.memory.getWord(this.HL); }, 8);

        add(0x58, () => { this.E = this.B; }, 4);
        add(0x59, () => { this.E = this.C; }, 4);
        add(0x5A, () => { this.E = this.D; }, 4);
        add(0x5B, NOOP, 4);
        add(0x5C, () => { this.E = this.H; }, 4);
        add(0x5D, () => { this.E = this.L; }, 4);
        add(0x5E, () => { this.E = this.memory.getWord(this.HL); }, 8);

        add(0x60, () => { this.H = this.B; }, 4);
        add(0x61, () => { this.H = this.C; }, 4);
        add(0x62, () => { this.H = this.D; }, 4);
        add(0x63, () => { this.H = this.E; }, 4);
        add(0x64, NOOP, 4);
        add(0x65, () => { this.H = this.L; }, 4);
        add(0x66, () => { this.H = this.memory.getWord(this.HL); }, 8);

        add(0x68, () => { this.L = this.B; }, 4);
        add(0x69, () => { this.L = this.C; }, 4);
        add(0x6A, () => { this.L = this.D; }, 4);
        add(0x6B, () => { this.L = this.E; }, 4);
        add(0x6C, () => { this.L = this.H; }, 4);
        add(0x6D, NOOP, 4);
        add(0x6E, () => { this.L = this.memory.getWord(this.HL); }, 8);

        add(0x70, () => { this.memory.setWord(this.HL, this.B); }, 4);
        add(0x71, () => { this.memory.setWord(this.HL, this.C); }, 4);
        add(0x72, () => { this.memory.setWord(this.HL, this.D); }, 4);
        add(0x73, () => { this.memory.setWord(this.HL, this.E); }, 4);
        add(0x74, () => { this.memory.setWord(this.HL, this.H); }, 4);
        add(0x75, () => { this.memory.setWord(this.HL, this.L); }, 4);
        add(0x36, (data: Byte) => { this.memory.setWord(this.HL, data); }, 8);

        //LD A,n
        add(0x0A, () => { this.A = this.memory.getWord(this.BC); }, 8);
        add(0x1A, () => { this.A = this.memory.getWord(this.DE); }, 8);
        add(0xFA, (data: DoubleByte) => { this.A = this.memory.getWord(data); }, 16);
        add(0xFA, () => { /* TODO */ }, 8);

        //LD n,A
        add(0x02, () => { this.memory.setWord(this.BC, this.A); }, 8);
        add(0x12, () => { this.memory.setWord(this.DE, this.A); }, 8);
        add(0xEA, (data: DoubleByte) => { this.memory.setWord(data, this.A); }, 16);
    }

    private executeOpCode(opCode: Byte, data?: Byte | DoubleByte) {
        if (this.opCodes[opCode.toNumber()]) {
            this.opCodes[opCode.toNumber()].logic(data);
            //TODO: do something with the cycles
        } else {
            throw new Error(`Opcode ${opCode} does not exist!`);
        }
    }
}
